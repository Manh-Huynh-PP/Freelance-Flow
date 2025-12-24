/**
 * Supabase Storage Service for Share functionality
 * Replaces Vercel Blob storage
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-load Supabase admin client to prevent build-time failures
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase env missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY required');
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseAdmin;
}

const BUCKET_NAME = 'shares';

// Initialize bucket if not exists (call once on app start or deploy)
export async function initSharesBucket() {
  const { data: buckets } = await getSupabaseAdmin().storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!exists) {
    const { error } = await getSupabaseAdmin().storage.createBucket(BUCKET_NAME, {
      public: true, // Share links are public
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
    });
    if (error) {
      console.error('Failed to create shares bucket:', error);
    }
  }
}

// Types
export interface ShareRecord {
  id: string;
  userId: string;
  title?: string;
  kind: 'quote' | 'timeline' | 'combined';
  createdAt: string;
  expiresAt?: string | null;
  viewCount?: number;
}

export interface ShareBlob {
  kind: 'quote' | 'timeline' | 'combined';
  schemaVersion: number;
  data: any;
}

// Hash function for user bucket
export function userBucketId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Generate share paths
export function buildSharePaths(userBucket: string, shareId: string) {
  const prefix = `${userBucket}`;
  const blobPath = `${prefix}/${shareId}.json`;
  const indexPath = `${prefix}/_index.json`;
  return { prefix, blobPath, indexPath };
}

// Upload share data
export async function uploadShare(userId: string, shareId: string, data: ShareBlob, record: ShareRecord): Promise<{ url: string }> {
  const userBucket = userBucketId(userId);
  const { blobPath, indexPath } = buildSharePaths(userBucket, shareId);

  // 1. Get existing index to check Limits
  let index: { items: ShareRecord[] } = { items: [] };
  try {
    const { data: existingIndex } = await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .download(indexPath);
    if (existingIndex) {
      const text = await existingIndex.text();
      index = JSON.parse(text);
    }
  } catch {
    // Index doesn't exist yet
  }

  // 2. Enforce Limit: Max 20 Active Shares
  // Filter out any that are being replaced (update scenario) -> logic below filters by ID
  const activeCount = index.items.filter(i => i.id !== shareId).length;
  if (activeCount >= 20) {
    throw new Error('Limit reached: Maximum 20 shared links allowed per user. Please delete old links to create new ones.');
  }

  // 3. Enforce Expiration: Default 30 Days if not set
  if (!record.expiresAt) {
    const date = new Date();
    date.setDate(date.getDate() + 30); // +30 days
    record.expiresAt = date.toISOString();
  }

  // Upload the share data
  const { error: uploadError } = await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .upload(blobPath, JSON.stringify(data), {
      contentType: 'application/json',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload share: ${uploadError.message}`);
  }

  // Add new record
  index.items = index.items.filter(i => i.id !== shareId); // Remove if exists
  index.items.unshift(record);

  // Save index
  await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .upload(indexPath, JSON.stringify(index), {
      contentType: 'application/json',
      upsert: true,
    });

  // Also save to global ID map for quick lookup
  const globalMapPath = `_global/${shareId}.json`;
  await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .upload(globalMapPath, JSON.stringify({
      userBucket,
      blobPath,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt
    }), {
      contentType: 'application/json',
      upsert: true,
    });

  return { url: `/s/${shareId}` };
}

// Download share data by ID
export async function downloadShare(shareId: string): Promise<ShareBlob | null> {
  // First lookup in global map
  const globalMapPath = `_global/${shareId}.json`;
  const { data: mapData, error: mapError } = await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .download(globalMapPath);

  if (mapError || !mapData) {
    return null;
  }

  const mapText = await mapData.text();
  const map = JSON.parse(mapText);

  // Lazy Cleanup: Check Expiration
  if (map.expiresAt && new Date(map.expiresAt) < new Date()) {
    console.log(`[Share] Expired share ${shareId} found. Cleaning up...`);

    // Delete content and global map
    // We leave the user index entry for now as it requires parsing another file
    // It will be a broken link until user deletes it or we run a full sweep
    await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .remove([globalMapPath, map.blobPath]);

    return null;
  }

  // Download the actual share data
  const { data, error } = await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .download(map.blobPath);

  if (error || !data) {
    return null;
  }

  const text = await data.text();
  return JSON.parse(text);
}

// List user's shares
export async function listShares(userId: string): Promise<ShareRecord[]> {
  const userBucket = userBucketId(userId);
  const { indexPath } = buildSharePaths(userBucket, '');

  try {
    const { data, error } = await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .download(indexPath);

    if (error || !data) {
      return [];
    }

    const text = await data.text();
    const index = JSON.parse(text);
    return index.items || [];
  } catch {
    return [];
  }
}

// Delete a share
export async function deleteShare(userId: string, shareId: string): Promise<boolean> {
  const userBucket = userBucketId(userId);
  const { blobPath, indexPath } = buildSharePaths(userBucket, shareId);

  // Delete the share data
  await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .remove([blobPath]);

  // Delete from global map
  const globalMapPath = `_global/${shareId}.json`;
  await getSupabaseAdmin().storage
    .from(BUCKET_NAME)
    .remove([globalMapPath]);

  // Update index
  try {
    const { data } = await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .download(indexPath);

    if (data) {
      const text = await data.text();
      const index = JSON.parse(text);
      index.items = index.items.filter((i: ShareRecord) => i.id !== shareId);

      await getSupabaseAdmin().storage
        .from(BUCKET_NAME)
        .upload(indexPath, JSON.stringify(index), {
          contentType: 'application/json',
          upsert: true,
        });
    }
  } catch {
    // Index update failed, but share is deleted
  }

  return true;
}

// Delete ALL shares for a user
export async function deleteAllShares(userId: string): Promise<boolean> {
  try {
    const shares = await listShares(userId);
    if (shares.length === 0) return true;

    const userBucket = userBucketId(userId);
    const pathsToDelete: string[] = [];

    // Collect all paths
    for (const share of shares) {
      const { blobPath } = buildSharePaths(userBucket, share.id);
      pathsToDelete.push(blobPath);
      pathsToDelete.push(`_global/${share.id}.json`);
    }

    // Add index file to deletion list
    const { indexPath } = buildSharePaths(userBucket, '');
    pathsToDelete.push(indexPath);

    if (pathsToDelete.length > 0) {
      const { error } = await getSupabaseAdmin().storage
        .from(BUCKET_NAME)
        .remove(pathsToDelete);

      if (error) {
        console.error('Failed to delete shares:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting all shares:', error);
    return false;
  }
}

// Update share record (title, expiry)
export async function updateShare(userId: string, shareId: string, updates: Partial<ShareRecord>): Promise<ShareRecord | null> {
  const userBucket = userBucketId(userId);
  const { indexPath } = buildSharePaths(userBucket, shareId);

  try {
    const { data } = await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .download(indexPath);

    if (!data) return null;

    const text = await data.text();
    const index = JSON.parse(text);
    const item = index.items.find((i: ShareRecord) => i.id === shareId);

    if (!item) return null;

    // Apply updates
    if (updates.title !== undefined) item.title = updates.title;
    if (updates.expiresAt !== undefined) item.expiresAt = updates.expiresAt;

    // Save index
    await getSupabaseAdmin().storage
      .from(BUCKET_NAME)
      .upload(indexPath, JSON.stringify(index), {
        contentType: 'application/json',
        upsert: true,
      });

    return item;
  } catch {
    return null;
  }
}

// Track view count
export async function trackView(shareId: string): Promise<void> {
  // For simplicity, we can skip view tracking or implement via a separate table
  // This is optional functionality
  console.log(`[Share] View tracked for ${shareId}`);
}

// Generate unique share ID
export function generateShareId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

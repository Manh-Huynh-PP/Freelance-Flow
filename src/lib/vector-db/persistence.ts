import type { Document } from './types';

/**
 * Persist vectors - No-op since local storage removal
 * Vectors should ideally be stored in Supabase in the future
 */
export async function persistTaskVectors(docs: Document[]): Promise<void> {
  // No-op
  return;
}

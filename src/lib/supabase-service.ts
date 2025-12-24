import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Public env vars are required for client usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'X-Client-App': 'freelance-flow',
        },
      },
    });
  }
  return supabase;
}

// Sync NextAuth session with Supabase
// NextAuth sync removed; Supabase Auth is now the single source of truth

// Data Layer: adapters for Supabase tables
// Each collection is a table with per-row entities
export type TableName = 'clients' | 'projects' | 'tasks' | 'quotes' | 'settings';

export async function fetchAll<T>(table: TableName): Promise<T[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from(table).select('*');
  if (error) throw error;
  return (data as unknown) as T[];
}

export async function upsertRow<T extends Record<string, any>>(table: TableName, row: T): Promise<T> {
  const client = getSupabaseClient();
  const { data, error } = await client.from(table).upsert(row).select('*').single();
  if (error) throw error;
  return (data as unknown) as T;
}

export async function deleteRow(table: TableName, idField: string, id: string | number): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from(table).delete().eq(idField, id);
  if (error) throw error;
}

// Realtime subscription helper
export function subscribeTable(
  table: TableName,
  onChange: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; new?: any; old?: any }) => void,
) {
  const client = getSupabaseClient();
  const channel = client
    .channel(`realtime:${table}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        const { eventType, new: n, old } = payload as any;
        onChange({ eventType, new: n, old });
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      client.removeChannel(channel);
    },
  };
}

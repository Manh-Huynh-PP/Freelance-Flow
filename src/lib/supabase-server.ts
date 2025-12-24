import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Lazy-load env vars to prevent build-time failures
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase env missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required');
  }

  return { supabaseUrl, supabaseAnonKey };
}

// Server-side Supabase client with access token from Authorization header
export async function createServerClient(accessToken?: string) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken ? {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    } : undefined,
  });

  return client;
}

// Get access token from Authorization header
export async function getAccessTokenFromHeader(): Promise<string | null> {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

// Get session from server using Authorization header
export async function getServerSession() {
  const accessToken = await getAccessTokenFromHeader();

  if (!accessToken) {
    // Check for admin local mode in development
    if (process.env.NODE_ENV === 'development') {
      const cookieStore = await cookies();
      const adminMode = cookieStore.get('admin-local-mode')?.value === 'true';
      if (adminMode) {
        // Return mock session for admin local mode
        return {
          user: {
            id: 'admin-local',
            email: 'admin@local.dev',
          },
          access_token: 'admin-local-token',
        };
      }
    }
    return null;
  }

  const supabase = await createServerClient(accessToken);
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    console.error('Error getting server user:', error);
    return null;
  }

  // Return session-like object
  return {
    user,
    access_token: accessToken,
  };
}

// Get user from server
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}

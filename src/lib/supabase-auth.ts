import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy-load Supabase client to prevent build-time failures
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase env missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required');
    }

    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Export getter for components that need the raw client
export const getSupabaseClient = getSupabase;

// Auth helper functions
export const auth = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: { name?: string }) {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },



  // Sign out
  async signOut() {
    const { error } = await getSupabase().auth.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data, error } = await getSupabase().auth.getSession();
    return { data: data.session, error };
  },

  // Get current user
  async getUser() {
    const { data, error } = await getSupabase().auth.getUser();
    return { data: data.user, error };
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return getSupabase().auth.onAuthStateChange(callback);
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    return { data, error };
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { data, error } = await getSupabase().auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
}

// Helper to setup session cleanup for non-remember-me logins
export function setupSessionCleanup() {
  if (typeof window === 'undefined') return;

  const rememberMe = localStorage.getItem('remember-me') === 'true';

  if (!rememberMe) {
    // If user didn't choose "remember me", sign out when window closes
    window.addEventListener('beforeunload', async () => {
      await auth.signOut();
    });
  }
}



// Authenticated fetch - automatically adds Authorization header with access token
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { data } = await getSupabase().auth.getSession();

  const headers = new Headers(options.headers);

  if (data?.session?.access_token) {
    headers.set('Authorization', `Bearer ${data.session.access_token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

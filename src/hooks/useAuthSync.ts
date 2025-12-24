// src/hooks/useAuthSync.ts
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { syncUserWithSupabase } from '@/lib/auth-supabase-sync';

export function useAuthSync() {
  const { session, loading } = useAuth();
  const status = loading ? 'loading' : (session ? 'authenticated' : 'unauthenticated');
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function syncUser() {
      if (status === 'authenticated' && session?.user?.email && !supabaseUser) {
        setIsLoading(true);
        try {
          const profile = await syncUserWithSupabase();
          setSupabaseUser(profile);
          console.log('🔄 Auth sync completed:', profile);
        } catch (error) {
          console.error('❌ Auth sync failed:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    syncUser();
  }, [session, status, supabaseUser]);

  return {
    session,
    supabaseUser,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isLoading,
    userId: supabaseUser?.id || null
  };
}
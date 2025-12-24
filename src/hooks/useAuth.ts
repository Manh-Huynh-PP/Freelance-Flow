'use client';

import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { auth } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: session, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }

      setAuthState({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      });
    });

    // Listen for auth changes
    const { data: authListener } = auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session: session ?? null,
          loading: false,
        }));

        // Redirect on sign out
        if (event === 'SIGNED_OUT') {
          router.push('/auth/login');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await auth.signIn(email, password);
    setAuthState(prev => ({ ...prev, loading: false }));
    return result;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await auth.signUp(email, password, { name });
    setAuthState(prev => ({ ...prev, loading: false }));
    return result;
  };



  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await auth.signOut();
    setAuthState(prev => ({ ...prev, loading: false }));
    return result;
  };

  const resetPassword = async (email: string) => {
    return await auth.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    return await auth.updatePassword(newPassword);
  };

  return {
    ...authState,
    signIn,
    signUp,

    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!authState.session,
  };
}

// Hook for protecting routes
export function useRequireAuth(redirectUrl = '/auth/login') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, loading, router, redirectUrl]);

  return { isAuthenticated, loading };
}

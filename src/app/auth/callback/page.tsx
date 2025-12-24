'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase-auth';
import { Loader2 } from 'lucide-react';

// OAuth callback handler
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Get session from URL hash
    auth.getSession().then(({ data: session, error }) => {
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login?error=callback');
      } else if (session) {
        // Check for 'next' param in URL
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        router.push(next || '/dashboard');
      } else {
        router.push('/auth/login');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

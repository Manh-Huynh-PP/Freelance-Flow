'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/landing/LandingPage';
import { auth } from '@/lib/supabase-auth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    auth.getSession().then(({ data: session }) => {
      if (session) {
        // User is logged in, redirect to dashboard
        router.replace('/dashboard');
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <LandingPage />;
}

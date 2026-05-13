'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login after a short delay
        const timeout = setTimeout(() => {
            router.push('/auth/login');
        }, 3000);
        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Registration Closed</CardTitle>
                    <CardDescription>
                        New account registration is currently disabled.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex flex-col items-center py-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
                    <Link href="/auth/login" className="text-primary hover:underline font-medium text-sm mt-4">
                        Click here if not redirected
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

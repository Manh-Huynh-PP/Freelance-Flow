'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthLoadingProps {
  message?: string;
}

export function AuthLoading({ message = 'Authenticating...' }: AuthLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary/20 mx-auto"></div>
        </div>
        <h2 className="text-lg font-semibold mb-2">Freelance Flow</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
'use client';

import { Suspense } from 'react';
import SignInForm from '@/components/signin-form';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memuat halaman login...</p>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

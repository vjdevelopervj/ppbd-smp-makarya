'use client';

import RegistrationForm from '@/components/registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegistrationPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const signedIn = typeof window !== 'undefined' ? localStorage.getItem('isUserSignedIn') : null;
    if (signedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      // Add a small delay before redirecting to allow any initial UI to render briefly
      // This can prevent flashes of content if the redirect is very fast.
      const timer = setTimeout(() => {
        router.push('/signin?redirect=/pendaftaran');
      }, 100); // 100ms delay, adjust as needed
      return () => clearTimeout(timer);
    }
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memeriksa status autentikasi...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This state should ideally not be reached due to the redirect in useEffect,
    // but it's a fallback.
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-8">
        <p className="text-destructive">Anda harus masuk untuk mengakses halaman ini.</p>
        <p className="text-muted-foreground">Anda akan diarahkan ke halaman Sign In.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Formulir Pendaftaran Siswa</CardTitle>
          <CardDescription className="text-muted-foreground">
            Selamat datang di SMP Makarya. Silakan isi formulir di bawah ini dengan data yang benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}

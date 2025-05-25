
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
      setIsCheckingAuth(false);
    } else {
      // If not signed in, redirect to the homepage (where the login form is)
      // and pass the current path as a redirect parameter.
      const timer = setTimeout(() => {
        router.push(`/?redirect=${encodeURIComponent('/pendaftaran')}`);
      }, 100); 
      return () => clearTimeout(timer); 
    }
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
    // This content will be briefly shown if redirect is slow or fails.
    // Ideally, user is redirected before this point if not authenticated.
    // We can return null or a minimal loader.
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Anda akan diarahkan untuk login...</p>
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

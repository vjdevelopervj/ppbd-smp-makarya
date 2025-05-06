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
      // Add a small delay before redirecting to allow any initial UI to render briefly
      // This can prevent flashes of content if the redirect is very fast.
      const timer = setTimeout(() => {
        router.push('/signin?redirect=/pendaftaran');
      }, 100); // 100ms delay, adjust as needed
      return () => clearTimeout(timer); // Cleanup timer on unmount or if effect re-runs
    }
    // Removed setIsCheckingAuth(false) from here as it's now handled in the 'if signedIn' block
    // or the component unmounts due to redirect.
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memeriksa status autentikasi...</p>
      </div>
    );
  }

  // The UI for !isAuthenticated has been removed as per user request.
  // The useEffect hook handles redirection if not authenticated.
  // We only render the form if authenticated.
  if (!isAuthenticated) {
    // This part should ideally not be reached if the redirect works correctly.
    // It can serve as a minimal fallback or be removed if the redirect is robust.
    // For now, let's keep the loader logic until authentication is confirmed or redirect happens.
    // If authentication check is complete and user is not authenticated, they should have been redirected.
    // To avoid rendering anything in this brief period, we can return null or a minimal loader.
    // However, the isCheckingAuth loader should cover this.
    return null; 
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


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';

// Google Logo SVG component
const GoogleLogo = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export default function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Access searchParams only on the client side
    const redirect = searchParams.get('redirect');
    setRedirectUrl(redirect);
  }, [searchParams]);

  const handleGoogleSignIn = () => {
    // In a real application, this would initiate the Google OAuth flow.
    // For this demo, we'll simulate a successful sign-in and store a flag.
    
    // Simulate successful Google Sign-In
    if (typeof window !== 'undefined') {
      localStorage.setItem('isUserSignedIn', 'true');
      // For demo, we'll use a generic Google user email.
      // In a real app, this would come from the Google Auth response.
      localStorage.setItem('userEmail', 'user@google.com'); 
    }

    toast({
      title: "Sign In dengan Google",
      description: (
        <div>
          <p>Anda akan diarahkan setelah sign in dengan Google berhasil.</p>
          <p className="mt-2 text-xs">
            Dalam aplikasi nyata, mengklik tombol ini akan mengarahkan Anda ke halaman login Google. Setelah berhasil, Anda akan kembali ke aplikasi kami.
          </p>
          <p className="mt-1 text-xs">
            Untuk demo ini, kami menyimulasikan proses tersebut.
          </p>
        </div>
      ),
      duration: 7000, 
    });

    // Simulate redirection after a short delay
    setTimeout(() => {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    }, 2000); // Delay to allow toast to be seen
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <LogIn className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Silakan masuk menggunakan akun Google Anda untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Button 
            variant="outline" 
            className="w-full py-6 text-lg" 
            onClick={handleGoogleSignIn}
            aria-label="Sign In dengan Google"
          >
            <GoogleLogo />
            Sign In dengan Google
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Dengan melanjutkan, Anda menyetujui Persyaratan Layanan dan Kebijakan Privasi kami.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

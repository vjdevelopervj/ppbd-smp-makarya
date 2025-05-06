'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { LogIn, Mail, KeyRound } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const signInSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

// Demo user credentials
const DEMO_USER_EMAIL = "siswa@smpmakarya.sch.id";
const DEMO_USER_PASSWORD = "siswa123";

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


export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('User sign-in attempt:', data);

    if (data.email === DEMO_USER_EMAIL && data.password === DEMO_USER_PASSWORD) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isUserSignedIn', 'true');
        localStorage.setItem('userEmail', data.email);
      }

      toast({
          title: 'Sign In Berhasil!',
          description: 'Selamat datang kembali! Anda akan diarahkan.',
          variant: 'default',
          className: 'bg-accent text-accent-foreground',
      });

      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
      form.reset();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isUserSignedIn');
        localStorage.removeItem('userEmail');
      }
      toast({
          title: 'Sign In Gagal',
          description: 'Email atau password yang Anda masukkan salah. Silakan coba lagi.',
          variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  const handleGoogleSignIn = () => {
    // In a real application, this would initiate the Google OAuth flow.
    // For this demo, we'll just show a toast.
    toast({
      title: "Fitur 'Sign In dengan Google'",
      description: (
        <div>
          <p>Ini adalah placeholder untuk fitur Sign In dengan Google.</p>
          <p className="mt-2 text-xs">
            Dalam aplikasi nyata, mengklik tombol ini akan mengarahkan Anda ke halaman login Google, di mana Anda dapat memilih akun Google yang tersimpan di browser Anda.
          </p>
          <p className="mt-1 text-xs">
            Untuk demo saat ini, silakan gunakan form email dan password di atas.
          </p>
        </div>
      ),
      duration: 10000, // Show longer for more info
    });
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
            Masuk untuk melanjutkan. Untuk demo, gunakan kredensial di bawah atau coba tombol &quot;Sign In dengan Google&quot;.
            <br />
            <span className="text-xs">(Email: <strong>siswa@smpmakarya.sch.id</strong> | Password: <strong>siswa123</strong>)</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn}
            aria-label="Sign In dengan Google"
          >
            <GoogleLogo />
            Sign In dengan Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-primary" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@anda.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                        <KeyRound className="mr-2 h-5 w-5 text-primary" /> Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Memproses...'
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" /> Sign In dengan Email
                  </>
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun? Untuk demo, gunakan kredensial di atas. Fitur pendaftaran akun baru belum tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

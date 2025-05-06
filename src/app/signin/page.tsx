
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
import { LogIn, Mail, KeyRound, UserPlus } from 'lucide-react';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

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
    // Simulate API call for user sign-in
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('User sign-in attempt:', data);

    // In a real app, you would verify credentials against a backend.
    // For this example, we'll consider any non-empty email/password valid for demo.
    if (data.email && data.password) {
      // Simulate successful sign-in
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
        router.push('/'); // Default redirect to homepage
      }
      form.reset();
    } else {
      // This case should ideally be caught by Zod, but as a fallback:
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isUserSignedIn');
        localStorage.removeItem('userEmail');
      }
      toast({
          title: 'Sign In Gagal',
          description: 'Email atau password tidak valid. Silakan coba lagi.',
          variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <LogIn className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masuk ke akun Anda untuk melanjutkan. Jika Anda ingin mendaftar, Anda harus Sign In terlebih dahulu.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
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
                    <LogIn className="mr-2 h-5 w-5" /> Masuk
                  </>
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun? Anda bisa menggunakan akun Google atau email aktif lainnya untuk Sign In.{' '}
            {/* Link to registration page might be confusing if sign-in is a prerequisite for registration.
                Keeping it but wording suggests using existing accounts. */}
            {/* <Link href="/pendaftaran" className="font-medium text-primary hover:underline">
              Daftar di sini
            </Link> */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

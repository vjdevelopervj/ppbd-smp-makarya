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
import { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const REGISTERED_USERS_KEY = 'smpMakaryaRegisteredUsers';

const newPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password baru minimal 6 karakter.' }),
  confirmPassword: z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password dan konfirmasi password tidak cocok.',
  path: ['confirmPassword'],
});

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

export default function SetNewPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username'); // Changed from email to username
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (username) {
      const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
      const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const foundUser = storedUsers.find((user: any) => user.username === username); // Check by username
      setUserExists(!!foundUser);
    }
    setIsLoadingUser(false);
  }, [username]);

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: NewPasswordFormData) {
    if (!username || !userExists) {
      toast({
        title: 'Error',
        description: 'Username tidak valid atau tidak ditemukan. Tidak dapat mereset password.', // Updated message
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
    let storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const userIndex = storedUsers.findIndex((user: any) => user.username === username); // Find by username
    if (userIndex > -1) {
      storedUsers[userIndex].password = data.password; 
      if (typeof window !== 'undefined') {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(storedUsers));
      }
      toast({
        title: 'Password Berhasil Diperbarui!',
        description: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Password Anda telah berhasil diubah. Silakan login dengan password baru.
          </div>
        ),
        className: 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
        duration: 5000,
      });
      form.reset();
      router.push('/'); 
    } else {
      toast({
        title: 'Update Password Gagal',
        description: 'Username tidak ditemukan. Silakan coba lagi proses lupa password.', // Updated message
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  if (isLoadingUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memuat halaman...</p>
      </div>
    );
  }

  if (!username || !userExists) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Link Tidak Valid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Link untuk mengatur ulang password tidak valid atau username tidak ditemukan. 
            </p>
            <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">Kembali ke Halaman Utama</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <ShieldCheck className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Atur Password Baru</CardTitle>
          <CardDescription className="text-muted-foreground">
            Buat password baru untuk akun <span className="font-semibold">{username}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <KeyRound className="mr-2 h-5 w-5 text-primary" /> Password Baru
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimal 6 karakter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <KeyRound className="mr-2 h-5 w-5 text-primary" /> Konfirmasi Password Baru
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ulangi password baru Anda" {...field} />
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
                    <ShieldCheck className="mr-2 h-5 w-5" /> Simpan Password Baru
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center">
            <Button variant="link" asChild onClick={() => router.push('/')} className="text-primary hover:underline">
                <Link href="#"><ArrowLeft className="mr-2 h-4 w-4" /> Batal dan Kembali ke Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserPlus, User as UserIcon, KeyRound, CheckCircle } from 'lucide-react'; // Removed Mail icon
import Link from 'next/link';

const userRegistrationSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  username: z.string().min(3, { message: 'Username minimal 3 karakter.' }), // Changed from email to username
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
  confirmPassword: z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password dan konfirmasi password tidak cocok.',
  path: ['confirmPassword'], 
});

type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;

const REGISTERED_USERS_KEY = 'smpMakaryaRegisteredUsers';

export default function UserRegistrationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      fullName: '',
      username: '', // Changed from email to username
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: UserRegistrationFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
    const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const existingUser = storedUsers.find(user => user.username === data.username); // Check by username
    if (existingUser) {
      toast({
        title: 'Registrasi Gagal',
        description: 'Username sudah digunakan. Silakan gunakan username lain.', // Updated message
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const newUser = {
      username: data.username, // Store username
      fullName: data.fullName,
      password: data.password, 
    };
    storedUsers.push(newUser);

    if (typeof window !== 'undefined') {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(storedUsers));
    }

    toast({
      title: 'Registrasi Berhasil!',
      description: (
        <div className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Akun Anda telah berhasil dibuat. Silakan login.
        </div>
      ),
      className: 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
      duration: 5000,
    });
    form.reset();
    router.push('/'); 
    setIsSubmitting(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
            <UserPlus className="h-10 w-10 text-accent-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Buat Akun User</CardTitle>
          <CardDescription className="text-muted-foreground">
            Daftarkan diri Anda untuk dapat mengakses fitur pendaftaran siswa.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-primary" /> Nama Lengkap
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username" // Changed from email
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-primary" /> Username 
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Buat username unik Anda" {...field} /> 
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
                      <KeyRound className="mr-2 h-5 w-5 text-primary" /> Konfirmasi Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ulangi password Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Memproses...'
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" /> Daftar Akun
                  </>
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun? <Link href="/" className="text-primary hover:underline font-medium">Login di sini</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

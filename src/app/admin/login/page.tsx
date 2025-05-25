
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { LogIn, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import Link from 'next/link';

const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: AdminLoginFormData) {
    setIsSubmitting(true);
    // Simulate API call for admin login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Admin login attempt:', data);

    if (data.email === "admin@smpmakarya.sch.id" && data.password === "admin123") {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isAdminSignedIn', 'true');
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('adminUsername', 'Admin SMP Makarya'); // Or data.email
            window.dispatchEvent(new CustomEvent('authChange'));
        }
        toast({
            title: 'Login Berhasil!',
            description: 'Selamat datang Admin. Anda akan diarahkan ke dashboard.',
            variant: 'default',
            className: 'bg-accent text-accent-foreground',
        });
        router.push('/admin/dashboard');
        form.reset();
    } else {
        toast({
            title: 'Login Gagal',
            description: 'Email atau password salah. Silakan coba lagi.',
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
            <ShieldCheck className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masuk untuk mengakses panel administrasi SMP Makarya.
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
                      <Input type="email" placeholder="admin@smpmakarya.sch.id" {...field} />
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
            Lupa password? Hubungi administrator sistem.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

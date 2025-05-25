
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn, User, Shield, KeyRound, Users } from 'lucide-react';

const loginSchema = z.object({
  role: z.enum(['admin', 'user'], { required_error: 'Peran harus dipilih.' }),
  username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginSelectionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: undefined,
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    // Simulate API call for login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Login attempt:', data);

    if (data.role === 'admin') {
      if (data.username === 'adminmakarya' && data.password === 'makarya123') {
        toast({
          title: 'Admin Login Berhasil!',
          description: 'Selamat datang, Admin. Anda akan diarahkan ke dashboard.',
          variant: 'default',
          className: 'bg-accent text-accent-foreground',
        });
        // router.push('/admin/dashboard'); // Redirect to admin dashboard when it exists
        form.reset();
      } else {
        toast({
          title: 'Admin Login Gagal',
          description: 'Username atau password admin salah.',
          variant: 'destructive',
        });
      }
    } else if (data.role === 'user') {
      // For user login, let's assume a generic successful login for now
      // In a real app, you'd verify user credentials against a database
      // This example uses a simulated success and sets localStorage flags
      // as per previous user sign-in logic.
      if (typeof window !== 'undefined') {
        // We don't have a real user database, so for demo, any user/pass could work
        // Or, you can set a predefined user for testing:
        // if (data.username === "userdemo" && data.password === "userpass")
        localStorage.setItem('isUserSignedIn', 'true');
        localStorage.setItem('userEmail', `${data.username}@smpmakarya.sch.id`); // Simulate an email
        toast({
          title: 'User Login Berhasil!',
          description: `Selamat datang, ${data.username}!`,
        });
        router.push('/'); // Redirect to home or user dashboard
        form.reset();
      } else {
         toast({
          title: 'User Login Gagal',
          description: 'Username atau password user salah.',
          variant: 'destructive',
        });
      }
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-250px)] py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <LogIn className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Selamat Datang Kembali!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masuk sebagai Admin atau User untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" /> Pilih Peran
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih peran Anda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" /> User / Siswa
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" /> Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" /> Username
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username Anda" {...field} />
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
            Belum punya akun? <a href="/signin" className="text-primary hover:underline">Sign In dengan Google</a> untuk mendaftar sebagai siswa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

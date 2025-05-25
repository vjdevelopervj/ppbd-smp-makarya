
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
import { KeyRound, User, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const REGISTERED_USERS_KEY = 'smpMakaryaRegisteredUsers';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
    const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const existingUser = storedUsers.find((user: any) => user.username === data.username);

    if (existingUser) {
      toast({
        title: 'Username Ditemukan',
        description: 'Anda akan diarahkan untuk membuat password baru.',
        className: 'bg-accent text-accent-foreground',
        duration: 3000,
      });
      router.push(`/atur-password-baru?username=${encodeURIComponent(data.username)}`);
    } else {
      toast({
        title: 'Username Tidak Ditemukan',
        description: 'Username yang Anda masukkan tidak terdaftar. Pastikan username sudah benar atau daftar akun baru.',
        variant: 'destructive',
        duration: 7000,
      });
    }
    setIsSubmitting(false);
    // Form is not reset here, so user can see what they typed if there was an error.
    // It will be reset if they navigate away or successfully get redirected.
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <KeyRound className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Lupa Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan username Anda untuk melanjutkan proses reset password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Memproses...'
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Lanjutkan
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center">
            <Button variant="link" asChild onClick={() => router.back()} className="text-primary hover:underline">
                <Link href="#"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

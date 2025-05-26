
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
import { KeyRound, Mail, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { UserNotification } from '@/app/notifikasi/page';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid.' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const REGISTERED_USERS_KEY = 'smpMakaryaRegisteredUsers';
const USER_NOTIFICATIONS_BASE_KEY = 'smpMakaryaUserNotifications_';


export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
    const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    const existingUser = storedUsers.find((user: any) => user.email === data.email);

    if (existingUser) {
      if (typeof window !== 'undefined') {
        const notificationsKey = `${USER_NOTIFICATIONS_BASE_KEY}${data.email}`;
        let userNotifications: UserNotification[] = [];
        const storedNotificationsRaw = localStorage.getItem(notificationsKey);
        if (storedNotificationsRaw) {
          try {
            userNotifications = JSON.parse(storedNotificationsRaw);
          } catch (e) { console.error("Error parsing notifications for forgot password:", e); }
        }
        
        const resetLink = `/atur-password-baru?email=${encodeURIComponent(data.email)}`;
        const newNotification: UserNotification = {
          id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
          type: 'passwordResetRequest',
          title: 'Permintaan Atur Ulang Password',
          message: `Anda telah meminta untuk mengatur ulang password. Silakan klik link untuk melanjutkan.`,
          timestamp: new Date().toISOString(),
          payload: { resetLink: resetLink },
          isRead: false,
        };
        userNotifications.push(newNotification);
        localStorage.setItem(notificationsKey, JSON.stringify(userNotifications));
      }

      toast({
        title: 'Email Ditemukan',
        description: 'Link untuk mengatur password baru telah dikirim ke notifikasi Anda dan Anda akan diarahkan.',
        className: 'bg-accent text-accent-foreground',
        duration: 4000,
      });
      router.push(`/atur-password-baru?email=${encodeURIComponent(data.email)}`);
    } else {
      toast({
        title: 'Email Tidak Ditemukan',
        description: 'Email yang Anda masukkan tidak terdaftar. Pastikan email sudah benar atau daftar akun baru.',
        variant: 'destructive',
        duration: 7000,
      });
    }
    setIsSubmitting(false);
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
            Masukkan email Anda untuk melanjutkan proses reset password.
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
                      <Input type="email" placeholder="Masukkan email Anda" {...field} />
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
            <Button variant="link" asChild onClick={() => router.push('/')} className="text-primary hover:underline">
                <Link href="#"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

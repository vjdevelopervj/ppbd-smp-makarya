
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
import { KeyRound, User as UserIcon, Send, ArrowLeft } from 'lucide-react'; // Changed Mail to UserIcon
import Link from 'next/link';
import type { UserNotification } from '@/app/notifikasi/page';

const forgotPasswordSchema = z.object({
  username: z.string().min(3, { message: 'Username minimal 3 karakter.' }), // Changed from email to username
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
      username: '', // Changed from email
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
    const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    const existingUser = storedUsers.find((user: any) => user.username === data.username); // Check by username

    if (existingUser) {
      if (typeof window !== 'undefined') {
        const notificationsKey = `${USER_NOTIFICATIONS_BASE_KEY}${data.username}`; // Use username for notification key
        let userNotifications: UserNotification[] = [];
        const storedNotificationsRaw = localStorage.getItem(notificationsKey);
        if (storedNotificationsRaw) {
          try {
            userNotifications = JSON.parse(storedNotificationsRaw);
          } catch (e) { console.error("Error parsing notifications for forgot password:", e); }
        }
        
        const resetLink = `/atur-password-baru?username=${encodeURIComponent(data.username)}`; // Use username in link
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
        title: 'Username Ditemukan', // Updated message
        description: 'Link untuk mengatur password baru telah dikirim ke notifikasi Anda dan Anda akan diarahkan.',
        className: 'bg-accent text-accent-foreground',
        duration: 4000,
      });
      router.push(`/atur-password-baru?username=${encodeURIComponent(data.username)}`); // Use username in redirect
    } else {
      toast({
        title: 'Username Tidak Ditemukan', // Updated message
        description: 'Username yang Anda masukkan tidak terdaftar. Pastikan username sudah benar atau daftar akun baru.',
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
            Masukkan username Anda untuk melanjutkan proses reset password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username" // Changed from email
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-primary" /> Username 
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Masukkan username Anda" {...field} /> 
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

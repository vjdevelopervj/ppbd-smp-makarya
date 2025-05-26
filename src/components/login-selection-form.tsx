
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
import { useState, useEffect } from 'react';
import { LogIn, User, Shield, KeyRound, Users } from 'lucide-react'; // Removed Mail
import Link from 'next/link';

// Admin login schema (remains the same, uses username)
const adminLoginSchema = z.object({
  username: z.string().min(3, { message: 'Username admin minimal 3 karakter.' }),
  password: z.string().min(6, { message: 'Password admin minimal 6 karakter.' }),
});

// User login schema - changed back to username
const userLoginSchema = z.object({
  username: z.string().min(3, { message: 'Username minimal 3 karakter.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

const loginSchema = z.object({
  role: z.enum(['admin', 'user'], { required_error: 'Peran harus dipilih.' }),
  identifier: z.string().min(3, { message: 'Username minimal 3 karakter.'}), // For admin username or user username
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});


type LoginFormData = z.infer<typeof loginSchema>;

const REGISTERED_USERS_KEY = 'smpMakaryaRegisteredUsers';

export default function LoginSelectionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: undefined,
      identifier: '',
      password: '',
    },
  });

  const roleValue = form.watch('role');

  useEffect(() => {
    setSelectedRole(roleValue);
    form.setValue('identifier', ''); 
    form.setValue('password', ''); 
    form.clearErrors();
  }, [roleValue, form]);

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    if (data.role === 'admin') {
      // Admin login logic (using adminLoginSchema implicitly if needed for specific admin username validation)
      if (data.identifier === 'adminmakarya' && data.password === 'makarya123') { // Example admin credentials
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdminSignedIn', 'true');
          localStorage.setItem('userRole', 'admin'); 
          localStorage.setItem('adminUsername', data.identifier); 
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        toast({
          title: 'Admin Login Berhasil!',
          description: 'Selamat datang, Admin. Anda akan diarahkan ke dashboard.',
          variant: 'default',
          className: 'bg-accent text-accent-foreground',
        });
        router.push('/admin/dashboard');
        form.reset({ role: 'admin', identifier: '', password: '' });
      } else {
        toast({
          title: 'Admin Login Gagal',
          description: 'Username atau password admin salah.',
          variant: 'destructive',
        });
      }
    } else if (data.role === 'user') {
      // User login logic, validating against userLoginSchema (username)
      const validationResult = userLoginSchema.safeParse({ username: data.identifier, password: data.password });
      if (!validationResult.success) {
          form.setError('identifier', { type: 'manual', message: validationResult.error.errors.find(e => e.path.includes('username'))?.message || 'Username tidak valid.' });
          if (validationResult.error.errors.find(e => e.path.includes('password'))) {
            form.setError('password', { type: 'manual', message: validationResult.error.errors.find(e => e.path.includes('password'))?.message });
          }
          setIsSubmitting(false);
          return;
      }

      const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
      const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      const foundUser = storedUsers.find(
        (user: any) => user.username === data.identifier && user.password === data.password // Check by username
      );

      if (foundUser) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('isUserSignedIn', 'true');
          localStorage.setItem('userUsername', foundUser.username); // Store username
          localStorage.setItem('userFullName', foundUser.fullName); 
          localStorage.setItem('userRole', 'user'); 
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        toast({
          title: 'User Login Berhasil!',
          description: `Selamat datang, ${foundUser.fullName}!`,
        });
        
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push('/'); 
        }
        form.reset({ role: 'user', identifier: '', password: '' });
      } else {
         toast({
          title: 'User Login Gagal',
          description: 'Username atau password user salah.', // Updated message
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" /> 
                      {selectedRole === 'admin' ? 'Username Admin' : 'Username User'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="text" // Changed from email to text for user
                        placeholder={selectedRole === 'admin' ? 'Masukkan username admin' : 'Masukkan username Anda'} 
                        {...field} 
                        disabled={!selectedRole}
                      />
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
                    <div className="flex justify-between items-center">
                      <FormLabel className="flex items-center">
                        <KeyRound className="mr-2 h-5 w-5 text-primary" /> Password
                      </FormLabel>
                      {selectedRole === 'user' && (
                        <Link href="/lupa-password" 
                              className="text-xs text-primary hover:underline font-medium">
                          Lupa Password?
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="********" 
                        {...field} 
                        disabled={!selectedRole}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || !selectedRole}>
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
          {selectedRole === 'user' && (
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun? <Link href="/registrasi-akun" className="text-primary hover:underline font-medium">Buat Akun User</Link>.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

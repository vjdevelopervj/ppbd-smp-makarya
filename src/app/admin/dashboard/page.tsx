
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Database, Users, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegisteredUser {
  id: string;
  fullName: string;
  username: string; // Added to match localStorage structure
  registrationDate: string; // This will be simulated
  role: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    const adminSignedIn = typeof window !== 'undefined' ? localStorage.getItem('isAdminSignedIn') : null;
    if (adminSignedIn === 'true') {
      setIsAdminAuthenticated(true);
      
      const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem('smpMakaryaRegisteredUsers') : null;
      const storedUsersFromUserReg = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      // Map data from localStorage to RegisteredUser interface
      const formattedUsers: RegisteredUser[] = storedUsersFromUserReg.map((user: any) => ({
        id: user.username, // Assuming username is unique and acts as ID
        username: user.username,
        fullName: user.fullName,
        registrationDate: new Date().toLocaleDateString('id-ID'), // Simulate registration date
        role: 'user', // All users from this list are 'user'
      }));
      setRegisteredUsers(formattedUsers);

    } else {
      router.push('/'); // Redirect to home/login if not admin
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memuat Dashboard Admin...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive font-semibold">Akses Ditolak</p>
        <p className="text-muted-foreground">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Kembali ke Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard - Database Pengguna</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Berikut adalah daftar pengguna (calon siswa/wali) yang terdaftar di sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registeredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username (ID)</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Tanggal Registrasi Akun (Simulasi)</TableHead>
                    <TableHead>Peran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.registrationDate}</TableCell>
                      <TableCell>
                          <span className={'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700'}>
                            {user.role}
                          </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Belum ada pengguna yang terdaftar.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Section for student registration data could be added here if stored separately */}
    </div>
  );
}

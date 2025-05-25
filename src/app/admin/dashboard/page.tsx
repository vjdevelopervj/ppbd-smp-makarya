
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Database, Users, ShieldAlert, UserPlus, FileText, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegisteredUser {
  id: string;
  fullName: string;
  username: string;
  registrationDate: string; 
  role: string;
}

// Placeholder interface for student application data
// In a real app, this would come from a database
interface StudentApplication {
  id: string;
  fullName: string;
  nisn: string;
  formSubmittedDate: string;
  quizCompleted: boolean;
  quizScore?: number;
  passedQuiz?: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Data for cards
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [newApplicantsCount, setNewApplicantsCount] = useState(0); // Form + Test Done
  const [passedStudentsCount, setPassedStudentsCount] = useState(0);
  const [failedStudentsCount, setFailedStudentsCount] = useState(0);

  const [detailedRegisteredUsers, setDetailedRegisteredUsers] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    const adminSignedIn = typeof window !== 'undefined' ? localStorage.getItem('isAdminSignedIn') : null;
    if (adminSignedIn === 'true') {
      setIsAdminAuthenticated(true);
      
      // Card 1: Registered Users
      const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem('smpMakaryaRegisteredUsers') : null;
      const storedUsersFromUserReg = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      setRegisteredUserCount(storedUsersFromUserReg.length);
      
      const formattedUsers: RegisteredUser[] = storedUsersFromUserReg.map((user: any) => ({
        id: user.username, 
        username: user.username,
        fullName: user.fullName,
        registrationDate: new Date().toLocaleDateString('id-ID'), // Simulate registration date
        role: 'user', 
      }));
      setDetailedRegisteredUsers(formattedUsers);

      // --- Placeholder Data for Cards 2, 3, 4 ---
      // In a real application, you would fetch this data from your backend/database.
      // For this demo, we'll use placeholder values or simulate fetching.
      
      // Example: Fetching student applications data (simulated)
      const studentApplicationsRaw = typeof window !== 'undefined' ? localStorage.getItem('smpMakaryaStudentApplications') : null;
      const studentApplications: StudentApplication[] = studentApplicationsRaw ? JSON.parse(studentApplicationsRaw) : [];
      // For now, let's assume this data is populated by the registration & quiz flow.
      // If not, these counts will be 0.

      // Card 2: New Student Applicants (Form + Test Done)
      const applicantsWithTestDone = studentApplications.filter(app => app.quizCompleted);
      setNewApplicantsCount(applicantsWithTestDone.length);

      // Card 3: Students Passed Quiz
      const passed = studentApplications.filter(app => app.quizCompleted && app.passedQuiz === true);
      setPassedStudentsCount(passed.length);

      // Card 4: Students Failed Quiz
      const failed = studentApplications.filter(app => app.quizCompleted && app.passedQuiz === false);
      setFailedStudentsCount(failed.length);
      // --- End Placeholder Data ---

    } else {
      router.push('/admin/login'); // Redirect to admin login if not authenticated
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
    // This should ideally not be reached if redirect works, but as a fallback.
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive font-semibold">Akses Ditolak</p>
        <p className="text-muted-foreground">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Button onClick={() => router.push('/admin/login')} className="mt-4">Kembali ke Login Admin</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <Card className="shadow-xl animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Ringkasan data dan aktivitas pendaftaran siswa SMP Makarya.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-300">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Pengguna Terdaftar
            </CardTitle>
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredUserCount}</div>
            <p className="text-xs text-muted-foreground">
              Total akun pengguna yang telah registrasi.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Pendaftar Baru (Tes Selesai)
            </CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newApplicantsCount}</div>
            <p className="text-xs text-muted-foreground">
              Calon siswa yang mengisi form & menyelesaikan tes.
            </p>
             {/* <p className="text-xs text-muted-foreground mt-1"> (Data disimulasikan)</p> */}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Siswa Lulus Tes
            </CardTitle>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passedStudentsCount}</div>
            <p className="text-xs text-muted-foreground">
              Siswa yang memenuhi syarat kelulusan tes.
            </p>
            {/* <p className="text-xs text-muted-foreground mt-1">(Data disimulasikan)</p> */}
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Siswa Tidak Lulus Tes
            </CardTitle>
            <UserX className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{failedStudentsCount}</div>
            <p className="text-xs text-muted-foreground">
              Siswa yang tidak memenuhi syarat kelulusan tes.
            </p>
            {/* <p className="text-xs text-muted-foreground mt-1">(Data disimulasikan)</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Registered Users Table */}
      <Card className="shadow-xl animate-fade-in-up animation-delay-500">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">Database Akun Pengguna</CardTitle>
          <CardDescription className="text-muted-foreground">
            Daftar detail akun pengguna (calon siswa/wali) yang terdaftar di sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {detailedRegisteredUsers.length > 0 ? (
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
                  {detailedRegisteredUsers.map((user) => (
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
       {/*
        TODO: Add a new Card/Table section here to display details of 'StudentApplications'
        This would involve fetching and mapping 'studentApplications' similar to 'detailedRegisteredUsers'.
        Example:
        <Card className="shadow-xl animate-fade-in-up animation-delay-500">
            <CardHeader>
                <CardTitle>Data Pendaftar Siswa</CardTitle>
            </CardHeader>
            <CardContent>
                // Table with studentApplications data: fullName, nisn, formSubmittedDate, quizCompleted, quizScore, passedQuiz
            </CardContent>
        </Card>
      */}
    </div>
  );
}


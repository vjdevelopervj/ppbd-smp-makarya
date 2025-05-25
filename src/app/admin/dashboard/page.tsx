
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Database, Users, ShieldAlert, UserPlus, FileText, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface RegisteredUser {
  id: string;
  fullName: string;
  username: string;
  registrationDate: string; 
  role: string;
}

interface StudentApplication {
  id: string; 
  fullName: string;
  nisn: string;
  formSubmittedDate: string; 
  quizCompleted: boolean;
  quizScore?: number;
  passedQuiz?: boolean;
}

const STUDENT_APPLICATIONS_KEY = 'smpMakaryaStudentApplications';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [newApplicantsCount, setNewApplicantsCount] = useState(0); 
  const [passedStudentsCount, setPassedStudentsCount] = useState(0);
  const [failedStudentsCount, setFailedStudentsCount] = useState(0);

  const [detailedRegisteredUsers, setDetailedRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [detailedStudentApplications, setDetailedStudentApplications] = useState<StudentApplication[]>([]);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    data: RegisteredUser[] | StudentApplication[];
    type: 'users' | 'applications';
  } | null>(null);

  useEffect(() => {
    const adminSignedIn = typeof window !== 'undefined' ? localStorage.getItem('isAdminSignedIn') : null;
    if (adminSignedIn === 'true') {
      setIsAdminAuthenticated(true);
      
      const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem('smpMakaryaRegisteredUsers') : null;
      const storedUsersFromUserReg = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      setRegisteredUserCount(storedUsersFromUserReg.length);
      
      const formattedUsers: RegisteredUser[] = storedUsersFromUserReg.map((user: any) => ({
        id: user.username, 
        username: user.username,
        fullName: user.fullName,
        registrationDate: user.registrationDate || new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toLocaleDateString('id-ID'), 
        role: 'user', 
      }));
      setDetailedRegisteredUsers(formattedUsers);

      const studentApplicationsRaw = typeof window !== 'undefined' ? localStorage.getItem(STUDENT_APPLICATIONS_KEY) : null;
      const studentApplicationsData: StudentApplication[] = studentApplicationsRaw ? JSON.parse(studentApplicationsRaw) : [];
      setDetailedStudentApplications(studentApplicationsData);

      const applicantsWithTestDone = studentApplicationsData.filter(app => app.quizCompleted);
      setNewApplicantsCount(applicantsWithTestDone.length);

      const passed = studentApplicationsData.filter(app => app.quizCompleted && app.passedQuiz === true);
      setPassedStudentsCount(passed.length);

      const failed = studentApplicationsData.filter(app => app.quizCompleted && app.passedQuiz === false);
      setFailedStudentsCount(failed.length);

    } else {
      router.push('/admin/login'); 
    }
    setIsLoading(false);
  }, [router]);

  const handleCardClick = (
    title: string,
    data: RegisteredUser[] | StudentApplication[],
    type: 'users' | 'applications'
  ) => {
    setModalContent({ title, data, type });
    setIsModalOpen(true);
  };

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up animation-delay-300">
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => handleCardClick(
            "Detail Pengguna Terdaftar",
            detailedRegisteredUsers,
            'users'
          )}
        >
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

        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => {
            const applicantsWithTestDone = detailedStudentApplications.filter(app => app.quizCompleted);
            handleCardClick(
              "Detail Pendaftar (Tes Selesai)",
              applicantsWithTestDone,
              'applications'
            );
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Pendaftar (Tes Selesai)
            </CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newApplicantsCount}</div>
            <p className="text-xs text-muted-foreground">
              Calon siswa yang mengisi form & menyelesaikan tes.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => {
            const passed = detailedStudentApplications.filter(app => app.quizCompleted && app.passedQuiz === true);
            handleCardClick(
              "Detail Siswa Lulus Tes",
              passed,
              'applications'
            );
          }}
        >
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
          </CardContent>
        </Card>

        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => {
            const failed = detailedStudentApplications.filter(app => app.quizCompleted && app.passedQuiz === false);
            handleCardClick(
              "Detail Siswa Tidak Lulus Tes",
              failed,
              'applications'
            );
          }}
        >
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
          </CardContent>
        </Card>
      </div>

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
                    <TableHead>Tanggal Registrasi Akun</TableHead>
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

      <Card className="shadow-xl animate-fade-in-up animation-delay-700">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Data Pendaftar Siswa</CardTitle>
            <CardDescription className="text-muted-foreground">
              Detail calon siswa yang telah mengisi formulir dan mengikuti tes.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {detailedStudentApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NISN</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Tgl. Form</TableHead>
                    <TableHead>Tes Selesai</TableHead>
                    <TableHead>Skor Tes</TableHead>
                    <TableHead>Status Lulus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedStudentApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.nisn}</TableCell>
                      <TableCell>{app.fullName}</TableCell>
                      <TableCell>{new Date(app.formSubmittedDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{app.quizCompleted ? 'Ya' : 'Belum'}</TableCell>
                      <TableCell>{app.quizScore !== undefined ? app.quizScore : '-'}</TableCell>
                      <TableCell>
                        {app.quizCompleted ? (
                          app.passedQuiz ? 
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Lulus</span> : 
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Tidak Lulus</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            ) : (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Belum ada data pendaftar siswa.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for displaying detailed data */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[85vh] flex flex-col">
          {modalContent && (
            <>
              <DialogHeader>
                <DialogTitle>{modalContent.title}</DialogTitle>
                <DialogDescription>
                  Menampilkan {modalContent.data.length} entri untuk {modalContent.title.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto flex-grow">
                {modalContent.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      {modalContent.type === 'users' ? (
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Nama Lengkap</TableHead>
                          <TableHead>Tgl. Registrasi</TableHead>
                          <TableHead>Peran</TableHead>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableHead>NISN</TableHead>
                          <TableHead>Nama Lengkap</TableHead>
                          <TableHead>Tgl. Form</TableHead>
                          <TableHead>Tes Selesai</TableHead>
                          <TableHead>Skor Tes</TableHead>
                          <TableHead>Status Lulus</TableHead>
                        </TableRow>
                      )}
                    </TableHeader>
                    <TableBody>
                      {modalContent.type === 'users' &&
                        (modalContent.data as RegisteredUser[]).map((user) => (
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
                      {modalContent.type === 'applications' &&
                        (modalContent.data as StudentApplication[]).map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.nisn}</TableCell>
                            <TableCell>{app.fullName}</TableCell>
                            <TableCell>{new Date(app.formSubmittedDate).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>{app.quizCompleted ? 'Ya' : 'Belum'}</TableCell>
                            <TableCell>{app.quizScore !== undefined ? app.quizScore : '-'}</TableCell>
                            <TableCell>
                              {app.quizCompleted ? (
                                app.passedQuiz ? 
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Lulus</span> : 
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Tidak Lulus</span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Tidak ada data untuk ditampilkan.</p>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Tutup</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

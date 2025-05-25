
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Database, Users, ShieldAlert, UserPlus, FileText, UserCheck, UserX, Trash2, Download } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface RegisteredUser {
  id: string;
  fullName: string;
  username: string;
  registrationDate: string; 
  role: string;
}

interface StudentApplication {
  id: string; // NISN
  fullName: string;
  nisn: string;
  gender: string;
  birthPlace: string;
  birthDate: string; // ISO string from localStorage
  religion: string;
  address: string;
  studentPhoneNumber?: string;
  previousSchool: string;
  lastCertificate: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhoneNumber: string;
  motherName: string;
  motherOccupation: string;
  motherPhoneNumber: string;
  parentEmail: string;
  formSubmittedDate: string; 
  quizCompleted: boolean;
  quizScore?: number;
  passedQuiz?: boolean;
}

const REGISTERED_USERS_KEY = 'smpMakaryaRegisteredUsers';
const STUDENT_APPLICATIONS_KEY = 'smpMakaryaStudentApplications';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [newApplicantsCount, setNewApplicantsCount] = useState(0); 
  const [passedStudentsCount, setPassedStudentsCount] = useState(0);
  const [failedStudentsCount, setFailedStudentsCount] = useState(0);

  const [detailedRegisteredUsers, setDetailedRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [detailedStudentApplications, setDetailedStudentApplications] = useState<StudentApplication[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    data: RegisteredUser[] | StudentApplication[];
    type: 'users' | 'applications';
    dataTypeKey: 'registeredUsers' | 'newApplicants' | 'passedStudents' | 'failedStudents';
  } | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'application' } | null>(null);

  const loadData = useCallback(() => {
    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
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
  }, []);

  useEffect(() => {
    const adminSignedIn = typeof window !== 'undefined' ? localStorage.getItem('isAdminSignedIn') : null;
    if (adminSignedIn === 'true') {
      setIsAdminAuthenticated(true);
      loadData();
    } else {
      router.push('/admin/login'); 
    }
    setIsLoading(false);
  }, [router, loadData]);

  const handleCardClick = (
    title: string,
    baseData: RegisteredUser[] | StudentApplication[],
    type: 'users' | 'applications',
    dataTypeKey: 'registeredUsers' | 'newApplicants' | 'passedStudents' | 'failedStudents'
  ) => {
    let dataToShow = baseData;
    if (type === 'applications') {
        if (dataTypeKey === 'newApplicants') {
            dataToShow = detailedStudentApplications.filter(app => app.quizCompleted);
        } else if (dataTypeKey === 'passedStudents') {
            dataToShow = detailedStudentApplications.filter(app => app.quizCompleted && app.passedQuiz === true);
        } else if (dataTypeKey === 'failedStudents') {
            dataToShow = detailedStudentApplications.filter(app => app.quizCompleted && app.passedQuiz === false);
        }
    }
    setModalContent({ title, data: [...dataToShow], type, dataTypeKey }); // Clone data
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = (id: string, type: 'user' | 'application') => {
    setItemToDelete({ id, type });
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'user') {
      const updatedUsers = detailedRegisteredUsers.filter(user => user.id !== itemToDelete.id);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers.map(u => ({username: u.username, fullName: u.fullName, password: '***'})))); 
      setDetailedRegisteredUsers(updatedUsers);
      if (modalContent?.dataTypeKey === 'registeredUsers') {
        setModalContent(prev => prev ? {...prev, data: updatedUsers} : null);
      }
      toast({ title: "Pengguna Dihapus", description: `Pengguna dengan username ${itemToDelete.id} telah dihapus.` });
    } else if (itemToDelete.type === 'application') {
      const updatedApplications = detailedStudentApplications.filter(app => app.id !== itemToDelete.id);
      localStorage.setItem(STUDENT_APPLICATIONS_KEY, JSON.stringify(updatedApplications));
      setDetailedStudentApplications(updatedApplications);
      
      if (modalContent?.type === 'applications') {
          let currentModalData: StudentApplication[] = [];
          if (modalContent.dataTypeKey === 'newApplicants') {
            currentModalData = updatedApplications.filter(app => app.quizCompleted);
          } else if (modalContent.dataTypeKey === 'passedStudents') {
            currentModalData = updatedApplications.filter(app => app.quizCompleted && app.passedQuiz === true);
          } else if (modalContent.dataTypeKey === 'failedStudents') {
            currentModalData = updatedApplications.filter(app => app.quizCompleted && app.passedQuiz === false);
          }
          setModalContent(prev => prev ? {...prev, data: currentModalData} : null);
      }
      toast({ title: "Aplikasi Dihapus", description: `Aplikasi siswa dengan NISN ${itemToDelete.id} telah dihapus.` });
    }
    loadData(); 
    setIsDeleteAlertOpen(false);
    setItemToDelete(null);
  };
  
  const exportToCsv = (filename: string, dataToExport: any[]) => {
    if (!dataToExport || dataToExport.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data untuk diekspor.", variant: "destructive" });
      return;
    }

    const headers = Object.keys(dataToExport[0]);
    const csvRows = [
      headers.join(','), 
      ...dataToExport.map(row =>
        headers.map(fieldName => {
          let value = row[fieldName];
          if (value === undefined || value === null) {
            value = '';
          } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];
    
    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: "Ekspor Berhasil", description: `${filename} telah diunduh.` });
    } else {
       toast({ title: "Ekspor Gagal", description: "Browser Anda tidak mendukung fitur unduh.", variant: "destructive" });
    }
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

  const renderFullApplicationDetailsTable = (data: StudentApplication[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NISN</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>JK</TableHead>
          <TableHead>Tmp/Tgl Lahir</TableHead>
          <TableHead>Agama</TableHead>
          <TableHead className="min-w-[200px]">Alamat</TableHead>
          <TableHead>No.HP Siswa</TableHead>
          <TableHead>Asal Sekolah</TableHead>
          <TableHead>Ijazah</TableHead>
          <TableHead>Nama Ayah</TableHead>
          <TableHead>Pek. Ayah</TableHead>
          <TableHead>No.HP Ayah</TableHead>
          <TableHead>Nama Ibu</TableHead>
          <TableHead>Pek. Ibu</TableHead>
          <TableHead>No.HP Ibu</TableHead>
          <TableHead>Email Ortu</TableHead>
          <TableHead>Tgl Form</TableHead>
          <TableHead>Tes Selesai</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.nisn}</TableCell>
            <TableCell>{app.fullName}</TableCell>
            <TableCell>{app.gender}</TableCell>
            <TableCell>{`${app.birthPlace}, ${new Date(app.birthDate).toLocaleDateString('id-ID')}`}</TableCell>
            <TableCell>{app.religion}</TableCell>
            <TableCell className="max-w-xs whitespace-pre-wrap break-words">{app.address}</TableCell>
            <TableCell>{app.studentPhoneNumber || '-'}</TableCell>
            <TableCell>{app.previousSchool}</TableCell>
            <TableCell>{app.lastCertificate}</TableCell>
            <TableCell>{app.fatherName}</TableCell>
            <TableCell>{app.fatherOccupation}</TableCell>
            <TableCell>{app.fatherPhoneNumber}</TableCell>
            <TableCell>{app.motherName}</TableCell>
            <TableCell>{app.motherOccupation}</TableCell>
            <TableCell>{app.motherPhoneNumber}</TableCell>
            <TableCell>{app.parentEmail}</TableCell>
            <TableCell>{new Date(app.formSubmittedDate).toLocaleDateString('id-ID')}</TableCell>
            <TableCell>{app.quizCompleted ? 'Ya' : 'Belum'}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(app.id, 'application')}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderQuizStatusTable = (data: StudentApplication[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NISN</TableHead>
          <TableHead>Nama Lengkap</TableHead>
          <TableHead>Tgl. Form</TableHead>
          <TableHead>Tes Selesai</TableHead>
          <TableHead>Skor Tes</TableHead>
          <TableHead>Status Lulus</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as StudentApplication[]).map((app) => (
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
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(app.id, 'application')}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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
            'users',
            'registeredUsers'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Pengguna Terdaftar
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
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
          onClick={() => handleCardClick(
              "Detail Pendaftar (Tes Selesai)",
              detailedStudentApplications.filter(app => app.quizCompleted),
              'applications',
              'newApplicants'
            )
          }
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
              Calon siswa yang isi form & selesaikan tes.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => handleCardClick(
              "Detail Siswa Lulus Tes",
              detailedStudentApplications.filter(app => app.quizCompleted && app.passedQuiz === true),
              'applications',
              'passedStudents'
            )
          }
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
          onClick={() => handleCardClick(
              "Detail Siswa Tidak Lulus Tes",
              detailedStudentApplications.filter(app => app.quizCompleted && app.passedQuiz === false),
              'applications',
              'failedStudents'
            )
          }
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[90vw] 2xl:max-w-[80vw] max-h-[85vh] flex flex-col">
          {modalContent && (
            <>
              <DialogHeader>
                <DialogTitle>{modalContent.title}</DialogTitle>
                <DialogDescription>
                  Menampilkan {modalContent.data.length} entri untuk {modalContent.title.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-auto flex-grow">
                {modalContent.data.length > 0 ? (
                  <>
                    {modalContent.type === 'users' && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Tgl. Registrasi</TableHead>
                            <TableHead>Peran</TableHead>
                            <TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(modalContent.data as RegisteredUser[]).map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.username}</TableCell>
                              <TableCell>{user.fullName}</TableCell>
                              <TableCell>{user.registrationDate}</TableCell>
                              <TableCell>
                                  <span className={'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700'}>
                                      {user.role}
                                  </span>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(user.id, 'user')}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    {modalContent.type === 'applications' && (
                      (modalContent.dataTypeKey === "newApplicants" || modalContent.dataTypeKey === "passedStudents" || modalContent.dataTypeKey === "failedStudents") ?
                      ( (modalContent.dataTypeKey === "newApplicants") ?
                        renderFullApplicationDetailsTable(modalContent.data as StudentApplication[]) :
                        renderQuizStatusTable(modalContent.data as StudentApplication[])
                      ) : null
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Tidak ada data untuk ditampilkan.</p>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6 sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => exportToCsv(`${modalContent.title.replace(/\s+/g, '_')}_export.csv`, modalContent.data)}
                  disabled={modalContent.data.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export untuk Excel (CSV)
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Tutup</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

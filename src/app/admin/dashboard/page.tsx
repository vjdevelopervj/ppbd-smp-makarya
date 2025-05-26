
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Database, Users, ShieldAlert, UserPlus, FileText, UserCheck, UserX, Trash2, Download, MessageSquareText, Send, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; 
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import type { AdminInboxMessage } from '@/app/kontak/page'; // Ensure this path and interface are correct
import type { UserNotification } from '@/app/notifikasi/page';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface RegisteredUser {
  id: string; // username
  username: string;
  fullName: string;
  registrationDate: string; 
  role: string;
}

interface StudentApplication {
  id: string; // NISN
  userUsername: string; 
  fullName: string;
  nisn: string;
  gender: string;
  birthPlace: string;
  birthDate: string; 
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
const ADMIN_INBOX_MESSAGES_KEY = 'smpMakaryaAdminInboxMessages';
const USER_NOTIFICATIONS_BASE_KEY = 'smpMakaryaUserNotifications_';


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [newApplicantsCount, setNewApplicantsCount] = useState(0); 
  const [passedStudentsCount, setPassedStudentsCount] = useState(0);
  const [failedStudentsCount, setFailedStudentsCount] = useState(0);
  const [incomingMessagesCount, setIncomingMessagesCount] = useState(0);

  const [detailedRegisteredUsers, setDetailedRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [detailedStudentApplications, setDetailedStudentApplications] = useState<StudentApplication[]>([]);
  const [adminInboxMessages, setAdminInboxMessages] = useState<AdminInboxMessage[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    data: RegisteredUser[] | StudentApplication[] | AdminInboxMessage[];
    type: 'users' | 'applications' | 'adminMessages';
    dataTypeKey: 'registeredUsers' | 'newApplicants' | 'passedStudents' | 'failedStudents' | 'incomingMessages';
  } | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'user' | 'application' | 'adminMessage' } | null>(null);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<AdminInboxMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');


  const loadData = useCallback(() => {
    const storedUsersRaw = typeof window !== 'undefined' ? localStorage.getItem(REGISTERED_USERS_KEY) : null;
    const storedUsersFromUserReg: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
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

    const adminMessagesRaw = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_INBOX_MESSAGES_KEY) : null;
    const adminMessagesData: AdminInboxMessage[] = adminMessagesRaw ? JSON.parse(adminMessagesRaw) : [];
    adminMessagesData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAdminInboxMessages(adminMessagesData);
    setIncomingMessagesCount(adminMessagesData.length);

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
    baseData: RegisteredUser[] | StudentApplication[] | AdminInboxMessage[],
    type: 'users' | 'applications' | 'adminMessages',
    dataTypeKey: 'registeredUsers' | 'newApplicants' | 'passedStudents' | 'failedStudents' | 'incomingMessages'
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
    } else if (type === 'adminMessages' && dataTypeKey === 'incomingMessages') {
        dataToShow = adminInboxMessages;
    }
    setModalContent({ title, data: [...dataToShow], type, dataTypeKey }); 
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = (id: string, type: 'user' | 'application' | 'adminMessage') => {
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
    } else if (itemToDelete.type === 'adminMessage') {
      const updatedMessages = adminInboxMessages.filter(msg => msg.id !== itemToDelete!.id);
      localStorage.setItem(ADMIN_INBOX_MESSAGES_KEY, JSON.stringify(updatedMessages));
      setAdminInboxMessages(updatedMessages);
      if (modalContent?.dataTypeKey === 'incomingMessages') {
        setModalContent(prev => prev ? {...prev, data: updatedMessages} : null);
      }
      toast({ title: "Pesan Dihapus", description: `Pesan dari pengguna telah dihapus.` });
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

  const handleOpenReplyModal = (message: AdminInboxMessage) => {
    setReplyingToMessage(message);
    setReplyMessage('');
    setIsReplyModalOpen(true);
  };

  const handleSendReply = () => {
    if (!replyingToMessage || !replyMessage.trim()) {
      toast({ title: "Gagal Mengirim", description: "Pesan balasan tidak boleh kosong.", variant: "destructive" });
      return;
    }

    if (typeof window !== 'undefined') {
      const targetUserIdentifier = replyingToMessage.senderUsername;

      if (!targetUserIdentifier) {
        toast({
          title: "Tidak Dapat Mengirim Notifikasi",
          description: `Pengguna ini (${replyingToMessage.fromName} - ${replyingToMessage.fromEmail}) tidak memiliki username terasosiasi untuk notifikasi dalam aplikasi. Balasan tidak dikirim ke notifikasi pengguna.`,
          variant: "destructive",
          duration: 7000,
        });
        setIsReplyModalOpen(false);
        setReplyingToMessage(null);
        return;
      }

      const userNotificationsKey = `${USER_NOTIFICATIONS_BASE_KEY}${targetUserIdentifier}`;
      let userNotifications: UserNotification[] = [];
      const storedNotificationsRaw = localStorage.getItem(userNotificationsKey);
      if (storedNotificationsRaw) {
        try {
          userNotifications = JSON.parse(storedNotificationsRaw);
        } catch (e) { console.error("Error parsing user notifications:", e); }
      }

      const newReplyNotification: UserNotification = {
        id: new Date().toISOString() + Math.random().toString(36).substring(2, 15),
        type: 'adminMessage',
        title: `Balasan dari Admin: ${replyingToMessage.subject}`,
        message: replyMessage,
        timestamp: new Date().toISOString(),
        payload: { originalSubject: replyingToMessage.subject, originalSender: replyingToMessage.fromName, contactEmail: replyingToMessage.fromEmail },
        isRead: false,
      };
      userNotifications.push(newReplyNotification);
      localStorage.setItem(userNotificationsKey, JSON.stringify(userNotifications));

      const updatedAdminMessages = adminInboxMessages.map(msg => 
        msg.id === replyingToMessage.id ? { ...msg, isReplied: true } : msg
      );
      localStorage.setItem(ADMIN_INBOX_MESSAGES_KEY, JSON.stringify(updatedAdminMessages));
      setAdminInboxMessages(updatedAdminMessages);
      if (modalContent?.dataTypeKey === 'incomingMessages') {
        setModalContent(prev => prev ? {...prev, data: updatedAdminMessages} : null);
      }
      
      toast({ title: "Balasan Terkirim", description: `Pesan balasan telah dikirim ke notifikasi untuk username: ${targetUserIdentifier}.` });
      setIsReplyModalOpen(false);
      setReplyingToMessage(null);
      setReplyMessage('');
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
          <TableHead>Akun Pendaftar (Username)</TableHead> 
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
            <TableCell className="font-medium">{app.userUsername}</TableCell> 
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
          <TableHead>Akun Pendaftar (Username)</TableHead> 
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
            <TableCell className="font-medium">{app.userUsername}</TableCell> 
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

  const renderAdminInboxTable = (data: AdminInboxMessage[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tanggal</TableHead>
          <TableHead>Dari</TableHead>
          <TableHead>Email Kontak</TableHead>
          <TableHead>Username Pengirim</TableHead>
          <TableHead>Subjek</TableHead>
          <TableHead className="min-w-[250px]">Pesan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((msg) => (
          <TableRow key={msg.id}>
            <TableCell>{format(new Date(msg.timestamp), "dd MMM yy, HH:mm", { locale: id })}</TableCell>
            <TableCell>{msg.fromName}</TableCell>
            <TableCell>{msg.fromEmail}</TableCell>
            <TableCell>{msg.senderUsername || <span className="text-xs text-muted-foreground italic">Tidak Login</span>}</TableCell>
            <TableCell>{msg.subject}</TableCell>
            <TableCell className="max-w-md whitespace-pre-wrap break-words">{msg.message}</TableCell>
             <TableCell>
              {msg.isReplied ? 
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Dibalas</span> : 
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Baru</span>
              }
            </TableCell>
            <TableCell className="space-x-1">
              <Button variant="outline" size="sm" onClick={() => handleOpenReplyModal(msg)} disabled={msg.isReplied || !msg.senderUsername}>
                <Send className="mr-1 h-3 w-3" /> 
                {msg.isReplied ? 'Telah Dibalas': (msg.senderUsername ? 'Balas User' : 'Tidak Bisa Dibalas')}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(msg.id, 'adminMessage')}>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-fade-in-up animation-delay-300">
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => handleCardClick(
            "Detail Pengguna",
            detailedRegisteredUsers,
            'users',
            'registeredUsers'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Pengguna
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredUserCount}</div>
            <p className="text-xs text-muted-foreground">
              Total akun pengguna.
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
              Isi form & selesaikan tes.
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
              Memenuhi syarat kelulusan.
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
              Tidak memenuhi syarat.
            </p>
          </CardContent>
        </Card>
        <Card 
          className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => handleCardClick(
              "Pesan Masuk dari Pengguna",
              adminInboxMessages,
              'adminMessages',
              'incomingMessages'
            )
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              Pesan Pengguna
            </CardTitle>
            <MessageSquareText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{incomingMessagesCount}</div>
            <p className="text-xs text-muted-foreground">
              Pesan dari form kontak.
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
                      (modalContent.dataTypeKey === "newApplicants" || modalContent.dataTypeKey === 'passedStudents' || modalContent.dataTypeKey === 'failedStudents') ?
                        ( modalContent.dataTypeKey === "newApplicants" ? 
                            renderFullApplicationDetailsTable(modalContent.data as StudentApplication[]) :
                            renderQuizStatusTable(modalContent.data as StudentApplication[])
                        ) :
                        renderFullApplicationDetailsTable(modalContent.data as StudentApplication[]) 
                    )}
                    {modalContent.type === 'adminMessages' && modalContent.dataTypeKey === 'incomingMessages' && (
                      renderAdminInboxTable(modalContent.data as AdminInboxMessage[])
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

      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Balas Pesan dari: {replyingToMessage?.fromName}</DialogTitle>
            <DialogDescription>
            {replyingToMessage?.senderUsername
                ? `Balasan akan dikirim ke notifikasi pengguna: ${replyingToMessage.senderUsername}.`
                : `Pengguna ini (${replyingToMessage?.fromName} - ${replyingToMessage?.fromEmail}) tidak memiliki username terasosiasi. Balasan tidak dapat dikirim ke notifikasi dalam aplikasi.`
            }
            {replyingToMessage?.senderUsername && replyingToMessage.fromEmail !== replyingToMessage.senderUsername && (
                ` Email kontak yang diberikan: ${replyingToMessage.fromEmail}`
            )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm font-medium">Subjek Asli:</p>
              <p className="text-sm text-muted-foreground p-2 border rounded-md">{replyingToMessage?.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Pesan Asli:</p>
              <p className="text-sm text-muted-foreground p-2 border rounded-md max-h-24 overflow-y-auto">{replyingToMessage?.message}</p>
            </div>
            <div>
              <Label htmlFor="replyMessageText" className="text-sm font-medium">Pesan Balasan Anda:</Label>
              <Textarea
                id="replyMessageText"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Ketik balasan Anda di sini..."
                rows={5}
                className="mt-1"
                disabled={!replyingToMessage?.senderUsername}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>Batal</Button>
            <Button 
              onClick={handleSendReply} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!replyingToMessage?.senderUsername || !replyMessage.trim()}
            >
              <Send className="mr-2 h-4 w-4" /> Kirim Balasan
            </Button>
          </DialogFooter>
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

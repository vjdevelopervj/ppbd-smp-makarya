
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox, BellRing, KeyRound, FileText, Trash2, AlertTriangle, MessageSquareReply, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export interface UserNotification {
  id: string;
  type: 'examResult' | 'passwordResetRequest' | 'adminMessage';
  title: string;
  message?: string; 
  timestamp: string; // ISO string
  payload?: any; 
  isRead?: boolean;
}

const USER_NOTIFICATIONS_BASE_KEY = 'smpMakaryaUserNotifications_';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [currentUserIdentifier, setCurrentUserIdentifier] = useState<string | null>(null); // To store username
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast(); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userUsername = localStorage.getItem('userUsername'); 
      const userRole = localStorage.getItem('userRole');
      
      if (userUsername && userRole === 'user') {
        setCurrentUserIdentifier(userUsername);
        
        const userNotificationsKey = `${USER_NOTIFICATIONS_BASE_KEY}${userUsername}`;
        let userSpecificNotifications: UserNotification[] = [];
        const storedUserNotificationsRaw = localStorage.getItem(userNotificationsKey);
        if (storedUserNotificationsRaw) {
          try {
            userSpecificNotifications = JSON.parse(storedUserNotificationsRaw);
          } catch (error) {
            console.error("Error parsing user-specific notifications from localStorage:", error);
          }
        }
        
        // Not attempting to load email-based notifications directly here anymore,
        // as admin replies are now targeted to username-specific notification keys if user was logged in.
        // If admin replied to a contact form message from a non-logged-in user (or user without username),
        // that reply would not appear here, which is the current design.
        
        userSpecificNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(userSpecificNotifications);

      }
      setIsLoading(false);
    }
  }, []);

  const handleDeleteAllNotifications = () => {
    if (typeof window !== 'undefined' && currentUserIdentifier) {
      const userNotificationsKey = `${USER_NOTIFICATIONS_BASE_KEY}${currentUserIdentifier}`;
      localStorage.removeItem(userNotificationsKey);
      setNotifications([]); // Clear displayed notifications
       toast({ title: "Notifikasi Dihapus", description: "Semua notifikasi untuk " + currentUserIdentifier + " telah dihapus." });
    }
  };

  const getIconForType = (type: UserNotification['type']) => {
    switch (type) {
      case 'examResult':
        return <FileText className="h-5 w-5 mr-3 text-green-500" />;
      case 'passwordResetRequest':
        return <KeyRound className="h-5 w-5 mr-3 text-orange-500" />;
      case 'adminMessage':
        return <MessageSquareReply className="h-5 w-5 mr-3 text-blue-500" />;
      default:
        return <Inbox className="h-5 w-5 mr-3" />;
    }
  };
  


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-300px)] py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Memuat notifikasi...</p>
      </div>
    );
  }

  if (!currentUserIdentifier) {
    return (
       <div className="flex justify-center items-center min-h-[calc(100vh-300px)] py-12">
        <Card className="w-full max-w-lg text-center shadow-xl animate-fade-in-up">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Akses Terbatas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Anda harus login sebagai user untuk melihat notifikasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full shadow-xl animate-fade-in-up mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Inbox className="h-8 w-8 mr-3 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Pusat Notifikasi</CardTitle>
              <CardDescription className="text-muted-foreground">
                Semua pemberitahuan penting Anda ({currentUserIdentifier}) akan muncul di sini.
              </CardDescription>
            </div>
          </div>
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDeleteAllNotifications} className="text-destructive border-destructive hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" /> Hapus Semua
            </Button>
          )}
        </CardHeader>
      </Card>

      {notifications.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg shadow">
            <Inbox className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
            <p className="mt-6 text-xl text-muted-foreground">Saat ini belum ada notifikasi baru untuk Anda.</p>
            <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/">Kembali ke Beranda</Link>
            </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`shadow-lg hover:shadow-xl transition-shadow ${notification.isRead ? 'opacity-70' : ''}`}>
              <CardHeader className="flex flex-row items-start">
                {getIconForType(notification.type)}
                <div>
                  <CardTitle className="text-xl">{notification.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {format(new Date(notification.timestamp), "eeee, dd MMMM yyyy 'pukul' HH:mm", { locale: id })}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {notification.type === 'examResult' && notification.payload && (
                  <div className="space-y-2">
                    <p>Hai <strong>{notification.payload.studentName}</strong> (NISN: {notification.payload.nisn}),</p>
                    <p>Hasil tes potensi akademik Anda adalah sebagai berikut:</p>
                    <ul className="list-disc list-inside pl-4 text-sm">
                      <li>Skor: <strong>{notification.payload.score} / {notification.payload.totalQuestions}</strong> ({((notification.payload.score / notification.payload.totalQuestions) * 100).toFixed(1)}%)</li>
                      <li>Status: <strong className={notification.payload.isPassed ? 'text-green-600' : 'text-destructive'}>{notification.payload.isPassed ? 'LULUS' : 'TIDAK LULUS'}</strong></li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">Pengumuman resmi dan informasi lebih lanjut akan disampaikan oleh pihak sekolah.</p>
                  </div>
                )}
                {notification.type === 'passwordResetRequest' && (
                  <div>
                    <p>{notification.message}</p>
                    {notification.payload?.resetLink && (
                       <Button asChild variant="link" className="px-0">
                        <Link href={notification.payload.resetLink}>Atur Password Baru Disini</Link>
                       </Button>
                    )}
                  </div>
                )}
                {notification.type === 'adminMessage' && (
                  <div className="space-y-2">
                    {notification.payload?.originalSubject && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Perihal Pesan Asli Anda:</p>
                        <p className="text-sm p-2 border rounded-md bg-muted/50 mt-1">{notification.payload.originalSubject}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mt-2">Balasan dari Admin:</p>
                      <p className="text-sm p-2 border rounded-md whitespace-pre-wrap bg-card mt-1">{notification.message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

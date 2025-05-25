
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Home, MailOpen, Loader2 } from 'lucide-react';
import { PASSING_PERCENTAGE } from '@/lib/quiz-questions';
import type { UserNotification } from '@/app/notifikasi/page'; // Import the type

const USER_NOTIFICATIONS_BASE_KEY = 'smpMakaryaUserNotifications_';


function QuizResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  const scoreStr = searchParams.get('score');
  const totalQuestionsStr = searchParams.get('total');
  const nisn = searchParams.get('nisn');

  if (!name || scoreStr === null || totalQuestionsStr === null || nisn === null) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Data Hasil Tidak Lengkap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Tidak dapat menampilkan hasil karena informasi tidak lengkap.
            </p>
            <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">Kembali ke Halaman Utama</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const score = parseInt(scoreStr, 10);
  const totalQuestions = parseInt(totalQuestionsStr, 10);

  const percentageScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const isPassed = percentageScore >= PASSING_PERCENTAGE;

  const handleViewNotification = () => {
    // Store notification in localStorage
    if (typeof window !== 'undefined') {
      const loggedInUserEmail = localStorage.getItem('userEmail');
      if (loggedInUserEmail) {
        const notificationsKey = `${USER_NOTIFICATIONS_BASE_KEY}${loggedInUserEmail}`;
        let existingNotifications: UserNotification[] = [];
        const storedNotificationsRaw = localStorage.getItem(notificationsKey);
        if (storedNotificationsRaw) {
          try {
            existingNotifications = JSON.parse(storedNotificationsRaw);
          } catch (e) {
            console.error("Error parsing existing notifications:", e);
          }
        }

        const newNotification: UserNotification = {
          id: new Date().toISOString() + Math.random().toString(36).substring(2, 15), // More unique ID
          type: 'examResult',
          title: 'Hasil Tes Potensi Akademik Anda',
          timestamp: new Date().toISOString(),
          payload: {
            studentName: decodeURIComponent(name),
            nisn: nisn,
            score: score,
            totalQuestions: totalQuestions,
            isPassed: isPassed,
          },
          isRead: false,
        };

        existingNotifications.push(newNotification);
        localStorage.setItem(notificationsKey, JSON.stringify(existingNotifications));
      }
    }
    router.push(`/notifikasi`);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-lg text-center shadow-xl animate-fade-in-up">
        <CardHeader>
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${isPassed ? 'bg-green-500' : 'bg-destructive'}`}>
            {isPassed ? <CheckCircle className="h-10 w-10 text-white" /> : <XCircle className="h-10 w-10 text-destructive-foreground" />}
          </div>
          <CardTitle className={`text-3xl font-bold ${isPassed ? 'text-green-600' : 'text-destructive'}`}>
            {isPassed ? 'Selamat, Anda LULUS!' : 'Sayang Sekali, Anda Belum Lulus'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Terima kasih, {decodeURIComponent(name)}, telah menyelesaikan proses pendaftaran dan tes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-foreground">
            Skor Anda: <strong className="text-primary">{score}</strong> dari <strong className="text-primary">{totalQuestions}</strong> soal ({percentageScore.toFixed(1)}%).
          </p>
          
          {isPassed ? (
            <p className="text-foreground">
              Anda telah memenuhi syarat kelulusan ({PASSING_PERCENTAGE}%). Informasi lebih lanjut mengenai tahap selanjutnya akan kami sampaikan melalui email atau nomor telepon yang terdaftar.
            </p>
          ) : (
            <p className="text-foreground">
              Anda belum memenuhi syarat kelulusan ({PASSING_PERCENTAGE}%). Jangan berkecil hati, tetap semangat dan terus belajar. Anda dapat menghubungi pihak sekolah untuk informasi lebih lanjut.
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Hasil tes ini juga telah dikirim ke pusat notifikasi Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Home className="mr-2 h-4 w-4" /> Kembali ke Halaman Utama
            </Button>
            <Button onClick={handleViewNotification} variant="outline" className="text-accent border-accent hover:bg-accent/10">
              <MailOpen className="mr-2 h-4 w-4" /> Lihat di Pusat Notifikasi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizResultPage() {
  return (
    <Suspense fallback={
       <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memuat hasil tes...</p>
      </div>
    }>
      <QuizResultContent />
    </Suspense>
  );
}


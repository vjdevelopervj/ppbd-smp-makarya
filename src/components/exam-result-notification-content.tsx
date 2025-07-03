'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Home, MailOpen } from 'lucide-react';
import { PASSING_PERCENTAGE } from '@/lib/quiz-questions';

export default function ExamResultNotificationContent() {
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
            <CardTitle className="text-2xl font-bold text-destructive">Data Tidak Lengkap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Informasi hasil ujian tidak lengkap untuk ditampilkan.
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

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-lg shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
            <MailOpen className="h-10 w-10 text-accent-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Notifikasi Hasil Ujian (Arsip)</CardTitle>
          <CardDescription className="text-muted-foreground">
            Pesan ini untuk {decodeURIComponent(name)} (NISN: {nisn}). (Halaman ini diarsipkan, silakan cek Pusat Notifikasi)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-4 rounded-md text-center ${isPassed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {isPassed ? (
              <CheckCircle className={`mx-auto h-12 w-12 mb-3 text-green-600`} />
            ) : (
              <XCircle className={`mx-auto h-12 w-12 mb-3 text-destructive`} />
            )}
            <h3 className={`text-2xl font-semibold ${isPassed ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
              Status Kelulusan: {isPassed ? 'LULUS' : 'TIDAK LULUS'}
            </h3>
          </div>
          
          <div className="text-foreground text-left space-y-2 p-4 border rounded-md">
            <p><strong>Nama Lengkap:</strong> {decodeURIComponent(name)}</p>
            <p><strong>NISN:</strong> {nisn}</p>
            <p><strong>Skor Ujian:</strong> <span className="font-bold text-primary">{score}</span> dari {totalQuestions} ({percentageScore.toFixed(1)}%)</p>
            <p><strong>Standar Kelulusan:</strong> {PASSING_PERCENTAGE}%</p>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Ini adalah notifikasi hasil tes Anda. Pengumuman resmi dan informasi lebih lanjut akan disampaikan oleh pihak sekolah SMP Makarya melalui kontak yang terdaftar atau Pusat Notifikasi.
          </p>
          <Button onClick={() => router.push('/notifikasi')} className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <MailOpen className="mr-2 h-4 w-4" /> Cek Pusat Notifikasi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
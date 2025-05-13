
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { PASSING_PERCENTAGE } from '@/lib/quiz-questions';

function QuizResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name') || 'Siswa';
  const score = parseInt(searchParams.get('score') || '0', 10);
  const totalQuestions = parseInt(searchParams.get('total') || '1', 10);

  const percentageScore = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const isPassed = percentageScore >= PASSING_PERCENTAGE;

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
            Pastikan untuk selalu memeriksa email dan pesan Anda untuk pengumuman resmi dari SMP Makarya.
          </p>
          <Button onClick={() => router.push('/')} className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Home className="mr-2 h-4 w-4" /> Kembali ke Halaman Utama
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuizResultPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Memuat hasil tes...</div>}>
      <QuizResultContent />
    </Suspense>
  );
}

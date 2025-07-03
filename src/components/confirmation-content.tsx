'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Siswa';

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-4">
            <CheckCircle className="h-10 w-10 text-accent-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Pendaftaran Berhasil!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Terima kasih, {decodeURIComponent(name)}, telah mendaftar di SMP Makarya.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Data pendaftaran Anda telah kami terima. Informasi lebih lanjut mengenai proses seleksi akan kami sampaikan melalui email atau nomor telepon yang terdaftar.
          </p>
          <p className="text-sm text-muted-foreground">
            Pastikan untuk selalu memeriksa email dan pesan Anda.
          </p>
          <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">Kembali ke Halaman Utama</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
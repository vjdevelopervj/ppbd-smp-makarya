
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';
import Link from 'next/link';

export default function NotificationPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-300px)] py-12">
      <Card className="w-full max-w-lg text-center shadow-xl animate-fade-in-up">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-4">
            <Inbox className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Pusat Notifikasi</CardTitle>
          <CardDescription className="text-muted-foreground">
            Semua pemberitahuan penting Anda akan muncul di sini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 border rounded-md bg-card">
            <p className="text-muted-foreground">Saat ini belum ada notifikasi baru untuk Anda.</p>
          </div>
          <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

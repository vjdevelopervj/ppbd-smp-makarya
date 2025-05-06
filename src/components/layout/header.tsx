import Image from 'next/image';
import Link from 'next/link';
import { School, Home, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          {/* Replace with actual school logo if available */}
          {/* <Image src="/logo-smp-makarya.png" alt="Logo SMP Makarya" width={40} height={40} /> */}
          <div className="bg-primary-foreground p-2 rounded-full">
            <School className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">SMP Makarya</h1>
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link href="/" className="flex items-center">
              <Home className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Beranda</span>
            </Link>
          </Button>
          <Button variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/pendaftaran" className="flex items-center">
              <UserPlus className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Pendaftaran</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

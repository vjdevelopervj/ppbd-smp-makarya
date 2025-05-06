import Image from 'next/image';
import Link from 'next/link';
import { School } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <School className="h-10 w-10 text-primary-foreground" />
          <h1 className="text-2xl font-bold text-primary-foreground">Makarya Admission</h1>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}

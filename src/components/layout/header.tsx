
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { School, Home, UserPlus, MessageCircle, LogIn, LogOut, UserCircle, LayoutDashboard, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false); // Generic signed-in state
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const updateAuthState = () => {
      if (typeof window !== 'undefined') {
        const adminSignedIn = localStorage.getItem('isAdminSignedIn') === 'true';
        const regularUserSignedIn = localStorage.getItem('isUserSignedIn') === 'true'; // This is for regular users
        const storedRole = localStorage.getItem('userRole');
        setUserRole(storedRole);

        if (adminSignedIn && storedRole === 'admin') {
          setIsUserSignedIn(true);
          const adminName = localStorage.getItem('adminUsername');
          setUserDisplayName(adminName || 'Admin Panel');
        } else if (regularUserSignedIn && storedRole === 'user') {
          setIsUserSignedIn(true);
          const fullName = localStorage.getItem('userFullName');
          const username = localStorage.getItem('userEmail'); // This stores the username
          setUserDisplayName(fullName || username || 'User');
        } else {
          setIsUserSignedIn(false);
          setUserDisplayName(null);
          setUserRole(null);
        }
      }
    };

    updateAuthState();
    window.addEventListener('storage', updateAuthState);
    window.addEventListener('authChange', updateAuthState);

    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('authChange', updateAuthState);
    };
  }, []);


  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isUserSignedIn'); // For regular users
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('isAdminSignedIn'); // For admin
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('userRole');
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    router.push('/'); 
  };

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-primary-foreground p-2 rounded-full">
            <School className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">SMP Makarya</h1>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link href="/" className="flex items-center">
              <Home className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Beranda</span>
            </Link>
          </Button>
           <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link href="/kontak" className="flex items-center">
              <MessageCircle className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Kontak</span>
            </Link>
          </Button>
          {userRole !== 'admin' && (
            <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <Link href="/notifikasi" className="flex items-center">
                <Mail className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Notifikasi</span>
              </Link>
            </Button>
          )}

          {isUserSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground flex items-center">
                  <UserCircle className="mr-1 sm:mr-2 h-5 w-5" />
                  <span className="text-sm sm:text-base hidden md:inline truncate max-w-[100px]">{userDisplayName || 'Akun'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userDisplayName && (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Masuk sebagai</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {userDisplayName} ({userRole})
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                {userRole === 'admin' && (
                   <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             null 
          )}

          {isUserSignedIn && userRole === 'user' && (
            <Button variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/pendaftaran" className="flex items-center">
                <UserPlus className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Pendaftaran Siswa</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

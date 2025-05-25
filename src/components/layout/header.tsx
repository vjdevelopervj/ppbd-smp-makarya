
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { School, Home, UserPlus, MessageCircle, LogIn, LogOut, UserCircle } from 'lucide-react';
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
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null); // Changed from userEmail to userDisplayName
  const router = useRouter();

  useEffect(() => {
    // Function to update auth state
    const updateAuthState = () => {
      if (typeof window !== 'undefined') {
        const signedIn = localStorage.getItem('isUserSignedIn');
        // Try to get full name first, fallback to username (userEmail stores username)
        const fullName = localStorage.getItem('userFullName');
        const username = localStorage.getItem('userEmail'); // This now stores the username directly
        
        setIsUserSignedIn(signedIn === 'true');
        setUserDisplayName(fullName || username || null);
      }
    };

    // Initial check
    updateAuthState();

    // Listen for storage changes to update auth state across tabs/windows
    window.addEventListener('storage', updateAuthState);

    // Listen for custom event dispatched after login/logout
    const handleAuthChange = () => updateAuthState();
    window.addEventListener('authChange', handleAuthChange);


    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);


  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isUserSignedIn');
      localStorage.removeItem('userEmail'); // Stores username
      localStorage.removeItem('userFullName'); // Stores full name
      // Dispatch a custom event to notify other components (like this header)
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    router.push('/'); // Redirect to homepage after sign out
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

          {isUserSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground flex items-center">
                  <UserCircle className="mr-1 sm:mr-2 h-5 w-5" />
                  <span className="text-sm sm:text-base hidden md:inline truncate max-w-[100px]">{userDisplayName || 'Akun'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userDisplayName && ( // Changed from userEmail
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Masuk sebagai</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {userDisplayName}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             null // Sign in/up is handled by the main page form
          )}

          {/* Tombol Pendaftaran hanya muncul jika user sudah login */}
          {isUserSignedIn && (
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


'use client';

import { useEffect, useState } from 'react';
import LoginSelectionForm from '@/components/login-selection-form';
import SchoolProfile from '@/components/school-profile';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status from localStorage
    const signedIn = typeof window !== 'undefined' ? localStorage.getItem('isUserSignedIn') : null;
    setIsAuthenticated(signedIn === 'true');
    setIsLoading(false);

    // Listen for auth changes (e.g., after login/logout)
    const handleAuthChange = () => {
      const updatedSignedIn = typeof window !== 'undefined' ? localStorage.getItem('isUserSignedIn') : null;
      setIsAuthenticated(updatedSignedIn === 'true');
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isUserSignedIn') {
        setIsAuthenticated(event.newValue === 'true');
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memuat halaman...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {isAuthenticated ? (
        <SchoolProfile />
      ) : (
        <LoginSelectionForm />
      )}
    </div>
  );
}

import { Suspense } from 'react';
import ConfirmationContent from '@/components/confirmation-content';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Memuat konfirmasi...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
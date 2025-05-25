
import LoginSelectionForm from '@/components/login-selection-form';
// import SchoolProfile from '@/components/school-profile'; // SchoolProfile dinonaktifkan sementara

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* <SchoolProfile /> */} {/* Konten profil sekolah bisa diaktifkan kembali nanti jika diperlukan */}
      <LoginSelectionForm />
    </div>
  );
}

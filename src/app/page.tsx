import RegistrationForm from '@/components/registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Formulir Pendaftaran Siswa</CardTitle>
          <CardDescription className="text-muted-foreground">
            Selamat datang di SMP Makarya. Silakan isi formulir di bawah ini dengan data yang benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Target, Eye, Building, Award, Tv, Microscope, Dumbbell, Globe, Music, Palette, ArrowRight } from 'lucide-react';

export default function SchoolProfile() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden shadow-2xl">
        <Image 
          src="https://picsum.photos/1200/500" 
          alt="Gedung Sekolah SMP Makarya" 
          width={1200} 
          height={500} 
          className="w-full object-cover"
          data-ai-hint="school building"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-down">
            Selamat Datang di SMP Makarya
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fade-in-up max-w-2xl">
            Membentuk Generasi Unggul, Berkarakter, dan Berwawasan Global.
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground animate-fade-in-up animation-delay-300">
            <Link href="/pendaftaran">
              Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-secondary">
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <BookOpen className="mr-3 h-8 w-8" /> Tentang SMP Makarya
          </CardTitle>
          <CardDescription className="text-secondary-foreground">
            Kenali lebih dekat sekolah kami, sejarah, visi, dan misi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Sejarah Singkat</h3>
            <p className="text-muted-foreground leading-relaxed">
              SMP Makarya didirikan pada tahun 1985 dengan semangat untuk menyediakan pendidikan berkualitas yang terjangkau bagi masyarakat. Sejak awal berdirinya, kami berkomitmen untuk menciptakan lingkungan belajar yang inspiratif dan mendukung perkembangan potensi setiap siswa. Dengan perjalanan lebih dari tiga dekade, SMP Makarya terus berinovasi dan beradaptasi untuk menjawab tantangan zaman, meluluskan ribuan alumni yang berprestasi dan berkontribusi di berbagai bidang.
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center"><Eye className="mr-2 h-6 w-6 text-accent" />Visi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Menjadi sekolah unggulan yang menghasilkan lulusan beriman, berilmu, berkarakter, dan berwawasan global.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center"><Target className="mr-2 h-6 w-6 text-accent" />Misi</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 leading-relaxed">
                <li>Menyelenggarakan pendidikan yang berkualitas dan relevan dengan perkembangan IPTEK.</li>
                <li>Membentuk karakter siswa yang berakhlak mulia dan berbudi pekerti luhur.</li>
                <li>Mengembangkan potensi siswa secara optimal melalui kegiatan akademik dan non-akademik.</li>
                <li>Menciptakan lingkungan belajar yang kondusif, aman, dan menyenangkan.</li>
                <li>Menjalin kerjasama yang harmonis dengan orang tua, masyarakat, dan stakeholder lainnya.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-primary mb-6">
          Bergabunglah dengan Keluarga Besar SMP Makarya!
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Wujudkan potensi terbaik putra-putri Anda bersama kami. Proses pendaftaran siswa baru tahun ajaran 2024/2025 telah dibuka.
        </p>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/pendaftaran">
            Informasi Pendaftaran <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

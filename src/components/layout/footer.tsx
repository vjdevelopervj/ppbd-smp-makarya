import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">SMP Makarya</h3>
            <p className="text-sm">
              Mendidik dengan hati, membangun generasi berprestasi.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Kontak Kami</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start">
                <MapPin className="mr-2 h-4 w-4 text-accent" />
                Jl. Pendidikan No. 123, Kota Makarya, 12345
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="mr-2 h-4 w-4 text-accent" />
                (021) 123-4567
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Mail className="mr-2 h-4 w-4 text-accent" />
                info@smpmakarya.sch.id
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/pendaftaran" className="hover:text-accent transition-colors">Pendaftaran</a></li>
              <li><a href="/#tentang-kami" className="hover:text-accent transition-colors">Tentang Kami</a></li>
              <li><a href="/#fasilitas" className="hover:text-accent transition-colors">Fasilitas</a></li>
              <li><a href="/#prestasi" className="hover:text-accent transition-colors">Prestasi</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-sm">&copy; {new Date().getFullYear()} SMP Makarya. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

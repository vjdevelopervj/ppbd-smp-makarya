export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} SMP Makarya. All rights reserved.</p>
        <p className="text-sm mt-1">
          Jl. Pendidikan No. 123, Kota Makarya
        </p>
      </div>
    </footer>
  );
}

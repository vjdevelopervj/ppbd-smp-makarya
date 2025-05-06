
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { UploadCloud, User, Home, BookOpen, FileText, Briefcase, Phone, Award } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }).max(100),
  address: z.string().min(10, { message: 'Alamat minimal 10 karakter.' }).max(200),
  previousSchool: z.string().min(3, { message: 'Nama sekolah asal minimal 3 karakter.' }).max(100),
  nisn: z.string().regex(/^\d{10}$/, { message: 'NISN harus terdiri dari 10 digit angka.' }),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Tanggal lahir tidak valid.'}),
  parentName: z.string().min(3, { message: 'Nama orang tua minimal 3 karakter.' }).max(100),
  parentOccupation: z.string().min(3, {message: 'Pekerjaan orang tua minimal 3 karakter'}).max(100),
  parentContact: z.string().regex(/^(\+62|0)8[1-9][0-9]{6,9}$/, { message: 'Nomor telepon orang tua tidak valid. Gunakan format 08xx atau +628xx.'}),
  birthCertificate: z.any()
    .refine((files) => files?.[0], "Akta kelahiran wajib diunggah.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran maksimal file adalah 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Format file tidak didukung. Hanya .jpg, .jpeg, .png, dan .pdf yang diperbolehkan."
    ),
  familyCard: z.any()
    .refine((files) => files?.[0], "Kartu keluarga wajib diunggah.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran maksimal file adalah 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Format file tidak didukung. Hanya .jpg, .jpeg, .png, dan .pdf yang diperbolehkan."
    ),
  lastDiploma: z.any()
    .refine((files) => files?.[0], "Ijazah terakhir wajib diunggah.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran maksimal file adalah 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Format file tidak didukung. Hanya .jpg, .jpeg, .png, dan .pdf yang diperbolehkan."
    ),
});

type RegistrationFormData = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      address: '',
      previousSchool: '',
      nisn: '',
      birthDate: '',
      parentName: '',
      parentOccupation: '',
      parentContact: '',
      birthCertificate: undefined,
      familyCard: undefined,
      lastDiploma: undefined,
    },
  });

  async function onSubmit(data: RegistrationFormData) {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Form submitted:', data);

    // Construct WhatsApp message
    let whatsappMessage = `*Data Pendaftaran Siswa Baru SMP Makarya*\n\n`;
    whatsappMessage += `*Data Siswa:*\n`;
    whatsappMessage += `Nama Lengkap: ${data.fullName}\n`;
    whatsappMessage += `NISN: ${data.nisn}\n`;
    whatsappMessage += `Tanggal Lahir: ${data.birthDate}\n`;
    whatsappMessage += `Alamat: ${data.address}\n`;
    whatsappMessage += `Asal Sekolah: ${data.previousSchool}\n\n`;

    whatsappMessage += `*Data Orang Tua/Wali:*\n`;
    whatsappMessage += `Nama: ${data.parentName}\n`;
    whatsappMessage += `Pekerjaan: ${data.parentOccupation}\n`;
    whatsappMessage += `Kontak: ${data.parentContact}\n\n`;

    whatsappMessage += `*Dokumen Terunggah (Nama File):*\n`;
    whatsappMessage += `Akta Kelahiran: ${data.birthCertificate?.[0]?.name || 'Tidak ada file'}\n`;
    whatsappMessage += `Kartu Keluarga: ${data.familyCard?.[0]?.name || 'Tidak ada file'}\n`;
    whatsappMessage += `Ijazah Terakhir: ${data.lastDiploma?.[0]?.name || 'Tidak ada file'}\n\n`;
    
    whatsappMessage += `_Mohon data ini diproses dan diarsipkan._`; // Simplified message for admin

    const adminPhoneNumber = "6285881585749"; 
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;

    // Display toast informing user about WhatsApp redirection and action needed
    toast({
      title: 'Data Pendaftaran Siap Dikirim!',
      description: (
        <div>
          <p>Anda akan diarahkan ke WhatsApp untuk mengirim data pendaftaran ke Admin.</p>
          <p className="mt-1">Silakan tekan tombol kirim di WhatsApp.</p>
        </div>
      ),
      variant: 'default',
      className: 'bg-accent text-accent-foreground',
      duration: 7000, 
    });
    
    // Wait a bit for user to read the toast before redirecting
    await new Promise((resolve) => setTimeout(resolve, 2500)); 
    
    // Open WhatsApp link in a new tab
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, '_blank');
    }
    
    // Redirect to confirmation page after attempting to open WhatsApp
    // This happens regardless of whether the WhatsApp message was actually sent,
    // as we can't track that from the browser.
    router.push(`/confirmation?name=${encodeURIComponent(data.fullName)}`);
    setIsSubmitting(false);
    // form.reset(); // Consider if form reset is desired here or on confirmation page.
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, fieldName: keyof RegistrationFormData) => {
    if (event.target.files && event.target.files.length > 0) {
      form.setValue(fieldName, event.target.files);
      form.trigger(fieldName); 
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Budi Santoso" {...field} />
              </FormControl>
              <FormDescription>Isi sesuai dengan nama di akta kelahiran.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nisn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />NISN (Nomor Induk Siswa Nasional)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Contoh: 0012345678" {...field} />
              </FormControl>
              <FormDescription>Pastikan NISN Anda valid dan terdiri dari 10 digit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Tanggal Lahir</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Home className="mr-2 h-5 w-5 text-primary" />Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea placeholder="Contoh: Jl. Merdeka No. 10, RT 01 RW 02, Kelurahan Bahagia, Kecamatan Sentosa, Kota Damai" {...field} />
              </FormControl>
              <FormDescription>Isi alamat tempat tinggal saat ini.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previousSchool"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" />Asal Sekolah (SD/MI)</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: SD Negeri 1 Makmur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Nama Orang Tua/Wali</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Joko Susilo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentOccupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" />Pekerjaan Orang Tua/Wali</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Karyawan Swasta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Phone className="mr-2 h-5 w-5 text-primary" />Kontak Orang Tua/Wali (Nomor HP)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Contoh: 081234567890 atau +6281234567890" {...field} />
              </FormControl>
              <FormDescription>Nomor HP yang bisa dihubungi.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
            control={form.control}
            name="birthCertificate"
            render={({ fieldState: { error } }) => (
                <FormItem>
                <FormLabel className="flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary" />Unggah Akta Kelahiran</FormLabel>
                <FormControl>
                    <Input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    onChange={(e) => handleFileChange(e, 'birthCertificate')}
                    className="file:text-primary file:font-semibold file:bg-primary/10 hover:file:bg-primary/20"
                    />
                </FormControl>
                <FormDescription>File PDF, JPG, atau PNG. Maksimal 5MB.</FormDescription>
                {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
            )}
        />

        <Controller
            control={form.control}
            name="familyCard"
            render={({ fieldState: { error } }) => (
                <FormItem>
                <FormLabel className="flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary" />Unggah Kartu Keluarga</FormLabel>
                <FormControl>
                    <Input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    onChange={(e) => handleFileChange(e, 'familyCard')}
                    className="file:text-primary file:font-semibold file:bg-primary/10 hover:file:bg-primary/20"
                    />
                </FormControl>
                <FormDescription>File PDF, JPG, atau PNG. Maksimal 5MB.</FormDescription>
                {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
            )}
        />

        <Controller
            control={form.control}
            name="lastDiploma"
            render={({ fieldState: { error } }) => (
                <FormItem>
                <FormLabel className="flex items-center"><Award className="mr-2 h-5 w-5 text-primary" />Unggah Ijazah Terakhir (SD/MI)</FormLabel>
                <FormControl>
                    <Input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES.join(',')}
                    onChange={(e) => handleFileChange(e, 'lastDiploma')}
                    className="file:text-primary file:font-semibold file:bg-primary/10 hover:file:bg-primary/20"
                    />
                </FormControl>
                <FormDescription>File PDF, JPG, atau PNG. Maksimal 5MB.</FormDescription>
                {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
            )}
        />


        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Daftar & Siapkan Data untuk Admin'}
        </Button>
      </form>
    </Form>
  );
}


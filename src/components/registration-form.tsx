
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendRegistrationEmail } from '@/app/actions/registrationActions'; // Server Action

const registrationFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  gender: z.enum(['Laki-laki', 'Perempuan'], { required_error: 'Jenis kelamin harus dipilih.' }),
  birthPlace: z.string().min(3, { message: 'Tempat lahir minimal 3 karakter.' }),
  birthDate: z.date({ required_error: 'Tanggal lahir harus diisi.' }),
  religion: z.string().min(3, { message: 'Agama minimal 3 karakter.' }),
  address: z.string().min(10, { message: 'Alamat lengkap minimal 10 karakter.' }),
  studentPhoneNumber: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }).regex(/^\d+$/, { message: "Nomor telepon hanya boleh berisi angka." }).optional().or(z.literal('')),
  previousSchool: z.string().min(3, { message: 'Asal sekolah minimal 3 karakter.' }),
  lastCertificate: z.enum(['SD/MI', 'Paket A'], { required_error: 'Ijazah terakhir harus dipilih.'}),
  fatherName: z.string().min(3, { message: 'Nama ayah minimal 3 karakter.' }),
  fatherOccupation: z.string().min(3, { message: 'Pekerjaan ayah minimal 3 karakter.' }),
  fatherPhoneNumber: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }).regex(/^\d+$/, { message: "Nomor telepon hanya boleh berisi angka." }),
  motherName: z.string().min(3, { message: 'Nama ibu minimal 3 karakter.' }),
  motherOccupation: z.string().min(3, { message: 'Pekerjaan ibu minimal 3 karakter.' }),
  motherPhoneNumber: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }).regex(/^\d+$/, { message: "Nomor telepon hanya boleh berisi angka." }),
  parentEmail: z.string().email({ message: 'Format email tidak valid.' }),
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;

export default function RegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: '',
      birthPlace: '',
      religion: '',
      address: '',
      studentPhoneNumber: '',
      previousSchool: '',
      fatherName: '',
      fatherOccupation: '',
      fatherPhoneNumber: '',
      motherName: '',
      motherOccupation: '',
      motherPhoneNumber: '',
      parentEmail: '',
    },
  });

  async function onSubmit(data: RegistrationFormData) {
    setIsSubmitting(true);
    try {
      const result = await sendRegistrationEmail(data);
      if (result.success) {
        toast({
          title: 'Pendaftaran Berhasil!',
          description: 'Data Anda telah kami terima dan simulasi pengiriman email telah dilakukan.',
          variant: 'default',
          className: 'bg-accent text-accent-foreground',
        });
        form.reset();
        router.push(`/confirmation?name=${encodeURIComponent(data.fullName)}`);
      } else {
        toast({
          title: 'Pendaftaran Gagal',
          description: result.message || 'Terjadi kesalahan saat mengirim data.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: 'Pendaftaran Gagal',
        description: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Data Siswa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap Calon Siswa</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Lahir</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan tempat lahir" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: id })
                        ) : (
                          <span>Pilih tanggal lahir</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agama</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan agama" {...field} />
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
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea placeholder="Masukkan alamat lengkap" {...field} />
              </FormControl>
              <FormDescription>
                Sertakan RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, dan Kode Pos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="studentPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP Calon Siswa (Aktif WA) <span className="text-muted-foreground text-xs">(Opsional)</span></FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="previousSchool"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Asal Sekolah (SD/MI)</FormLabel>
                <FormControl>
                    <Input placeholder="Nama sekolah sebelumnya" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastCertificate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ijazah Terakhir</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ijazah terakhir" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SD/MI">Ijazah SD/MI</SelectItem>
                    <SelectItem value="Paket A">Ijazah Paket A</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Data Orang Tua/Wali */}
        <h3 className="text-xl font-semibold text-primary pt-4 border-t mt-8">Data Orang Tua/Wali</h3>

        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Ayah</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap ayah" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fatherOccupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pekerjaan Ayah</FormLabel>
                <FormControl>
                  <Input placeholder="Pekerjaan ayah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fatherPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP Ayah (Aktif WA)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Ibu</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap ibu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="motherOccupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pekerjaan Ibu</FormLabel>
                <FormControl>
                  <Input placeholder="Pekerjaan ibu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="motherPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP Ibu (Aktif WA)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="parentEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Orang Tua/Wali</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email.orangtua@contoh.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim Data...
            </>
          ) : (
            'Daftar Sekarang'
          )}
        </Button>
      </form>
    </Form>
  );
}


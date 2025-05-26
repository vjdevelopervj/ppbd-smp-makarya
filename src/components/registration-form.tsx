
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendRegistrationEmail } from '@/app/actions/registrationActions';

const registrationFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  nisn: z.string().length(10, { message: 'NISN harus 10 digit.' }).regex(/^\d+$/, { message: "NISN hanya boleh berisi angka." }),
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

export interface StudentApplicationDataToStore extends RegistrationFormData {
  id: string; 
  userUsername: string; // Changed from userEmail to userUsername
  formSubmittedDate: string; 
  quizCompleted: boolean;
  quizScore?: number;
  passedQuiz?: boolean;
  birthDate: string; // birthDate will be string here for storage
}

const STUDENT_APPLICATIONS_KEY = 'smpMakaryaStudentApplications';


export default function RegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); 

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: '',
      nisn: '',
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

  const studentFields: (keyof RegistrationFormData)[] = [
    'fullName', 'nisn', 'gender', 'birthPlace', 'birthDate', 
    'religion', 'address', 'studentPhoneNumber', 'previousSchool', 'lastCertificate'
  ];

  const handleNextStep = async () => {
    const isValid = await form.trigger(studentFields);
    if (isValid) {
      setCurrentStep(2);
    } else {
      toast({
        title: 'Data Belum Lengkap',
        description: 'Mohon periksa kembali data calon siswa yang Anda isi.',
        variant: 'destructive',
      });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  async function onSubmit(data: RegistrationFormData) {
    setIsSubmitting(true);
    let loggedInUserUsername = ''; // Changed variable name
    if (typeof window !== 'undefined') {
      loggedInUserUsername = localStorage.getItem('userUsername') || 'anonim'; // Get userUsername
    }

    try {
      const result = await sendRegistrationEmail({
        ...data,
        birthDate: data.birthDate.toISOString(), 
        userUsername: loggedInUserUsername // Pass userUsername
      });

      if (result.success) {
        if (typeof window !== 'undefined') {
          const applicationsRaw = localStorage.getItem(STUDENT_APPLICATIONS_KEY);
          let applications: StudentApplicationDataToStore[] = applicationsRaw ? JSON.parse(applicationsRaw) : [];
          
          const existingApplicationIndex = applications.findIndex(app => app.nisn === data.nisn);
          
          const newApplicationData: StudentApplicationDataToStore = {
            ...data,
            userUsername: loggedInUserUsername, // Store userUsername
            birthDate: data.birthDate.toISOString(), 
            id: data.nisn,
            formSubmittedDate: new Date().toISOString(),
            quizCompleted: false, 
          };

          if (existingApplicationIndex > -1) {
            applications[existingApplicationIndex] = {
              ...applications[existingApplicationIndex], 
              ...newApplicationData, 
              quizCompleted: applications[existingApplicationIndex].quizCompleted,
              quizScore: applications[existingApplicationIndex].quizScore,
              passedQuiz: applications[existingApplicationIndex].passedQuiz,
            };
          } else {
            applications.push(newApplicationData);
          }
          localStorage.setItem(STUDENT_APPLICATIONS_KEY, JSON.stringify(applications));
        }

        toast({
          title: 'Pendaftaran Diproses!',
          description: 'Data Anda telah kami terima. Anda akan diarahkan ke sesi tes.',
          variant: 'default',
          className: 'bg-accent text-accent-foreground',
        });
        form.reset();
        router.push(`/quiz?name=${encodeURIComponent(data.fullName)}&nisn=${encodeURIComponent(data.nisn)}`);
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
        {currentStep === 1 && (
          <>
            <h3 className="text-xl font-semibold text-primary pt-4 border-b">Data Calon Siswa (Langkah 1 dari 2)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NISN (Nomor Induk Siswa Nasional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan 10 digit NISN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
            <Button type="button" onClick={handleNextStep} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground">
              Selanjutnya (Data Orang Tua) <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3 className="text-xl font-semibold text-primary pt-4 border-t mt-8">Data Orang Tua/Wali (Langkah 2 dari 2)</h3>

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

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button type="button" variant="outline" onClick={handlePreviousStep} className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali (Data Siswa)
              </Button>
              <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses Pendaftaran...
                  </>
                ) : (
                  'Daftar & Lanjut ke Tes'
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}

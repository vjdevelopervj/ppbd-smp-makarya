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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import Image from 'next/image';

const contactFormSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  subject: z.string().min(5, { message: 'Subjek minimal 5 karakter.' }),
  message: z.string().min(10, { message: 'Pesan minimal 10 karakter.' }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormData) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Contact form submitted:', data);

    toast({
      title: 'Pesan Terkirim!',
      description: 'Terima kasih telah menghubungi kami. Pesan Anda akan segera kami proses.',
      variant: 'default',
      className: 'bg-accent text-accent-foreground',
    });
    form.reset();
  }

  return (
    <div className="space-y-12">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl font-bold flex items-center">
            <Mail className="mr-3 h-8 w-8" /> Hubungi Kami
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Kami senang mendengar dari Anda! Silakan isi formulir di bawah atau gunakan informasi kontak yang tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Informasi Kontak</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mr-4 h-7 w-7 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Alamat Sekolah</h4>
                  <p className="text-muted-foreground">
                    Jl. Pendidikan No. 123, Kelurahan Cerdas, Kecamatan Maju, Kota Makarya, Kode Pos 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="mr-4 h-7 w-7 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Telepon</h4>
                  <p className="text-muted-foreground">(021) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="mr-4 h-7 w-7 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground">
                    <a href="mailto:info@smpmakarya.sch.id" className="hover:text-accent transition-colors">
                      info@smpmakarya.sch.id
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 rounded-lg overflow-hidden shadow-md">
              {/* Placeholder for map. In a real app, use an embedded map component. */}
              <Image 
                src="https://picsum.photos/600/350?random=map" 
                alt="Peta Lokasi SMP Makarya" 
                width={600} 
                height={350}
                className="w-full object-cover"
                data-ai-hint="map location" 
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Kirim Pesan Langsung</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@anda.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjek Pesan</FormLabel>
                      <FormControl>
                        <Input placeholder="Subjek pesan Anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Isi Pesan</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tuliskan pesan Anda di sini..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    'Mengirim...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Kirim Pesan
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use server';

import type { RegistrationFormData } from '@/components/registration-form';

export async function sendRegistrationEmail(
  formData: RegistrationFormData
): Promise<{ success: boolean; message?: string }> {
  const recipientEmail = 'rockyalfarizi2@gmail.com'; // Updated recipient email
  // In a real app, the senderEmail would be a configured email address.
  // For this simulation, we'll use the specified sender.
  const senderEmail = 'tenis882@gmail.com'; // Updated sender email

  console.log(`Simulating sending email to: ${recipientEmail}`);
  console.log(`From: ${senderEmail}`);
  console.log('Subject: CALON SISWA/SISWI TELAH MENDAFTAR');
  console.log('Registration Data:', {
    ...formData,
    studentPhoneNumber: formData.studentPhoneNumber || 'Tidak diisi', // Handle optional field for logging
  });

  // Simulate email sending process
  // In a real application, you would use an email sending service (e.g., Nodemailer with SMTP, SendGrid, AWS SES)
  // For example:
  //
  // import nodemailer from 'nodemailer';
  //
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.example.com', // Your SMTP host
  //   port: 587, // Your SMTP port
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: process.env.EMAIL_USER, // Your email user from .env
  //     pass: process.env.EMAIL_PASS, // Your email password from .env
  //   },
  // });
  //
  // const mailOptions = {
  //   from: senderEmail, // sender address (tenis882@gmail.com)
  //   to: recipientEmail, // list of receivers (rockyalfarizi2@gmail.com)
  //   subject: "CALON SISWA/SISWI TELAH MENDAFTAR", // Subject line
  //   html: \`
  //     <h1>Data Pendaftaran Siswa Baru</h1>
  //     <p>Seorang calon siswa/siswi baru telah mendaftar dengan data sebagai berikut:</p>
  //     <p><strong>Nama Lengkap:</strong> \${formData.fullName}</p>
  //     <p><strong>Jenis Kelamin:</strong> \${formData.gender}</p>
  //     <p><strong>Tempat, Tanggal Lahir:</strong> \${formData.birthPlace}, \${new Date(formData.birthDate).toLocaleDateString('id-ID')}</p>
  //     <p><strong>Agama:</strong> \${formData.religion}</p>
  //     <p><strong>Alamat:</strong> \${formData.address}</p>
  //     <p><strong>No. HP Siswa:</strong> \${formData.studentPhoneNumber || 'Tidak diisi'}</p>
  //     <p><strong>Asal Sekolah:</strong> \${formData.previousSchool}</p>
  //     <p><strong>Ijazah Terakhir:</strong> \${formData.lastCertificate}</p>
  //     <h2>Data Orang Tua</h2>
  //     <p><strong>Nama Ayah:</strong> \${formData.fatherName}</p>
  //     <p><strong>Pekerjaan Ayah:</strong> \${formData.fatherOccupation}</p>
  //     <p><strong>No. HP Ayah:</strong> \${formData.fatherPhoneNumber}</p>
  //     <p><strong>Nama Ibu:</strong> \${formData.motherName}</p>
  //     <p><strong>Pekerjaan Ibu:</strong> \${formData.motherOccupation}</p>
  //     <p><strong>No. HP Ibu:</strong> \${formData.motherPhoneNumber}</p>
  //     <p><strong>Email Orang Tua/Wali:</strong> \${formData.parentEmail}</p>
  //   \`,
  // };
  //
  // try {
  //   await transporter.sendMail(mailOptions);
  //   return { success: true, message: 'Email sent successfully (simulated)' };
  // } catch (error) {
  //   console.error('Error sending email:', error);
  //   return { success: false, message: 'Failed to send email (simulated)' };
  // }

  // Simulate a delay for the email sending process
  await new Promise(resolve => setTimeout(resolve, 1500));

  // For now, we'll just return a success message as if the email was sent.
  return { success: true, message: 'Email sent successfully (simulated)' };
}

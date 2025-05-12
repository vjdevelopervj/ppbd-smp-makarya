
'use server';

import type { RegistrationFormData } from '@/components/registration-form';

export async function sendRegistrationEmail(
  formData: RegistrationFormData
): Promise<{ success: boolean; message?: string }> {
  const recipientEmail = 'rockyalfarizi23@gmail.com';
  // In a real app, the senderEmail would be a configured email address,
  // not necessarily the one hardcoded or coming from the user.
  // For this simulation, we'll just log it.
  const senderEmail = 'rockyalfarizi2@gmail.com'; // This is the "from" address

  console.log(`Simulating sending email to: ${recipientEmail}`);
  console.log(`From: ${senderEmail}`);
  console.log('Registration Data:', formData);

  // Simulate email sending process
  // In a real application, you would use an email sending service (e.g., Nodemailer with SMTP, SendGrid, AWS SES)
  // For example:
  //
  // import nodemailer from 'nodemailer';
  //
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.example.com',
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });
  //
  // const mailOptions = {
  //   from: senderEmail, // sender address
  //   to: recipientEmail, // list of receivers
  //   subject: `Pendaftaran Siswa Baru: ${formData.fullName}`, // Subject line
  //   html: \`
  //     <h1>Data Pendaftaran Siswa Baru</h1>
  //     <p><strong>Nama Lengkap:</strong> ${formData.fullName}</p>
  //     <p><strong>Jenis Kelamin:</strong> ${formData.gender}</p>
  //     <p><strong>Tempat, Tanggal Lahir:</strong> ${formData.birthPlace}, ${new Date(formData.birthDate).toLocaleDateString('id-ID')}</p>
  //     <p><strong>Agama:</strong> ${formData.religion}</p>
  //     <p><strong>Alamat:</strong> ${formData.address}</p>
  //     <p><strong>No. HP Siswa:</strong> ${formData.studentPhoneNumber}</p>
  //     <p><strong>Asal Sekolah:</strong> ${formData.previousSchool}</p>
  //     <p><strong>Ijazah Terakhir:</strong> ${formData.lastCertificate}</p>
  //     <h2>Data Orang Tua</h2>
  //     <p><strong>Nama Ayah:</strong> ${formData.fatherName}</p>
  //     <p><strong>Pekerjaan Ayah:</strong> ${formData.fatherOccupation}</p>
  //     <p><strong>No. HP Ayah:</strong> ${formData.fatherPhoneNumber}</p>
  //     <p><strong>Nama Ibu:</strong> ${formData.motherName}</p>
  //     <p><strong>Pekerjaan Ibu:</strong> ${formData.motherOccupation}</p>
  //     <p><strong>No. HP Ibu:</strong> ${formData.motherPhoneNumber}</p>
  //     <p><strong>Email Orang Tua/Wali:</strong> ${formData.parentEmail}</p>
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

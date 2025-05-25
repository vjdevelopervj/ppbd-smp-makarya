
'use server';

// import type { RegistrationFormData } from '@/components/registration-form'; // This type is local to registration-form
import type { StudentApplicationDataToStore } from '@/components/registration-form'; // Use the more comprehensive type

// The data received by the action now includes 'username'
export type RegistrationEmailData = Omit<StudentApplicationDataToStore, 'id' | 'formSubmittedDate' | 'quizCompleted' | 'quizScore' | 'passedQuiz' | 'birthDate'> & {
  birthDate: string; // birthDate is a string here from the form data being passed around
  username: string;
};


export async function sendRegistrationEmail(
  formData: RegistrationEmailData
): Promise<{ success: boolean; message?: string }> {
  const recipientEmail = 'rockyalfarizi2@gmail.com';
  const senderEmail = 'tenis882@gmail.com';

  console.log(`Simulating sending email to: ${recipientEmail}`);
  console.log(`From: ${senderEmail}`);
  console.log('Subject: CALON SISWA/SISWI TELAH MENDAFTAR');
  console.log('Registration Data:', {
    ...formData,
    username: formData.username, // Ensure username is logged
    studentPhoneNumber: formData.studentPhoneNumber || 'Tidak diisi',
  });

  // Simulate email sending process
  // In a real application, you would use an email sending service.
  // For example (using Nodemailer, conceptual):
  //
  // import nodemailer from 'nodemailer';
  //
  // const transporter = nodemailer.createTransport({ /* ...config... */ });
  //
  // const mailOptions = {
  //   from: senderEmail,
  //   to: recipientEmail,
  //   subject: "CALON SISWA/SISWI TELAH MENDAFTAR",
  //   html: \`
  //     <h1>Data Pendaftaran Siswa Baru</h1>
  //     <p>Seorang calon siswa/siswi baru telah mendaftar dengan data sebagai berikut:</p>
  //     <p><strong>Akun Pendaftar (Username):</strong> \${formData.username}</p>
  //     <h2>Data Siswa</h2>
  //     <p><strong>Nama Lengkap:</strong> \${formData.fullName}</p>
  //     <p><strong>NISN:</strong> \${formData.nisn}</p>
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

  await new Promise(resolve => setTimeout(resolve, 1500));

  return { success: true, message: 'Email sent successfully (simulated)' };
}

    
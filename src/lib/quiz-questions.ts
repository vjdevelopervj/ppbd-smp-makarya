
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
}

export const quizSubjects: Subject[] = [
  {
    id: 'umum',
    name: 'Pengetahuan Umum',
    questions: [
      {
        id: 'pu1',
        text: 'Ibu kota negara Indonesia saat ini adalah?',
        options: ['Jakarta', 'Bandung', 'Surabaya', 'Nusantara'],
        correctAnswer: 'Jakarta', // Technically Nusantara is planned, but Jakarta is current for most context
      },
      {
        id: 'pu2',
        text: 'Siapa presiden pertama Republik Indonesia?',
        options: ['Soeharto', 'Joko Widodo', 'Soekarno', 'B.J. Habibie'],
        correctAnswer: 'Soekarno',
      },
      {
        id: 'pu3',
        text: 'Apa warna bendera Indonesia?',
        options: ['Merah Putih', 'Putih Merah', 'Biru Putih', 'Merah Kuning'],
        correctAnswer: 'Merah Putih',
      },
    ],
  },
  {
    id: 'ipa',
    name: 'Ilmu Pengetahuan Alam (IPA)',
    questions: [
      {
        id: 'ipa1',
        text: 'Air mendidih pada suhu ... derajat Celsius (pada tekanan normal).',
        options: ['0°C', '50°C', '100°C', '200°C'],
        correctAnswer: '100°C',
      },
      {
        id: 'ipa2',
        text: 'Apa rumus kimia untuk air?',
        options: ['O2', 'H2O', 'CO2', 'NaCl'],
        correctAnswer: 'H2O',
      },
      {
        id: 'ipa3',
        text: 'Planet terdekat dengan Matahari adalah?',
        options: ['Venus', 'Mars', 'Merkurius', 'Bumi'],
        correctAnswer: 'Merkurius',
      },
    ],
  },
  {
    id: 'ips',
    name: 'Ilmu Pengetahuan Sosial (IPS)',
    questions: [
      {
        id: 'ips1',
        text: 'Benua terluas di dunia adalah?',
        options: ['Afrika', 'Amerika', 'Asia', 'Eropa'],
        correctAnswer: 'Asia',
      },
      {
        id: 'ips2',
        text: 'Proklamasi Kemerdekaan Indonesia terjadi pada tahun?',
        options: ['1942', '1945', '1950', '1955'],
        correctAnswer: '1945',
      },
      {
        id: 'ips3',
        text: 'Gunung tertinggi di Indonesia adalah?',
        options: ['Gunung Semeru', 'Gunung Rinjani', 'Puncak Jaya (Carstensz Pyramid)', 'Gunung Kerinci'],
        correctAnswer: 'Puncak Jaya (Carstensz Pyramid)',
      },
    ],
  },
  {
    id: 'matematika',
    name: 'Matematika',
    questions: [
      {
        id: 'mat1',
        text: 'Hasil dari 15 + 25 adalah?',
        options: ['30', '35', '40', '45'],
        correctAnswer: '40',
      },
      {
        id: 'mat2',
        text: 'Jika sebuah persegi memiliki sisi 5 cm, berapakah luasnya?',
        options: ['10 cm²', '15 cm²', '20 cm²', '25 cm²'],
        correctAnswer: '25 cm²',
      },
      {
        id: 'mat3',
        text: 'Berapakah hasil dari 7 x 8?',
        options: ['49', '54', '56', '63'],
        correctAnswer: '56',
      },
    ],
  },
];

export const getTotalQuestions = (): number => {
  return quizSubjects.reduce((total, subject) => total + subject.questions.length, 0);
};

export const PASSING_PERCENTAGE = 60;

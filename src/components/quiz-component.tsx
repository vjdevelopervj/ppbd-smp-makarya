'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { quizSubjects, getTotalQuestions, type Question, PASSING_PERCENTAGE } from '@/lib/quiz-questions';
import { AlertCircle, ArrowLeft, ArrowRight, Send, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Interface untuk data aplikasi siswa yang akan disimpan di localStorage
interface StudentApplication {
  id: string; // Gunakan NISN sebagai ID unik
  fullName: string;
  nisn: string;
  formSubmittedDate: string;
  quizCompleted: boolean;
  quizScore?: number;
  passedQuiz?: boolean;
}
const STUDENT_APPLICATIONS_KEY = 'smpMakaryaStudentApplications';

type AnswersState = Record<string, string>;

export default function QuizComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentName = searchParams.get('name') || 'Calon Siswa';
  const studentNisn = searchParams.get('nisn'); // Ambil NISN dari query params

  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [submittedByTimer, setSubmittedByTimer] = useState(false);

  const totalQuestions = getTotalQuestions();
  const questionsAnswered = Object.keys(answers).length;

  const currentSubject = quizSubjects[currentSubjectIndex];
  const currentQuestion: Question | undefined = currentSubject?.questions[currentQuestionIndex];

  const isLastQuestionOverall = 
    currentSubjectIndex === quizSubjects.length - 1 &&
    currentQuestionIndex === (currentSubject?.questions.length ?? 0) - 1;

  // Memoized function for submitting the quiz
  const submitQuizLogic = useCallback(() => {
    setTimerActive(false); 
    setSubmittedByTimer(true); 

    let score = 0;
    quizSubjects.forEach(subject => {
      subject.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });
    });

    // Update localStorage for student application
    if (typeof window !== 'undefined' && studentNisn) {
      const applicationsRaw = localStorage.getItem(STUDENT_APPLICATIONS_KEY);
      let applications: StudentApplication[] = applicationsRaw ? JSON.parse(applicationsRaw) : [];
      
      const applicationIndex = applications.findIndex(app => app.nisn === studentNisn);
      if (applicationIndex > -1) {
        applications[applicationIndex] = {
          ...applications[applicationIndex],
          quizCompleted: true,
          quizScore: score,
          passedQuiz: (score / totalQuestions) * 100 >= PASSING_PERCENTAGE,
        };
        localStorage.setItem(STUDENT_APPLICATIONS_KEY, JSON.stringify(applications));
      } else {
        console.warn(`Aplikasi untuk NISN ${studentNisn} tidak ditemukan di localStorage saat submit kuis.`);
         // Optionally create a new entry if not found, though ideally it should exist from registration
         const newApplicationEntry: StudentApplication = {
          id: studentNisn,
          fullName: studentName, // This might be just the name from query, ensure it's the full name
          nisn: studentNisn,
          formSubmittedDate: new Date().toISOString(), // Or fetch from existing data if possible
          quizCompleted: true,
          quizScore: score,
          passedQuiz: (score / totalQuestions) * 100 >= PASSING_PERCENTAGE,
        };
        applications.push(newApplicationEntry);
        localStorage.setItem(STUDENT_APPLICATIONS_KEY, JSON.stringify(applications));
      }
    } else if (!studentNisn) {
        console.error("NISN siswa tidak tersedia untuk memperbarui data aplikasi kuis.");
    }

    router.push(`/quiz/result?name=${encodeURIComponent(studentName)}&score=${score}&total=${totalQuestions}&nisn=${studentNisn || ''}`);
  }, [answers, studentName, studentNisn, totalQuestions, router, quizSubjects]);


  // Effect to start the timer when quiz begins
  useEffect(() => {
    if (quizStarted && !timerActive && timeRemaining > 0 && !submittedByTimer) {
      setTimerActive(true);
    }
  }, [quizStarted, timerActive, timeRemaining, submittedByTimer]);

  // Effect for the countdown logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (timerActive && timeRemaining > 0 && !submittedByTimer) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (timerActive && timeRemaining === 0 && !submittedByTimer) {
      setTimerActive(false); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, timeRemaining, submittedByTimer]);

  // Effect to handle submission when time is up
  useEffect(() => {
    if (quizStarted && timeRemaining === 0 && !submittedByTimer && timerActive) {
      console.log("Time's up! Forcing quiz submission.");
      submitQuizLogic();
    }
  }, [quizStarted, timeRemaining, submittedByTimer, timerActive, submitQuizLogic]);

   useEffect(() => {
    if (!studentNisn && quizStarted) {
      console.error("NISN siswa tidak ditemukan di halaman kuis. Ini diperlukan untuk menyimpan hasil.");
      // Optionally, redirect or show an error to the user
      // For now, quiz can proceed but data saving might fail or be incomplete.
    }
  }, [studentNisn, quizStarted]);


  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center">
        <Card className="w-full max-w-lg shadow-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Selamat Datang di Sesi Tes, {decodeURIComponent(studentName)}!</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Anda akan mengerjakan tes yang terdiri dari {quizSubjects.length} mata pelajaran dengan total {totalQuestions} soal.
              Waktu pengerjaan adalah 60 menit. Pastikan Anda menjawab semua pertanyaan dengan teliti.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Tes ini bertujuan untuk mengukur kemampuan awal Anda. Hasil tes akan menjadi salah satu pertimbangan dalam proses penerimaan.</p>
            <Button onClick={() => setQuizStarted(true)} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Mulai Tes Sekarang
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Error: Pertanyaan tidak ditemukan.</div>;
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setShowWarning(false);
  };

  const goToNextQuestion = () => {
    if (!answers[currentQuestion.id]) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSubjectIndex < quizSubjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goToPreviousQuestion = () => {
    setShowWarning(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubject = quizSubjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex(currentSubjectIndex - 1);
      setCurrentQuestionIndex(prevSubject.questions.length - 1);
    }
  };
  
  const handleSubmitQuizManually = () => {
     if (!answers[currentQuestion.id] && isLastQuestionOverall ) {
      setShowWarning(true);
      return;
    }

    if(questionsAnswered < totalQuestions && !answers[currentQuestion.id] && !isLastQuestionOverall){
       setShowWarning(true);
       return;
    }
    setShowWarning(false);
    submitQuizLogic();
  };

  const progressPercentage = (questionsAnswered / totalQuestions) * 100;
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timerDisplay = (
    <div className="text-center my-4">
      <div className="flex items-center justify-center">
        <Clock className={`mr-2 h-6 w-6 ${timeRemaining < 600 ? 'text-destructive' : 'text-primary'}`} />
        <p className={`text-xl font-semibold ${timeRemaining < 600 ? 'text-destructive' : 'text-primary'}`}>
          Sisa Waktu: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>
      {timeRemaining === 0 && !submittedByTimer && (
        <p className="text-sm text-destructive animate-pulse mt-1">Waktu Habis! Jawaban Anda sedang dikirim...</p>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Tes Potensi Akademik</CardTitle>
          <CardDescription className="text-muted-foreground">
            Siswa: {decodeURIComponent(studentName)} (NISN: {studentNisn || 'Tidak tersedia'})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {timerDisplay}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Progress Pengerjaan: {questionsAnswered}/{totalQuestions} soal
            </Label>
            <Progress value={progressPercentage} className="w-full h-3" />
          </div>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl text-accent">
                Mata Pelajaran: {currentSubject.name}
              </CardTitle>
              <CardDescription>
                Pertanyaan {currentQuestionIndex + 1} dari {currentSubject.questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-4">{currentQuestion.text}</p>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <Label
                    key={index}
                    htmlFor={`${currentQuestion.id}-option-${index}`}
                    className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                  >
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} />
                    <span>{option}</span>
                  </Label>
                ))}
              </RadioGroup>
              {showWarning && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Perhatian!</AlertTitle>
                  <AlertDescription>
                    Anda harus memilih salah satu jawaban sebelum melanjutkan.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={(currentSubjectIndex === 0 && currentQuestionIndex === 0) || submittedByTimer}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>

            {isLastQuestionOverall ? (
              <Button onClick={handleSubmitQuizManually} className="bg-green-600 hover:bg-green-700 text-white" disabled={submittedByTimer}>
                <Send className="mr-2 h-4 w-4" /> Kumpulkan Semua Jawaban
              </Button>
            ) : (
              <Button onClick={goToNextQuestion} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={submittedByTimer}>
                {currentQuestionIndex < currentSubject.questions.length - 1 ? 'Pertanyaan Berikutnya' : `Lanjut ke ${quizSubjects[currentSubjectIndex + 1]?.name || ''}`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
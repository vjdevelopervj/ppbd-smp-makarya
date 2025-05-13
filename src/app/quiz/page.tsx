
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { quizSubjects, getTotalQuestions, type Question } from '@/lib/quiz-questions';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AnswersState = Record<string, string>;

function QuizComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentName = searchParams.get('name') || 'Calon Siswa';

  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const totalQuestions = getTotalQuestions();
  const questionsAnswered = Object.keys(answers).length;

  useEffect(() => {
    // Pre-populate answers if needed for navigation, or clear them if subject/question changes and we don't want to keep old selection for a new view.
    // For now, simple state management.
  }, [currentSubjectIndex, currentQuestionIndex]);

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center">
        <Card className="w-full max-w-lg shadow-xl p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Selamat Datang di Sesi Tes, {decodeURIComponent(studentName)}!</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Anda akan mengerjakan tes yang terdiri dari {quizSubjects.length} mata pelajaran dengan total {totalQuestions} soal.
              Pastikan Anda menjawab semua pertanyaan dengan teliti.
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

  const currentSubject = quizSubjects[currentSubjectIndex];
  const currentQuestion: Question | undefined = currentSubject?.questions[currentQuestionIndex];

  if (!currentQuestion) {
    // Should not happen if logic is correct, but as a fallback
    return <div>Error: Pertanyaan tidak ditemukan.</div>;
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setShowWarning(false); // Hide warning when an option is selected
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
  
  const handleSubmitQuiz = () => {
     if (!answers[currentQuestion.id] && (currentQuestionIndex === currentSubject.questions.length -1 && currentSubjectIndex === quizSubjects.length -1) ) {
      // Check if last question is unanswered
      setShowWarning(true);
      return;
    }

    if(questionsAnswered < totalQuestions && !answers[currentQuestion.id]){
      // This case should be covered by the individual question check on "Next"
      // but as a safeguard before submission if somehow reached.
       setShowWarning(true);
       return;
    }


    setShowWarning(false);
    let score = 0;
    quizSubjects.forEach(subject => {
      subject.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });
    });
    router.push(`/quiz/result?name=${encodeURIComponent(studentName)}&score=${score}&total=${totalQuestions}`);
  };

  const isLastQuestionOverall = 
    currentSubjectIndex === quizSubjects.length - 1 &&
    currentQuestionIndex === currentSubject.questions.length - 1;

  const progressPercentage = (questionsAnswered / totalQuestions) * 100;

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Tes Potensi Akademik</CardTitle>
          <CardDescription className="text-muted-foreground">
            Siswa: {decodeURIComponent(studentName)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Progress Pengerjaan: {questionsAnswered}/{totalQuestions} soal
            </Label>
            <Progress value={progressPercentage} className="w-full" />
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
              disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>

            {isLastQuestionOverall ? (
              <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700 text-white">
                <Send className="mr-2 h-4 w-4" /> Kumpulkan Semua Jawaban
              </Button>
            ) : (
              <Button onClick={goToNextQuestion} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Memuat tes...</div>}>
      <QuizComponent />
    </Suspense>
  );
}


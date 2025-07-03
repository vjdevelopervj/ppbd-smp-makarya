import { Suspense } from 'react';
import QuizComponent from '@/components/quiz-component';

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Memuat tes...</div>}>
      <QuizComponent />
    </Suspense>
  );
}
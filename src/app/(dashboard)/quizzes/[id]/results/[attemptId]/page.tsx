import { getQuiz, getQuizAttempt } from "@/lib/actions/quizzes";
import { QuizResults } from "@/components/quizzes/quiz-results";

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = await params;
  const [{ questions }, attempt] = await Promise.all([getQuiz(id), getQuizAttempt(attemptId)]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Quiz results</h1>
      <QuizResults attempt={attempt} questions={questions} />
    </div>
  );
}
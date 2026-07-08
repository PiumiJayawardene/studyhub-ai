import { getQuiz } from "@/lib/actions/quizzes";
import { QuizTaking } from "@/components/quizzes/quiz-taking";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { quiz, questions } = await getQuiz(id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{quiz.title}</h1>
      <QuizTaking quizId={quiz.id} questions={questions} />
    </div>
  );
}
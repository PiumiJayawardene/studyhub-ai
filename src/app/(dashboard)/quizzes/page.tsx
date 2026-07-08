import { getQuizzes } from "@/lib/actions/quizzes";
import { QuizzesClient } from "@/components/quizzes/quizzes-client";

export default async function QuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        <p className="text-muted-foreground">Test your knowledge with AI-generated quizzes.</p>
      </div>
      <QuizzesClient quizzes={quizzes} />
    </div>
  );
}
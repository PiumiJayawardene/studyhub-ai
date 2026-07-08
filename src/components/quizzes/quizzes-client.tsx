"use client";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteQuiz } from "@/lib/actions/quizzes";
import { HelpCircle, Trash2, Play } from "lucide-react";

type QuizListItem = {
  id: string;
  title: string;
  quiz_questions: { count: number }[];
};

export function QuizzesClient({ quizzes }: { quizzes: QuizListItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {quizzes.length === 0 && (
  <EmptyState
    icon={HelpCircle}
    title="No quizzes yet"
    description="Open a note and generate a quiz with AI to test your understanding."
    actionLabel="Go to notes"
    actionHref="/notes"
  />
)}
      {quizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{quiz.title}</p>
                <p className="text-xs text-muted-foreground">
                  {quiz.quiz_questions[0]?.count ?? 0} questions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href={`/quizzes/${quiz.id}`}>
  <Button size="sm">
    <Play className="h-4 w-4" />
    Start
  </Button>
</Link>
              <AlertDialog>
  <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
    <Trash2 className="h-4 w-4" />
  </AlertDialogTrigger>

  <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete &quot;{quiz.title}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteQuiz(quiz.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
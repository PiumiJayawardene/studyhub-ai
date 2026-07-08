import { getSubjects } from "@/lib/actions/subjects";
import { SubjectsClient } from "@/components/subjects/subjects-client";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Subjects
          </h1>

          <p className="text-muted-foreground">
            Organize your notes, flashcards,
            and quizzes by subject.
          </p>
        </div>
      </div>

      <SubjectsClient
        initialSubjects={subjects}
      />
    </div>
  );
}
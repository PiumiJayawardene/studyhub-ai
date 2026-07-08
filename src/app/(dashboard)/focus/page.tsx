import { getSubjects } from "@/lib/actions/subjects";
import { FocusClient } from "@/components/focus/focus-client";

export default async function FocusPage() {
  const subjects = await getSubjects();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Focus Timer</h1>
        <p className="text-muted-foreground">Stay focused with the Pomodoro technique.</p>
      </div>
      <FocusClient subjects={subjects} />
    </div>
  );
}
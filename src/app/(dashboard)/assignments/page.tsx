import { getAssignments } from "@/lib/actions/assignments";
import { getSubjects } from "@/lib/actions/subjects";
import { AssignmentsClient } from "@/components/assignments/assignments-client";

export default async function AssignmentsPage() {
  const [assignments, subjects] = await Promise.all([getAssignments(), getSubjects()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <p className="text-muted-foreground">Track your deadlines and deliverables.</p>
      </div>
      <AssignmentsClient assignments={assignments} subjects={subjects} />
    </div>
  );
}
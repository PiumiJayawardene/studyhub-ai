import { getNotes } from "@/lib/actions/notes";
import { NotesListClient } from "@/components/notes/notes-list-client";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Notes</h1>
        <p className="text-muted-foreground">
          All your study notes in one place.
        </p>
      </div>

      <NotesListClient notes={notes} />
    </div>
  );
}
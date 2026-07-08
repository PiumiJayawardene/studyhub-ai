import { getNote } from "@/lib/actions/notes";
import { getSubjects } from "@/lib/actions/subjects";
import { NoteEditorClient } from "@/components/notes/note-editor-client";

export default async function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [note, subjects] = await Promise.all([getNote(id), getSubjects()]);

  return <NoteEditorClient note={note} subjects={subjects} />;
}
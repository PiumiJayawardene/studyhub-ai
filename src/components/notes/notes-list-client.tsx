"use client";
import { EmptyState } from "@/components/shared/empty-state";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { createNote, deleteNote } from "@/lib/actions/notes";
import { FileText, Plus, Trash2 } from "lucide-react";

type NoteListItem = {
  id: string;
  title: string;
  subject_id: string | null;
  updated_at: string;
  plain_text: string;
};

export function NotesListClient({ notes }: { notes: NoteListItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    startTransition(async () => {
      const id = await createNote(null);
      router.push(`/notes/${id}`);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteNote(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleCreate} disabled={isPending} className="w-fit">
        <Plus className="h-4 w-4" />
        New note
      </Button>

      {notes.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Create your first note to start building your knowledge base."
          actionLabel="New note"
          onAction={handleCreate}
        />
      )}

      {notes.map((note) => (
        <Card key={note.id} className="cursor-pointer hover:bg-muted/50">
          <CardContent className="flex items-center justify-between p-4">
            <button
              onClick={() => router.push(`/notes/${note.id}`)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{note.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {note.plain_text.slice(0, 80) || "Empty note"}
                </span>
              </div>
            </button>
           <AlertDialog>
  <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
    <Trash2 className="h-4 w-4" />
  </AlertDialogTrigger>

  <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete &quot;{note.title}&quot;?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(note.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
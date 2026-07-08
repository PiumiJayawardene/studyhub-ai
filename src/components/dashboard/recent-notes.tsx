import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

type Note = {
  id: string;
  title: string;
  updated_at: string;
};

function formatRelative(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RecentNotes({ notes }: { notes: Note[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-display">Recently Opened</CardTitle>
        <Link href="/notes" className="text-xs text-muted-foreground hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No notes yet.</p>
        )}
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{note.title}</p>
              <p className="text-xs text-muted-foreground">{formatRelative(note.updated_at)}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
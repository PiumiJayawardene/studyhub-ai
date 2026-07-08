"use client";
import { reindexNote } from "@/lib/actions/rag";
import { QuickActionsMenu } from "@/components/notes/quick-actions-menu";
import { useState, useTransition, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/notes/rich-text-editor";
import { updateNote } from "@/lib/actions/notes";
import type { Note } from "@/types/note";
import type { Subject } from "@/types/subject";
import { generateFlashcardsFromNote } from "@/lib/actions/generate-flashcards";
import { generateQuizFromNote } from "@/lib/actions/generate-quiz";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
type NoteEditorClientProps = {
  note: Note;
  subjects: Subject[];
};

export function NoteEditorClient({ note, subjects }: NoteEditorClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [subjectId, setSubjectId] = useState<string | null>(note.subject_id);
  const [status, setStatus] = useState<"saved" | "saving" | "idle">("saved");
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef(note.content);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const plainTextRef = useRef(note.plain_text);
  const save = useCallback(
    (nextTitle: string, nextSubjectId: string | null, nextContent: Record<string, unknown>, plainText: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setStatus("saving");
      debounceRef.current = setTimeout(() => {
        startTransition(async () => {
         await updateNote(note.id, {
  title: nextTitle,
  subject_id: nextSubjectId,
  content: nextContent,
  plain_text: plainText,
});

if (plainText.trim().length > 0) {
  await reindexNote(note.id, plainText);
}

setStatus("saved");
        });
      }, 800);
    },
    [note.id]
  );

  function handleTitleChange(value: string) {
    setTitle(value);
    save(value, subjectId, contentRef.current, "");
  }

  function handleSubjectChange(value: string | null) {
  const nextSubjectId =
    value === null || value === "none"
      ? null
      : value;

  setSubjectId(nextSubjectId);
  save(title, nextSubjectId, contentRef.current, "");
}

  function handleContentChange(content: Record<string, unknown>, plainText: string) {
    contentRef.current = content;
    plainTextRef.current = plainText;
    save(title, subjectId, content, plainText);
  }
  function getQuickActionSource() {
  const selection = window.getSelection()?.toString().trim();

  if (selection && selection.length > 0) {
    return selection;
  }

  return plainTextRef.current;
}

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="border-none text-2xl font-semibold px-0 focus-visible:ring-0"
        />
        <span className="text-xs text-muted-foreground shrink-0 ml-4">
          {status === "saving" || isPending ? "Saving..." : "Saved"}
        </span>
      </div>

      <Select value={subjectId ?? "none"} onValueChange={handleSubjectChange}>
  <SelectTrigger className="w-fit min-w-[220px]">
    <SelectValue>
      {subjectId
        ? subjects.find((s) => s.id === subjectId)?.name
        : "No subject"}
    </SelectValue>
  </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No subject</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.id}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await generateFlashcardsFromNote(note.id);
          });
        }}
      >
        <Sparkles className="h-4 w-4" />
        Generate flashcards from this note
      </Button>

      <Button
  variant="outline"
  size="sm"
  className="w-fit"
  disabled={isPending}
  onClick={() => {
    startTransition(async () => {
      const result = await generateQuizFromNote(note.id);

      if (result.success && result.quizId) {
        router.push(`/quizzes/${result.quizId}`);
      }
    });
  }}
>
  <HelpCircle className="h-4 w-4" />
  Generate quiz from this note
</Button>
<QuickActionsMenu getSourceText={getQuickActionSource} />

      <RichTextEditor content={note.content} onChange={handleContentChange} />
    </div>
  );
}
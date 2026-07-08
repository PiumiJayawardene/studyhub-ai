"use client";

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadDocument } from "@/lib/actions/documents";
import { Upload, Loader2 } from "lucide-react";
import type { Subject } from "@/types/subject";

export function UploadDialog({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState(false);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    if (subjectId) formData.append("subject_id", subjectId);

    startTransition(async () => {
      const result = await uploadDocument(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4" />
        Upload
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Select value={subjectId ?? "none"} onValueChange={(v) => setSubjectId(v === "none" ? null : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No subject</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label
            htmlFor="document-upload"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:bg-muted/50"
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {isPending ? "Processing..." : "Click to select a DOCX or TXT file (max 10MB)"}
            </span>
            <input
              id="document-upload"
              ref={inputRef}
              type="file"
              accept=".docx,.txt"
              className="hidden"
              disabled={isPending}
              onChange={handleFileChange}
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
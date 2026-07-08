"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SubjectCard } from "@/components/subjects/subject-card";
import { SubjectForm } from "@/components/subjects/subject-form";

import {
  createSubject,
  updateSubject,
} from "@/lib/actions/subjects";

import type { Subject } from "@/types/subject";

type SubjectsClientProps = {
  initialSubjects: Subject[];
};

export function SubjectsClient({
  initialSubjects,
}: SubjectsClientProps) {
  const [open, setOpen] = useState(false);

  const [editingSubject, setEditingSubject] =
    useState<Subject | undefined>();

  function openCreate() {
    setEditingSubject(undefined);
    setOpen(true);
  }

  function openEdit(subject: Subject) {
    setEditingSubject(subject);
    setOpen(true);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
       {initialSubjects.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            description="Create your first subject to start organizing notes, flashcards, and quizzes."
            actionLabel="Add subject"
            onAction={openCreate}
          />
        )}

        {initialSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onEdit={openEdit}
          />
        ))}

        <Button
          onClick={openCreate}
          variant="outline"
          className="w-fit"
        >
          <Plus className="h-4 w-4" />
          Add subject
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubject
                ? "Edit subject"
                : "Create subject"}
            </DialogTitle>
          </DialogHeader>

          <SubjectForm
            subject={editingSubject}
            onSubmit={(values) =>
              editingSubject
                ? updateSubject(
                    editingSubject.id,
                    values
                  )
                : createSubject(values)
            }
            onSuccess={() =>
              setOpen(false)
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
"use client";

import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

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

import { subjectIcons } from "@/config/subject-options";
import { deleteSubject } from "@/lib/actions/subjects";

import type { Subject } from "@/types/subject";

type SubjectCardProps = {
  subject: Subject;
  onEdit: (subject: Subject) => void;
};

export function SubjectCard({
  subject,
  onEdit,
}: SubjectCardProps) {
  const [isPending, startTransition] = useTransition();

  const Icon =
    subjectIcons[subject.icon] ?? subjectIcons.book;

  function handleDelete() {
    startTransition(async () => {
      await deleteSubject(subject.id);
    });
  }

  return (
  <Card
    className="card-accent"
    data-active="true"
    style={{ borderLeftColor: subject.color }}
  >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${subject.color}20`,
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{
                color: subject.color,
              }}
            />
          </div>

          <span className="font-medium">
            {subject.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(subject)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <AlertDialog>
  <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
    <Trash2 className="h-4 w-4" />
  </AlertDialogTrigger>

  <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {subject.name}?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This will also remove the subject
                  link from any notes,
                  flashcards, or quizzes that
                  reference it. This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
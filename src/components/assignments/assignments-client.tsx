"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { AssignmentForm } from "@/components/assignments/assignment-form";
import {
  createAssignment,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment,
} from "@/lib/actions/assignments";
import { statusOptions, priorityColors, statusColors } from "@/config/assignment-options";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import type { Assignment } from "@/types/assignment";
import type { Subject } from "@/types/subject";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";

type AssignmentsClientProps = {
  assignments: Assignment[];
  subjects: Subject[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AssignmentsClient({ assignments, subjects }: AssignmentsClientProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | undefined>();

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(undefined); setOpen(true); }}>
          <Plus className="h-4 w-4" />
          Add assignment
        </Button>
      </div>

      <div className="flex flex-col gap-3">
       {assignments.length === 0 && (
  <EmptyState
    icon={ClipboardList}
    title="No assignments yet"
    description="Add your first assignment to start tracking deadlines."
    actionLabel="Add assignment"
    onAction={() => {
      setEditing(undefined);
      setOpen(true);
    }}
  />
)}
        {assignments.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.title}</span>
                  <Badge className={cn("text-xs", priorityColors[a.priority])}>
                    {a.priority}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Due {formatDate(a.due_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={a.status}
                  onValueChange={(status) => {
  if (status) {
    updateAssignmentStatus(a.id, status);
  }
}}
                >
                  <SelectTrigger className={cn("w-36", statusColors[a.status])}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
               <AlertDialog>
  <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
    <Trash2 className="h-4 w-4" />
  </AlertDialogTrigger>

  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete &quot;{a.title}&quot;?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteAssignment(a.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit assignment" : "Add assignment"}</DialogTitle>
          </DialogHeader>
          <AssignmentForm
            assignment={editing}
            subjects={subjects}
            onSubmit={(values) =>
              editing ? updateAssignment(editing.id, values) : createAssignment(values)
            }
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { FlashcardForm } from "@/components/flashcards/flashcard-form";
import { createFlashcard, updateFlashcard, deleteFlashcard } from "@/lib/actions/flashcards";
import { Plus, Pencil, Trash2, Play } from "lucide-react";
import type { Flashcard } from "@/types/flashcard";
import type { Subject } from "@/types/subject";

type FlashcardsClientProps = {
  cards: Flashcard[];
  subjects: Subject[];
  dueCount: number;
};

export function FlashcardsClient({ cards, subjects, dueCount }: FlashcardsClientProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Flashcard | undefined>();

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {dueCount} card{dueCount !== 1 ? "s" : ""} due for review
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setEditing(undefined); setOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add card
          </Button>
          <Link href="/flashcards/review">
  <Button>
    <Play className="h-4 w-4" />
    Start review
  </Button>
</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((card) => (
          <Card key={card.id}>
            <CardContent className="p-4 flex flex-col gap-2">
              <p className="font-medium">{card.front}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{card.back}</p>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(card); setOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
               <AlertDialog>
  <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
    <Trash2 className="h-4 w-4" />
  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this flashcard?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteFlashcard(card.id)}>
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
            <DialogTitle>{editing ? "Edit flashcard" : "Create flashcard"}</DialogTitle>
          </DialogHeader>
          <FlashcardForm
            card={editing}
            subjects={subjects}
            onSubmit={(values) => (editing ? updateFlashcard(editing.id, values) : createFlashcard(values))}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
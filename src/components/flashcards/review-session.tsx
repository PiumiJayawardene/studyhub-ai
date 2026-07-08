"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlipCard } from "@/components/flashcards/flip-card";
import { Button } from "@/components/ui/button";
import { reviewFlashcard } from "@/lib/actions/flashcards";
import { gradeLabels, type SM2Grade } from "@/lib/sm2";
import type { Flashcard } from "@/types/flashcard";

export function ReviewSession({ cards }: { cards: Flashcard[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16">
        <p className="text-lg font-medium">All caught up!</p>
        <p className="text-muted-foreground text-sm">No cards due for review right now.</p>
      </div>
    );
  }

  const current = cards[index];
  const isLast = index === cards.length - 1;

  async function handleGrade(grade: SM2Grade) {
    await reviewFlashcard(current.id, grade);
    if (isLast) {
      router.push("/flashcards");
      router.refresh();
    } else {
      setFlipped(false);
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-muted-foreground">
        Card {index + 1} of {cards.length}
      </p>
      <FlipCard
        front={current.front}
        back={current.back}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />
      {!flipped ? (
        <Button onClick={() => setFlipped(true)} variant="outline">
          Show answer
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => handleGrade(gradeLabels.Again)}>
            Again
          </Button>
          <Button variant="outline" onClick={() => handleGrade(gradeLabels.Hard)}>
            Hard
          </Button>
          <Button variant="outline" onClick={() => handleGrade(gradeLabels.Good)}>
            Good
          </Button>
          <Button variant="default" onClick={() => handleGrade(gradeLabels.Easy)}>
            Easy
          </Button>
        </div>
      )}
    </div>
  );
}
import { getFlashcards, getDueFlashcards } from "@/lib/actions/flashcards";
import { getSubjects } from "@/lib/actions/subjects";
import { FlashcardsClient } from "@/components/flashcards/flashcards-client";

export default async function FlashcardsPage() {
  const [cards, dueCards, subjects] = await Promise.all([
    getFlashcards(),
    getDueFlashcards(),
    getSubjects(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Flashcards</h1>
        <p className="text-muted-foreground">Review with spaced repetition.</p>
      </div>
      <FlashcardsClient cards={cards} subjects={subjects} dueCount={dueCards.length} />
    </div>
  );
}
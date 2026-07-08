import { getDueFlashcards } from "@/lib/actions/flashcards";
import { ReviewSession } from "@/components/flashcards/review-session";

export default async function ReviewPage() {
  const cards = await getDueFlashcards();

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h1 className="text-2xl font-semibold">Review Session</h1>
      <ReviewSession cards={cards} />
    </div>
  );
}
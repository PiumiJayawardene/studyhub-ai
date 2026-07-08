import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type FlashcardProgressData = {
  total: number;
  newCards: number;
  learning: number;
  mastered: number;
  due: number;
};

export function FlashcardProgressChart({ data }: { data: FlashcardProgressData }) {
  const pct = (n: number) => (data.total === 0 ? 0 : Math.round((n / data.total) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Flashcard Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data.total === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No flashcards yet.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>New</span>
                <span className="text-muted-foreground">{data.newCards}</span>
              </div>
              <Progress value={pct(data.newCards)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>Learning</span>
                <span className="text-muted-foreground">{data.learning}</span>
              </div>
              <Progress value={pct(data.learning)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>Mastered</span>
                <span className="text-muted-foreground">{data.mastered}</span>
              </div>
              <Progress value={pct(data.mastered)} />
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {data.due} card{data.due !== 1 ? "s" : ""} due for review right now
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
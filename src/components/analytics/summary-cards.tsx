import { Card, CardContent } from "@/components/ui/card";
import { Clock, HelpCircle, Layers } from "lucide-react";

type SummaryData = {
  weeklyStudyHours: number;
  quizzesTakenThisWeek: number;
  newFlashcards: number;
};

export function SummaryCards({ data }: { data: SummaryData }) {
  const items = [
    { label: "Study hours this week", value: data.weeklyStudyHours, icon: Clock },
    { label: "Quizzes taken this week", value: data.quizzesTakenThisWeek, icon: HelpCircle },
    { label: "New flashcards", value: data.newFlashcards, icon: Layers },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
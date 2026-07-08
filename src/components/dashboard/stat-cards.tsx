import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, ClipboardList, HelpCircle } from "lucide-react";
import Link from "next/link";

type StatCardsProps = {
  weeklyStudyHours: number;
  activeSubjects: number;
  dueAssignments: number;
  quizzesTakenThisWeek: number;
};

export function StatCards({
  weeklyStudyHours,
  activeSubjects,
  dueAssignments,
  quizzesTakenThisWeek,
}: StatCardsProps) {
  const items = [
    {
      label: "Study Hours",
      value: weeklyStudyHours,
      sublabel: "this week",
      icon: Clock,
      href: "/focus",
    },
    {
      label: "Subjects",
      value: activeSubjects,
      sublabel: "active subjects",
      icon: BookOpen,
      href: "/subjects",
    },
    {
      label: "Assignments",
      value: dueAssignments,
      sublabel: "due soon",
      icon: ClipboardList,
      href: "/assignments",
    },
    {
      label: "Quizzes",
      value: quizzesTakenThisWeek,
      sublabel: "taken this week",
      icon: HelpCircle,
      href: "/quizzes",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Link key={item.label} href={item.href}>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">
                  {item.label} · {item.sublabel}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { priorityColors } from "@/config/assignment-options";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  priority: string;
};

function formatDueDate(dateStr: string) {
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays < 0) return "Overdue";
  return `Due in ${diffDays} days`;
}

export function UpcomingAssignments({ assignments }: { assignments: Assignment[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-display">Upcoming</CardTitle>
        <Link href="/assignments" className="text-xs text-muted-foreground hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {assignments.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">Nothing due — you&apos;re all caught up.</p>
        )}
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">{formatDueDate(a.due_date)}</p>
            </div>
            <Badge className={cn("text-xs shrink-0", priorityColors[a.priority])}>
              {a.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { priorityColors, statusColors } from "@/config/assignment-options";
import { ClipboardList, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

type Assignment = {
  id: string;
  title: string;
  status: string;
  priority: string;
};

type Session = {
  id: string;
  duration_minutes: number;
  session_type: string;
};

type DayDetailSheetProps = {
  date: Date | null;
  assignments: Assignment[];
  sessions: Session[];
  onClose: () => void;
};

export function DayDetailSheet({ date, assignments, sessions, onClose }: DayDetailSheetProps) {
  const totalMinutes = sessions
    .filter((s) => s.session_type === "pomodoro")
    .reduce((sum, s) => sum + s.duration_minutes, 0);

  return (
    <Sheet open={!!date} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {date?.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
              <ClipboardList className="h-4 w-4" />
              Assignments due ({assignments.length})
            </h3>
            {assignments.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing due this day.</p>
            )}
            <div className="flex flex-col gap-2">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-2">
                  <span className="text-sm">{a.title}</span>
                  <div className="flex gap-1">
                    <Badge className={cn("text-xs", priorityColors[a.priority])}>
                      {a.priority}
                    </Badge>
                    <Badge className={cn("text-xs", statusColors[a.status])}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Timer className="h-4 w-4" />
              Study time ({totalMinutes} min)
            </h3>
            {sessions.length === 0 && (
              <p className="text-sm text-muted-foreground">No study sessions logged.</p>
            )}
            <div className="flex flex-col gap-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span className="capitalize">{s.session_type.replace("_", " ")}</span>
                  <span className="text-muted-foreground">{s.duration_minutes} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
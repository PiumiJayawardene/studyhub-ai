"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DayDetailSheet } from "@/components/calendar/day-detail-sheet";
import { getMonthGrid, toDateKey, isSameDay } from "@/lib/calendar-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  status: string;
  priority: string;
};

type Session = {
  id: string;
  completed_at: string;
  duration_minutes: number;
  session_type: string;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarGrid({
  year,
  month,
  assignments,
  sessions,
}: {
  year: number;
  month: number;
  assignments: Assignment[];
  sessions: Session[];
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const assignmentsByDay = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    assignments.forEach((a) => {
      const key = a.due_date;
      map.set(key, [...(map.get(key) ?? []), a]);
    });
    return map;
  }, [assignments]);

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, Session[]>();
    sessions.forEach((s) => {
      const key = s.completed_at.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), s]);
    });
    return map;
  }, [sessions]);

  function goToMonth(offset: number) {
    const next = new Date(year, month + offset, 1);
    router.push(`/calendar?year=${next.getFullYear()}&month=${next.getMonth()}`);
  }

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => goToMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => goToMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdayLabels.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell.date) {
            return <div key={i} className="aspect-square" />;
          }

          const key = toDateKey(cell.date);
          const dayAssignments = assignmentsByDay.get(key) ?? [];
          const daySessions = sessionsByDay.get(key) ?? [];
          const isToday = isSameDay(cell.date, today);

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(cell.date)}
              className={cn(
                "aspect-square rounded-md border p-2 text-left flex flex-col gap-1 hover:bg-muted transition-colors",
                isToday && "border-primary"
              )}
            >
              <span className={cn("text-sm", isToday && "font-semibold text-primary")}>
                {cell.date.getDate()}
              </span>
              <div className="flex flex-wrap gap-1">
                {dayAssignments.slice(0, 3).map((a) => (
                  <span
                    key={a.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      a.priority === "high" && "bg-red-500",
                      a.priority === "medium" && "bg-amber-500",
                      a.priority === "low" && "bg-blue-500"
                    )}
                  />
                ))}
                {daySessions.length > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <DayDetailSheet
        date={selectedDate}
        assignments={selectedKey ? assignmentsByDay.get(selectedKey) ?? [] : []}
        sessions={selectedKey ? sessionsByDay.get(selectedKey) ?? [] : []}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
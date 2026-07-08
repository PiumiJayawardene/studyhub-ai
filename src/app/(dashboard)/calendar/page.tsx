import { getCalendarData } from "@/lib/actions/calendar";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth();

  const { assignments, sessions } = await getCalendarData(year, month);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-muted-foreground">
          View assignment due dates and study sessions at a glance.
        </p>
      </div>
      <CalendarGrid year={year} month={month} assignments={assignments} sessions={sessions} />
    </div>
  );
}
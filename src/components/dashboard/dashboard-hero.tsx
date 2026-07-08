import { Flame } from "lucide-react";

export function DashboardHero({ fullName, streak }: { fullName: string | null; streak: number }) {
  const firstName = fullName?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold">
          {greeting}, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">Let&apos;s continue your learning journey.</p>
      </div>

      {streak > 0 && (
        <div className="card-accent flex items-center gap-3 rounded-lg border bg-card px-4 py-3" data-active="true">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
            <Flame className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold leading-none">{streak}</p>
            <p className="text-xs text-muted-foreground mt-0.5">day streak</p>
          </div>
        </div>
      )}
    </div>
  );
}
"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateStreak } from "@/lib/streak";

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) throw new Error("Not authenticated");

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    profileResult,
    weekSessionsResult,
    streakSessionsResult,
    subjectsResult,
    dueQuizzesResult,
    upcomingAssignmentsResult,
    recentNotesResult,
  ] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", claims.claims.sub).single(),
    supabase
      .from("study_sessions")
      .select("duration_minutes")
      .eq("session_type", "pomodoro")
      .gte("completed_at", startOfWeek.toISOString()),
    supabase
      .from("study_sessions")
      .select("completed_at")
      .eq("session_type", "pomodoro")
      .gte("completed_at", thirtyDaysAgo.toISOString()),
    supabase.from("subjects").select("id"),
    supabase.from("quiz_attempts").select("id").gte("completed_at", startOfWeek.toISOString()),
    supabase
      .from("assignments")
      .select("id, title, due_date, priority, status")
      .neq("status", "completed")
      .order("due_date", { ascending: true })
      .limit(4),
    supabase
      .from("notes")
      .select("id, title, subject_id, updated_at")
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  const weeklyMinutes = (weekSessionsResult.data ?? []).reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  const streak = calculateStreak((streakSessionsResult.data ?? []).map((s) => s.completed_at));

  return {
    fullName: profileResult.data?.full_name ?? null,
    weeklyStudyHours: Math.round((weeklyMinutes / 60) * 10) / 10,
    streak,
    activeSubjects: subjectsResult.data?.length ?? 0,
    quizzesTakenThisWeek: dueQuizzesResult.data?.length ?? 0,
    upcomingAssignments: upcomingAssignmentsResult.data ?? [],
    recentNotes: recentNotesResult.data ?? [],
  };
}
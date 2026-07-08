"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCalendarData(year: number, month: number) {
  const supabase = await createClient();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select("id, title, due_date, status, priority, subject_id")
    .gte("due_date", startDate.toISOString().slice(0, 10))
    .lte("due_date", endDate.toISOString().slice(0, 10));

  if (assignmentsError) throw new Error(assignmentsError.message);

  const { data: sessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("id, completed_at, duration_minutes, session_type")
    .gte("completed_at", startDate.toISOString())
    .lte("completed_at", new Date(endDate.getTime() + 86400000).toISOString());

  if (sessionsError) throw new Error(sessionsError.message);

  return { assignments: assignments ?? [], sessions: sessions ?? [] };
}
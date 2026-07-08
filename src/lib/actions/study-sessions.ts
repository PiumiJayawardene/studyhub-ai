"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logStudySession(
  durationMinutes: number,
  sessionType: "pomodoro" | "short_break" | "long_break",
  subjectId: string | null
) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { error } = await supabase.from("study_sessions").insert({
    user_id: claims.claims.sub,
    subject_id: subjectId,
    duration_minutes: durationMinutes,
    session_type: sessionType,
  });

  if (error) return { error: error.message };
  revalidatePath("/focus");
  revalidatePath("/analytics");
  return { success: true };
}

export async function getTodaysSessions() {
  const supabase = await createClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .gte("completed_at", startOfDay.toISOString())
    .order("completed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
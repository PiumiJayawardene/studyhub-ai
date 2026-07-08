"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSubjectDistribution() {
  const supabase = await createClient();

  const { data: subjects, error: subjectsError } = await supabase
    .from("subjects")
    .select("id, name, color");

  if (subjectsError) throw new Error(subjectsError.message);

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("subject_id");

  if (notesError) throw new Error(notesError.message);

  return subjects.map((subject) => ({
    name: subject.name,
    color: subject.color,
    count: notes.filter((n) => n.subject_id === subject.id).length,
  }));
}

export async function getStudyTimeTrend(days = 7) {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("study_sessions")
    .select("duration_minutes, session_type, completed_at")
    .eq("session_type", "pomodoro")
    .gte("completed_at", startDate.toISOString());

  if (error) throw new Error(error.message);

  const byDay = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }

  data.forEach((session) => {
    const key = session.completed_at.slice(0, 10);
    if (byDay.has(key)) {
      byDay.set(key, (byDay.get(key) ?? 0) + session.duration_minutes);
    }
  });

  return Array.from(byDay.entries()).map(([date, minutes]) => ({
    date: new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
    minutes,
  }));
}

export async function getQuizPerformance() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("score, total_questions, completed_at, quizzes(title)")
    .order("completed_at", { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);

  return data.map((attempt) => ({
    title: (attempt.quizzes as unknown as { title: string })?.title ?? "Quiz",
    percentage: Math.round((attempt.score / attempt.total_questions) * 100),
    date: new Date(attempt.completed_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));
}

export async function getFlashcardProgress() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("flashcards")
    .select("repetitions, due_at");

  if (error) throw new Error(error.message);

  const now = new Date();
  const newCards = data.filter((c) => c.repetitions === 0).length;
  const learning = data.filter((c) => c.repetitions > 0 && c.repetitions < 3).length;
  const mastered = data.filter((c) => c.repetitions >= 3).length;
  const due = data.filter((c) => new Date(c.due_at) <= now).length;

  return {
    total: data.length,
    newCards,
    learning,
    mastered,
    due,
  };
}

export async function getAnalyticsSummary() {
  const supabase = await createClient();
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [{ data: sessions }, { data: attempts }, { data: cards }] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("duration_minutes")
      .eq("session_type", "pomodoro")
      .gte("completed_at", startOfWeek.toISOString()),
    supabase.from("quiz_attempts").select("id").gte("completed_at", startOfWeek.toISOString()),
    supabase.from("flashcards").select("id").eq("repetitions", 0),
  ]);

  const totalMinutes = (sessions ?? []).reduce((sum, s) => sum + s.duration_minutes, 0);

  return {
    weeklyStudyHours: Math.round((totalMinutes / 60) * 10) / 10,
    quizzesTakenThisWeek: attempts?.length ?? 0,
    newFlashcards: cards?.length ?? 0,
  };
}
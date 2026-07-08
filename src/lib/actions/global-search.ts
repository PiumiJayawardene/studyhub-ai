"use server";

import { createClient } from "@/lib/supabase/server";

export type SearchResult = {
  id: string;
  title: string;
  type: "note" | "flashcard" | "quiz" | "assignment";
  href: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (query.trim().length < 2) return [];

  const supabase = await createClient();
  const term = `%${query}%`;

  const [notes, quizzes, assignments] = await Promise.all([
    supabase.from("notes").select("id, title").ilike("title", term).limit(5),
    supabase.from("quizzes").select("id, title").ilike("title", term).limit(5),
    supabase.from("assignments").select("id, title").ilike("title", term).limit(5),
  ]);

  const results: SearchResult[] = [
    ...(notes.data ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      type: "note" as const,
      href: `/notes/${n.id}`,
    })),
    ...(quizzes.data ?? []).map((q) => ({
      id: q.id,
      title: q.title,
      type: "quiz" as const,
      href: `/quizzes/${q.id}`,
    })),
    ...(assignments.data ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      type: "assignment" as const,
      href: `/assignments`,
    })),
  ];

  return results;
}
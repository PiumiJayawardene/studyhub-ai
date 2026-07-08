"use server";

import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type GeneratedCard = { front: string; back: string };

export async function generateFlashcardsFromNote(noteId: string, count = 8) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("plain_text, subject_id")
    .eq("id", noteId)
    .single();

  if (noteError || !note) return { error: "Note not found" };
  if (note.plain_text.trim().length < 50) {
    return { error: "Note doesn't have enough content to generate flashcards" };
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a study assistant that creates flashcards from notes. Generate exactly ${count} flashcards covering the key concepts. Respond ONLY with a JSON array, no preamble, no markdown fences, in this exact format: [{"front": "question or term", "back": "answer or definition"}]`,
      },
      {
        role: "user",
        content: note.plain_text.slice(0, 6000),
      },
    ],
    temperature: 0.4,
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  let cards: GeneratedCard[];
  try {
    cards = JSON.parse(cleaned);
  } catch {
    return { error: "Failed to parse generated flashcards" };
  }

  const rows = cards
    .filter((c) => c.front && c.back)
    .map((c) => ({
      user_id: claims.claims.sub,
      subject_id: note.subject_id,
      note_id: noteId,
      front: c.front,
      back: c.back,
    }));

  if (rows.length === 0) return { error: "No valid flashcards generated" };

  const { error } = await supabase.from("flashcards").insert(rows);
  if (error) return { error: error.message };

  return { success: true, count: rows.length };
}
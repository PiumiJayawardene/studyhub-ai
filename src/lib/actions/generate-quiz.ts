"use server";

import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type GeneratedQuestion = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export async function generateQuizFromNote(noteId: string, count = 10) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("plain_text, subject_id, title")
    .eq("id", noteId)
    .single();

  if (noteError || !note) return { error: "Note not found" };
  if (note.plain_text.trim().length < 50) {
    return { error: "Note doesn't have enough content to generate a quiz" };
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a study assistant that creates multiple-choice quizzes from notes. Generate exactly ${count} questions. Each question must have exactly 4 options with only one correct answer, plus a one-sentence explanation. Respond ONLY with a JSON array, no preamble, no markdown fences, in this exact format: [{"question": "...", "options": ["...", "...", "...", "..."], "correct_index": 0, "explanation": "..."}]`,
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

  let questions: GeneratedQuestion[];
  try {
    questions = JSON.parse(cleaned);
  } catch {
    return { error: "Failed to parse generated quiz" };
  }

  const valid = questions.filter(
    (q) => q.question && q.options?.length === 4 && q.correct_index >= 0 && q.correct_index <= 3
  );

  if (valid.length === 0) return { error: "No valid questions generated" };

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: claims.claims.sub,
      subject_id: note.subject_id,
      note_id: noteId,
      title: `${note.title} Quiz`,
    })
    .select("id")
    .single();

  if (quizError) return { error: quizError.message };

  const rows = valid.map((q, i) => ({
    quiz_id: quiz.id,
    question: q.question,
    options: q.options,
    correct_index: q.correct_index,
    explanation: q.explanation,
    question_order: i,
  }));

  const { error: insertError } = await supabase.from("quiz_questions").insert(rows);
  if (insertError) return { error: insertError.message };

  return { success: true, quizId: quiz.id as string, count: rows.length };
}
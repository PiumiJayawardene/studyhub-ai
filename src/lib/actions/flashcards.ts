"use server";

import { createClient } from "@/lib/supabase/server";
import { flashcardSchema } from "@/lib/validations/flashcard";
import { calculateSM2, type SM2Grade } from "@/lib/sm2";
import { revalidatePath } from "next/cache";

export async function getFlashcards(subjectId?: string) {
  const supabase = await createClient();
  let query = supabase.from("flashcards").select("*").order("created_at", { ascending: false });
  if (subjectId) query = query.eq("subject_id", subjectId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getDueFlashcards(subjectId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("flashcards")
    .select("*")
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true });
  if (subjectId) query = query.eq("subject_id", subjectId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function createFlashcard(values: unknown) {
  const parsed = flashcardSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { error } = await supabase.from("flashcards").insert({
    user_id: claims.claims.sub,
    subject_id: parsed.data.subject_id,
    front: parsed.data.front,
    back: parsed.data.back,
  });

  if (error) return { error: error.message };
  revalidatePath("/flashcards");
  return { success: true };
}

export async function updateFlashcard(id: string, values: unknown) {
  const parsed = flashcardSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("flashcards")
    .update({
      front: parsed.data.front,
      back: parsed.data.back,
      subject_id: parsed.data.subject_id,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/flashcards");
  return { success: true };
}

export async function deleteFlashcard(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("flashcards").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/flashcards");
  return { success: true };
}

export async function reviewFlashcard(id: string, grade: SM2Grade) {
  const supabase = await createClient();
  const { data: card, error: fetchError } = await supabase
    .from("flashcards")
    .select("easiness_factor, interval_days, repetitions")
    .eq("id", id)
    .single();

  if (fetchError || !card) return { error: fetchError?.message ?? "Card not found" };

  const result = calculateSM2(
    {
      easinessFactor: card.easiness_factor,
      intervalDays: card.interval_days,
      repetitions: card.repetitions,
    },
    grade
  );

  const { error } = await supabase
    .from("flashcards")
    .update({
      easiness_factor: result.easinessFactor,
      interval_days: result.intervalDays,
      repetitions: result.repetitions,
      due_at: result.dueAt.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
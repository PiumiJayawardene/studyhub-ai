"use server";

import { createClient } from "@/lib/supabase/server";
import { quizFormSchema } from "@/lib/validations/quiz";
import { revalidatePath } from "next/cache";

export async function getQuizzes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("id, title, subject_id, created_at, quiz_questions(count)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getQuiz(id: string) {
  const supabase = await createClient();
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (quizError) throw new Error(quizError.message);

  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", id)
    .order("question_order", { ascending: true });

  if (qError) throw new Error(qError.message);

  return { quiz, questions };
}

export async function createQuiz(values: unknown) {
  const parsed = quizFormSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: claims.claims.sub,
      subject_id: parsed.data.subject_id,
      title: parsed.data.title,
    })
    .select("id")
    .single();

  if (quizError) return { error: quizError.message };

  const rows = parsed.data.questions.map((q, i) => ({
    quiz_id: quiz.id,
    question: q.question,
    options: q.options,
    correct_index: q.correct_index,
    explanation: q.explanation ?? null,
    question_order: i,
  }));

  const { error: qError } = await supabase.from("quiz_questions").insert(rows);
  if (qError) return { error: qError.message };

  revalidatePath("/quizzes");
  return { success: true, quizId: quiz.id as string };
}

export async function deleteQuiz(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/quizzes");
  return { success: true };
}

export async function submitQuizAttempt(
  quizId: string,
  answers: { question_id: string; selected_index: number }[]
) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("id, correct_index")
    .eq("quiz_id", quizId);

  if (qError || !questions) return { error: qError?.message ?? "Quiz not found" };

  const score = answers.filter((a) => {
    const question = questions.find((q) => q.id === a.question_id);
    return question && question.correct_index === a.selected_index;
  }).length;

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      user_id: claims.claims.sub,
      score,
      total_questions: questions.length,
      answers,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  return { success: true, attemptId: data.id as string, score, total: questions.length };
}

export async function getQuizAttempt(attemptId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
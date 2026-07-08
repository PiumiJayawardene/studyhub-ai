"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getChatSessions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, subject_id, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createChatSession(subjectId: string | null) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: claims.claims.sub, subject_id: subjectId })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/chat");
  return data.id as string;
}

export async function renameChatSession(sessionId: string, title: string) {
  const supabase = await createClient();
  await supabase.from("chat_sessions").update({ title }).eq("id", sessionId);
  revalidatePath("/chat");
}

export async function deleteChatSession(sessionId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId);
  if (error) return { error: error.message };
  revalidatePath("/chat");
  return { success: true };
}
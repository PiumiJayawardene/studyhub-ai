"use server";

import { createClient } from "@/lib/supabase/server";
import { noteSchema } from "@/lib/validations/note";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, subject_id, updated_at, plain_text")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getNote(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from("notes")
  .select("*")
  .eq("id", id)
  .maybeSingle();

 if (error) {
  throw new Error(error.message);
}

if (!data) {
  throw new Error("Note not found");
}

return data;
}

export async function createNote(subjectId: string | null) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: claims.claims.sub,
      subject_id: subjectId,
      title: "Untitled note",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      plain_text: "",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
  return data.id as string;
}

export async function updateNote(id: string, values: unknown) {
  const parsed = noteSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({
      title: parsed.data.title,
      subject_id: parsed.data.subject_id,
      content: parsed.data.content,
      plain_text: parsed.data.plain_text,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/notes");
  return { success: true };
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/notes");
  return { success: true };
}
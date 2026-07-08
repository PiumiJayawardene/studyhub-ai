"use server";

import { createClient } from "@/lib/supabase/server";
import { assignmentSchema } from "@/lib/validations/assignment";
import { revalidatePath } from "next/cache";

export async function getAssignments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("due_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createAssignment(values: unknown) {
  const parsed = assignmentSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const { error } = await supabase.from("assignments").insert({
    user_id: claims.claims.sub,
    subject_id: parsed.data.subject_id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    due_date: parsed.data.due_date,
    status: parsed.data.status,
    priority: parsed.data.priority,
  });

  if (error) return { error: error.message };
  revalidatePath("/assignments");
  revalidatePath("/calendar");
  return { success: true };
}

export async function updateAssignment(id: string, values: unknown) {
  const parsed = assignmentSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignments")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      subject_id: parsed.data.subject_id,
      due_date: parsed.data.due_date,
      status: parsed.data.status,
      priority: parsed.data.priority,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/assignments");
  revalidatePath("/calendar");
  return { success: true };
}

export async function updateAssignmentStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("assignments").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/assignments");
  revalidatePath("/calendar");
  return { success: true };
}

export async function deleteAssignment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("assignments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/assignments");
  revalidatePath("/calendar");
  return { success: true };
}
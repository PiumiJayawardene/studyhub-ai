"use server";

import { createClient } from "@/lib/supabase/server";
import { subjectSchema } from "@/lib/validations/subject";
import { revalidatePath } from "next/cache";

export async function getSubjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createSubject(values: unknown) {
  const parsed = subjectSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { data: claims } = await supabase.auth.getClaims();

  if (!claims) {
    return {
      error: "Not authenticated",
    };
  }

  const { error } = await supabase.from("subjects").insert({
    user_id: claims.claims.sub,
    name: parsed.data.name,
    color: parsed.data.color,
    icon: parsed.data.icon,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/subjects");

  return {
    success: true,
  };
}

export async function updateSubject(id: string, values: unknown) {
  const parsed = subjectSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("subjects")
    .update({
      name: parsed.data.name,
      color: parsed.data.color,
      icon: parsed.data.icon,
    })
    .eq("id", id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/subjects");

  return {
    success: true,
  };
}

export async function deleteSubject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/subjects");

  return {
    success: true,
  };
}
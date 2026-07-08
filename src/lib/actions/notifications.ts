"use server";

import { createClient } from "@/lib/supabase/server";

export async function getNotifications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const notifications: {
    id: string;
    title: string;
    description: string;
  }[] = [];

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id,title,due_date,status")
    .eq("user_id", user.id)
    .neq("status", "Completed");

  assignments?.forEach((assignment) => {
    const due = new Date(assignment.due_date);

    if (due <= nextWeek) {
      notifications.push({
        id: assignment.id,
        title: "Assignment Due",
        description: assignment.title,
      });
    }
  });

  const { count: flashcardsDue } = await supabase
    .from("flashcards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((flashcardsDue ?? 0) > 0) {
    notifications.push({
      id: "flashcards",
      title: "Flashcards Ready",
      description: `${flashcardsDue} flashcards available for review`,
    });
  }

  const { count: documentsReady } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "ready");

  if ((documentsReady ?? 0) > 0) {
    notifications.push({
      id: "documents",
      title: "Documents Indexed",
      description: `${documentsReady} document(s) ready for AI Chat`,
    });
  }

  return notifications;
}
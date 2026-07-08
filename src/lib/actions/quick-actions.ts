"use server";

import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";
import type { QuickActionType } from "@/types/quick-action";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const actionPrompts: Record<QuickActionType, string> = {
  summarize:
    "Summarize the following text in 3-5 concise sentences, capturing the core ideas.",
  explain:
    "Explain the following text as if teaching a student encountering it for the first time. Use clear, simple language.",
  simplify:
    "Rewrite the following text in simpler terms, as if explaining to someone new to the subject.",
  key_points:
    "Extract the key points from the following text as a concise bulleted list.",
};

export async function runQuickAction(actionType: QuickActionType, sourceText: string) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  if (sourceText.trim().length < 20) {
    return { error: "Not enough text to work with. Select more content or write more in your note." };
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `${actionPrompts[actionType]} Respond with plain text only, no markdown headers, no preamble like "Here is a summary".`,
      },
      {
        role: "user",
        content: sourceText.slice(0, 6000),
      },
    ],
    temperature: 0.3,
  });

  const result = completion.choices[0]?.message?.content ?? "";
  if (!result) return { error: "No response generated" };

  return { success: true, result };
}
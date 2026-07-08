import { createClient } from "@/lib/supabase/server";
import { semanticSearch } from "@/lib/actions/search";
import { buildSystemPrompt } from "@/lib/rag/build-prompt";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const { sessionId, message, subjectId } = await request.json();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) {
    return new Response("Unauthorized", { status: 401 });
  }

  await supabase.from("chat_messages").insert({
    session_id: sessionId,
    user_id: claims.claims.sub,
    role: "user",
    content: message,
  });

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  const contextChunks = await semanticSearch(message, subjectId ?? null);
  const systemPrompt = buildSystemPrompt(contextChunks);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...(history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    stream: true,
    temperature: 0.5,
  });

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          fullResponse += delta;
          controller.enqueue(encoder.encode(delta));
        }
      }

      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        user_id: claims.claims.sub,
        role: "assistant",
        content: fullResponse,
      });

      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
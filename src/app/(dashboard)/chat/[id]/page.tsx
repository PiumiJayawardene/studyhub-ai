import { getChatMessages } from "@/lib/actions/chat";
import { createClient } from "@/lib/supabase/server";
import { ChatThread } from "@/components/chat/chat-thread";

export default async function ChatSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await getChatMessages(id);

  const supabase = await createClient();
  const { data: session } = await supabase
    .from("chat_sessions")
    .select("subject_id")
    .eq("id", id)
    .single();

  return (
    <ChatThread
      sessionId={id}
      subjectId={session?.subject_id ?? null}
      initialMessages={messages}
    />
  );
}
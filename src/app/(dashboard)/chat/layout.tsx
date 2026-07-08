import { getChatSessions } from "@/lib/actions/chat";
import { ChatSessionsList } from "@/components/chat/chat-sessions-list";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const sessions = await getChatSessions();

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] -m-6 border rounded-lg overflow-hidden">
      <ChatSessionsList sessions={sessions} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createChatSession, deleteChatSession } from "@/lib/actions/chat";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { useTransition } from "react";

type Session = {
  id: string;
  title: string;
  subject_id: string | null;
};

export function ChatSessionsList({ sessions }: { sessions: Session[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleNew() {
    startTransition(async () => {
      const id = await createChatSession(null);
      router.push(`/chat/${id}`);
    });
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(async () => {
      await deleteChatSession(id);
      if (pathname === `/chat/${id}`) router.push("/chat");
      router.refresh();
    });
  }

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2 border-r p-3">
      <Button onClick={handleNew} disabled={isPending} className="w-full">
        <Plus className="h-4 w-4" />
        New chat
      </Button>
      <div className="flex flex-col gap-1 overflow-y-auto">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => router.push(`/chat/${session.id}`)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm text-left hover:bg-muted",
              pathname === `/chat/${session.id}` && "bg-muted"
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{session.title}</span>
            </span>
            <Trash2
              className="h-3.5 w-3.5 shrink-0 opacity-60 hover:opacity-100"
              onClick={(e) => handleDelete(session.id, e)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
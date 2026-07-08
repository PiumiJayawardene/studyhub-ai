"use client";
import { QuickActionsMenu } from "@/components/notes/quick-actions-menu";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/chat/chat-message";
import { Send } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatThreadProps = {
  sessionId: string;
  subjectId: string | null;
  initialMessages: Message[];
};

export function ChatThread({ sessionId, subjectId, initialMessages }: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setInput("");
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: text, subjectId }),
    });

    if (!response.body) {
      setIsStreaming(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
      );
    }

    setIsStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

 return (
  <div className="flex h-full flex-col">
    <div className="flex justify-end px-4 pt-2">
      <QuickActionsMenu
        getSourceText={() => {
          const lastAssistant = [...messages]
            .reverse()
            .find((m) => m.role === "assistant");

          return lastAssistant?.content ?? "";
        }}
      />
    </div>

    <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center mt-8">
            Ask a question about your notes to get started.
          </p>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} role={m.role} content={m.content} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-end gap-2 border-t p-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your notes..."
          className="min-h-[44px] max-h-32 resize-none"
        />
        <Button onClick={handleSend} disabled={isStreaming || !input.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
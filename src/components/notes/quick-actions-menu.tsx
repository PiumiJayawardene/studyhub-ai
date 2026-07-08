"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { runQuickAction } from "@/lib/actions/quick-actions";
import { Sparkles, FileText, GraduationCap, Wand2, List, Loader2 } from "lucide-react";
import type { QuickActionType } from "@/types/quick-action";

const actions: { type: QuickActionType; label: string; icon: typeof FileText }[] = [
  { type: "summarize", label: "Summarize", icon: FileText },
  { type: "explain", label: "Explain", icon: GraduationCap },
  { type: "simplify", label: "Simplify", icon: Wand2 },
  { type: "key_points", label: "Key Points", icon: List },
];

export function QuickActionsMenu({ getSourceText }: { getSourceText: () => string }) {
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [activeLabel, setActiveLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAction(type: QuickActionType, label: string) {
    setOpen(false);
    const sourceText = getSourceText();
    setActiveLabel(label);
    setError(null);
    setResult("");
    setResultOpen(true);
    setLoading(true);

    const response = await runQuickAction(type, sourceText);
    if (response.error) {
      setError(response.error);
    } else if (response.result) {
      setResult(response.result);
    }
    setLoading(false);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger
  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
>
  <Sparkles className="h-4 w-4" />
  <span>Quick actions</span>
</PopoverTrigger>

  <PopoverContent className="w-48 p-1">
          {actions.map((action) => (
            <button
              key={action.type}
              onClick={() => handleAction(action.type, action.label)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeLabel}</DialogTitle>
          </DialogHeader>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <p className="text-sm whitespace-pre-wrap">{result}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
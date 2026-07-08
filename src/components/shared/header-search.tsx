"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { globalSearch, type SearchResult } from "@/lib/actions/global-search";
import { Search, FileText, HelpCircle, ClipboardList } from "lucide-react";

const typeIcons = {
  note: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
  flashcard: FileText,
};

const typeLabels = {
  note: "Note",
  quiz: "Quiz",
  assignment: "Assignment",
  flashcard: "Flashcard",
};

export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        const data = await globalSearch(query);
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-64 justify-start gap-2 text-muted-foreground font-normal"
      >
        <Search className="h-4 w-4" />
        Search anything...
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search notes, quizzes, assignments..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {query.trim().length < 2 ? "Type to search..." : "No results found."}
          </CommandEmpty>
          <CommandGroup>
            {results.map((result) => {
              const Icon = typeIcons[result.type];
              return (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelect(result.href)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{result.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {typeLabels[result.type]}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
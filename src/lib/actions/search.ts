"use server";

import { createClient } from "@/lib/supabase/server";
import { embedText } from "@/lib/rag/embeddings";

export async function semanticSearch(query: string, subjectId?: string | null) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) throw new Error("Not authenticated");

  const queryEmbedding = await embedText(query);

  const [noteResults, documentResults] = await Promise.all([
    supabase.rpc("match_note_chunks", {
      query_embedding: queryEmbedding,
      match_user_id: claims.claims.sub,
      match_count: 4,
      match_subject_id: subjectId ?? null,
    }),
    supabase.rpc("match_document_chunks", {
      query_embedding: queryEmbedding,
      match_user_id: claims.claims.sub,
      match_count: 4,
      match_subject_id: subjectId ?? null,
    }),
  ]);

  if (noteResults.error) throw new Error(noteResults.error.message);
  if (documentResults.error) throw new Error(documentResults.error.message);

  type SearchResult = {
  id: string;
  note_id?: string;
  document_id?: string;
  content: string;
  similarity: number;
};

const combined = [
  ...((noteResults.data ?? []) as SearchResult[]).map((r) => ({
    ...r,
    source: "note" as const,
  })),
  ...((documentResults.data ?? []) as SearchResult[]).map((r) => ({
    ...r,
    source: "document" as const,
  })),
];

  return combined.sort((a, b) => b.similarity - a.similarity).slice(0, 6);
}
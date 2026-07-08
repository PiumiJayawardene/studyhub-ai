"use server";

import { createClient } from "@/lib/supabase/server";
import { chunkText } from "@/lib/rag/chunk-text";
import { embedBatch } from "@/lib/rag/embeddings";

export async function reindexNote(noteId: string, plainText: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  await supabase
    .from("note_chunks")
    .delete()
    .eq("note_id", noteId);

  const chunks = chunkText(plainText);

  if (chunks.length === 0) {
    return {
      success: true,
      chunksIndexed: 0,
    };
  }

  const embeddings = await embedBatch(
    chunks.map((chunk) => chunk.content)
  );

  const rows = chunks.map((chunk, index) => ({
    note_id: noteId,
    user_id: user.id,
    chunk_index: chunk.index,
    content: chunk.content,
    embedding: embeddings[index],
  }));

  const { error } = await supabase
    .from("note_chunks")
    .insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    chunksIndexed: rows.length,
  };
}
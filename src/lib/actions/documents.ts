"use server";

import { createClient } from "@/lib/supabase/server";
import { extractTextFromFile } from "@/lib/documents/extract-text";
import { chunkText } from "@/lib/rag/chunk-text";
import { embedBatch } from "@/lib/rag/embeddings";
import { revalidatePath } from "next/cache";

const allowedTypes: Record<string, "docx" | "txt"> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function getDocuments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
   .select("id, filename, file_path, file_type, file_size_bytes, status, subject_id, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return { error: "Not authenticated" };

  const file = formData.get("file") as File;
  const subjectId = formData.get("subject_id") as string | null;

  if (!file) return { error: "No file provided" };
  if (file.size > MAX_SIZE_BYTES) return { error: "File exceeds 10MB limit" };

  const fileType = allowedTypes[file.type];
  if (!fileType) return { error: "Only PDF, DOCX, and TXT files are supported" };

  const userId = claims.claims.sub;
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, buffer, { contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: document, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      subject_id: subjectId || null,
      filename: file.name,
      file_path: filePath,
      file_type: fileType,
      file_size_bytes: file.size,
      status: "processing",
    })
    .select("id")
    .single();

  if (insertError) return { error: insertError.message };

  try {
    const extractedText = await extractTextFromFile(buffer, fileType);

    if (extractedText.trim().length < 20) {
      await supabase
        .from("documents")
        .update({ status: "failed" })
        .eq("id", document.id);
      revalidatePath("/documents");
      return { error: "Couldn't extract readable text from this file (scanned or image-only files aren't supported)" };
    }

    await supabase
      .from("documents")
      .update({ extracted_text: extractedText, status: "ready" })
      .eq("id", document.id);

    const chunks = chunkText(extractedText);
    const embeddings = await embedBatch(chunks.map((c) => c.content));

    const rows = chunks.map((chunk, i) => ({
      document_id: document.id,
      user_id: userId,
      chunk_index: chunk.index,
      content: chunk.content,
      embedding: embeddings[i],
    }));

    await supabase.from("document_chunks").insert(rows);
 } catch (err) {
  console.error("Document processing error:", err);

  await supabase
    .from("documents")
    .update({ status: "failed" })
    .eq("id", document.id);

  revalidatePath("/documents");

  return {
    error:
      err instanceof Error
        ? err.message
        : "Failed to process this document",
  };
}

  revalidatePath("/documents");
  return { success: true, documentId: document.id as string };
}

export async function deleteDocument(id: string, filePath: string) {
  const supabase = await createClient();

  await supabase.storage.from("documents").remove([filePath]);
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/documents");
  return { success: true };
}
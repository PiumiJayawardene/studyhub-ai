type ContextChunk = {
  content: string;
  similarity: number;
};

export function buildSystemPrompt(chunks: ContextChunk[]): string {
  if (chunks.length === 0) {
    return "You are StudyHub AI, a focused study assistant. The user has no relevant notes for this question yet. Answer helpfully using general knowledge, but mention that this answer isn't grounded in their notes.";
  }

  const context = chunks
    .map((chunk, i) => `[Excerpt ${i + 1}]\n${chunk.content}`)
    .join("\n\n");

  return `You are StudyHub AI, a focused study assistant that helps students understand their own notes.

Use the following excerpts from the student's notes to answer their question. Prioritize this context over general knowledge. If the excerpts don't fully answer the question, say so explicitly before adding general knowledge.

${context}

Stay focused on studying and learning. Do not answer questions unrelated to the student's academic work.`;
}
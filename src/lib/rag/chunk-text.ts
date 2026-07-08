type Chunk = {
  content: string;
  index: number;
};

export function chunkText(
  text: string,
  chunkSize = 500,
  overlap = 80
): Chunk[] {
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return [];
  }

  const words = cleaned.split(" ");

  const chunks: Chunk[] = [];

  let index = 0;
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    chunks.push({
      content: words.slice(start, end).join(" "),
      index,
    });

    index += 1;

    if (end >= words.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}
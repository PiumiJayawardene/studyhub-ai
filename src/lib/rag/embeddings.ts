const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";
const MODEL = "voyage-3-lite";

export async function embedText(text: string): Promise<number[]> {
  const response = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: text,
      output_dimension: 512,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();

  return json.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      input: texts,
      output_dimension: 512,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();

  return json.data.map((item: { embedding: number[] }) => item.embedding);
}
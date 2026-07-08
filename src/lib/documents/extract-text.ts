import mammoth from "mammoth";

export async function extractTextFromFile(
  buffer: Buffer,
  fileType: "docx" | "txt"
): Promise<string> {
  if (fileType === "txt") {
    return buffer.toString("utf-8");
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type");
}
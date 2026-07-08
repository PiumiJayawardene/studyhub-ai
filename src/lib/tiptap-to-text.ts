type TiptapNode = {
  type?: string;
  text?: string;
  content?: TiptapNode[];
};

export function tiptapToPlainText(doc: unknown): string {
  const node = doc as TiptapNode;
  if (!node) return "";

  let text = "";

  if (node.text) {
    text += node.text;
  }

  if (node.content) {
    for (const child of node.content) {
      text += tiptapToPlainText(child);
    }
    if (node.type === "paragraph" || node.type === "heading" || node.type === "listItem") {
      text += "\n";
    }
  }

  return text;
}
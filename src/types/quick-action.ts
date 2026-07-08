export type QuickActionType = "summarize" | "explain" | "simplify" | "key_points";

export type QuickActionSource = {
  type: "note" | "selection" | "chat";
  text: string;
};
export type Note = {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  content: Record<string, unknown>;
  plain_text: string;
  created_at: string;
  updated_at: string;
};
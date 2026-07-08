export type Flashcard = {
  id: string;
  user_id: string;
  subject_id: string | null;
  note_id: string | null;
  front: string;
  back: string;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  due_at: string;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};
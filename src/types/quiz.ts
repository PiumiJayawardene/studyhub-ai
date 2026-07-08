export type Quiz = {
  id: string;
  user_id: string;
  subject_id: string | null;
  note_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  question_order: number;
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  answers: { question_id: string; selected_index: number }[];
  completed_at: string;
};
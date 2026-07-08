export type SessionType = "pomodoro" | "short_break" | "long_break";

export type StudySession = {
  id: string;
  user_id: string;
  subject_id: string | null;
  duration_minutes: number;
  session_type: SessionType;
  completed_at: string;
};
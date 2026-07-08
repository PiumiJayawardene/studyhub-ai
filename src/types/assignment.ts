export type AssignmentStatus = "pending" | "in_progress" | "completed";
export type AssignmentPriority = "low" | "medium" | "high";

export type Assignment = {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  created_at: string;
  updated_at: string;
};
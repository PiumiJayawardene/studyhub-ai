import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(1000).optional(),
  subject_id: z.string().uuid().nullable(),
  due_date: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;
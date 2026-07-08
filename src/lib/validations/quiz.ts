import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string().min(1)).length(4, "Exactly 4 options required"),
  correct_index: z.number().min(0).max(3),
  explanation: z.string().optional(),
});

export const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  subject_id: z.string().uuid().nullable(),
  questions: z.array(questionSchema).min(1, "At least one question required"),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
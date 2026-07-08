import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  subject_id: z.string().uuid().nullable(),
  content: z.record(z.string(), z.unknown()),
  plain_text: z.string(),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
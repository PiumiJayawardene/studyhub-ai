import { z } from "zod";

export const flashcardSchema = z.object({
  front: z.string().min(1, "Front is required").max(500),
  back: z.string().min(1, "Back is required").max(1000),
  subject_id: z.string().uuid().nullable(),
});

export type FlashcardFormValues = z.infer<typeof flashcardSchema>;
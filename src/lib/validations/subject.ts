import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(60, "Name is too long"),

  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),

  icon: z
    .string()
    .min(1, "Icon is required"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
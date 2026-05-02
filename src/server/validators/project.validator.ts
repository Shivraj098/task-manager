import { z } from "zod";

// Reusable email schema 
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(255, "Email is too long")
  .transform((val) => val.toLowerCase().trim());

// =============================================

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(120, "Project name must be less than 120 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_.,'&()!?]+$/,
      "Project name can only contain letters, numbers, spaces, and common punctuation (-_.,'&()!?)"
    )
    .transform((val) => val.trim()),
});

// =============================================

export const addMemberSchema = z.object({
  email: emailSchema,
});


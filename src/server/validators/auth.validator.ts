import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens")
      .transform((val) => val.trim()),

    email: z
      .string()
      .email("Please enter a valid email address")
      .max(255, "Email is too long")
      .transform((val) => val.toLowerCase().trim()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  })
  .refine((data) => data.password !== data.email, {
    message: "Password cannot be the same as your email",
    path: ["password"],
  });
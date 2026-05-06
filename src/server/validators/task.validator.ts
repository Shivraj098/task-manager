import { z } from "zod";

// Reusable enums for consistency across the app
export const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);

// =============================================
export type TaskStatusType = z.infer<typeof TaskStatus>;
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Title cannot exceed 200 characters")
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),

  priority: TaskPriority.default("MEDIUM"),

  assignedToId: z
    .string()
    .min(1, "Assigned user is required")
    .optional()
    .nullable(),
});

// =============================================

export const updateTaskStatusSchema = z.object({
  status: TaskStatus,
});

// Optional: More flexible status update (if you want to allow comments or metadata)
export const updateTaskSchema = z.object({
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
});
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
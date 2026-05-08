import {
  createTask,
  getProjectTasks,
  updateTaskStatus,
} from "../services/task.service";
import { ValidationError } from "../errors/errors";
import type {
  CreateTaskInput,
  UpdateTaskStatusInput,
} from "@/server/validators/task.validator";

/**
 * Create Task
 */
export async function handleCreateTask(
  userId: string,
  projectId: string,
  body: CreateTaskInput,
) {
  if (!body.title) {
    throw new ValidationError("Title required");
  }
  const normalizedBody = {
    ...body,
    assignedToId: body.assignedToId ?? undefined,
  };

  return createTask(userId, projectId, normalizedBody);
}

/**
 * Get Project Tasks
 */
export async function handleGetTasks(userId: string, projectId: string) {
  return getProjectTasks(userId, projectId);
}

/**
 * Update Task Status
 */
export async function handleUpdateTaskStatus(
  userId: string,
  taskId: string,
  body: UpdateTaskStatusInput,
) {
  return updateTaskStatus(userId, taskId, body.status);
}

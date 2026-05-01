// src/server/controllers/task.controller.ts

import {
  createTask,
  getProjectTasks,
  updateTaskStatus,
} from "../services/task.service";
import {
  CreateTaskInput,
  UpdateTaskStatusInput,
} from "../../types/task.types";

export async function handleCreateTask(
  userId: string,
  projectId: string,
  body: CreateTaskInput
) {
  if (!body.title) throw new Error("Title required");
  return createTask(userId, projectId, body);
}

export async function handleGetTasks(
  userId: string,
  projectId: string
) {
  return getProjectTasks(userId, projectId);
}

export async function handleUpdateTaskStatus(
  userId: string,
  taskId: string,
  body: UpdateTaskStatusInput
) {
  return updateTaskStatus(userId, taskId, body);
}
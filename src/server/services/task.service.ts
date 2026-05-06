import { prisma } from "@/server/lib/prisma";
import { requireProjectMember } from "./project.service";
import type { TaskStatusType } from "@/server/validators/task.validator";
import { AppError } from "../lib/app-errors";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../lib/errors";

type CreateTaskInput = {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedToId?: string;
};

// ✅ CREATE TASK
export async function createTask(
  userId: string,
  projectId: string,
  data: CreateTaskInput,
) {
  await requireProjectMember(userId, projectId);

  if (data.assignedToId) {
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: data.assignedToId,
          projectId,
        },
      },
    });

    if (!member) {
      throw new AppError("Task not found", 404);
    }
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "PENDING",
      projectId,
      assignedToId: data.assignedToId,
    },
  });
}

// ✅ GET PROJECT TASKS
export async function getProjectTasks(userId: string, projectId: string) {
  await requireProjectMember(userId, projectId);

  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateTaskStatus(
  userId: string,
  taskId: string,
  newStatus: TaskStatusType,
) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError("Project not found", 404);
    }

    await requireProjectMember(userId, task.projectId);

    const currentStatus = task.status;

    const allowedTransitions: Record<TaskStatusType, TaskStatusType[]> = {
      PENDING: ["IN_PROGRESS"],
      IN_PROGRESS: ["DONE"],
      DONE: [],
    };

    if (
      !allowedTransitions[currentStatus as TaskStatusType].includes(newStatus)
    ) {
      throw new ValidationError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    return tx.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
      },
    });
  });
}

export async function startTask(userId: string, taskId: string) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if (task.assignedToId !== userId) {
      throw new AppError("Only assigned user can start this task", 403);
    }

    if (task.status !== "PENDING") {
      throw new AppError("Task must be in PENDING state", 400);
    }

    return tx.task.update({
      where: { id: taskId },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });
  });
}

export async function completeTask(userId: string, taskId: string) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.assignedToId !== userId) {
      throw new UnauthorizedError("Only assigned user can complete this task");
    }

    if (task.status !== "IN_PROGRESS") {
      throw new AppError("Task must be in IN_PROGRESS to complete", 400);
    }

    return tx.task.update({
      where: { id: taskId },
      data: {
        status: "DONE",
        completedAt: new Date(),
      },
    });
  });
}

import { prisma } from "@/server/lib/prisma";
import { requireProjectMember } from "./project.service";

type CreateTaskInput = {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedToId?: string;
};

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// ✅ CREATE TASK
export async function createTask(
  userId: string,
  projectId: string,
  data: CreateTaskInput
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
      throw new Error("Assigned user is not part of this project");
    }
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: "TODO",
      projectId,
      assignedToId: data.assignedToId,
    },
  });
}

// ✅ GET PROJECT TASKS
export async function getProjectTasks(
  userId: string,
  projectId: string
) {
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ UPDATE TASK STATUS
export async function updateTaskStatus(
  userId: string,
  taskId: string,
  status: TaskStatus
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await requireProjectMember(userId, task.projectId);

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
}
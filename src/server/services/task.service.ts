import { prisma } from "@/server/lib/prisma";
import { CreateTaskInput, UpdateTaskStatusInput } from "../../types/task.types";

export async function isProjectMember(userId: string, projectId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  return !!member;
}

export async function createTask(
  userId: string,
  projectId: string,
  data: CreateTaskInput
) {
  const isMember = await isProjectMember(userId, projectId);
  if (!isMember) throw new Error("Unauthorized");

  // validate assigned user is in same project
  if (data.assignedToId) {
    const assignedMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: data.assignedToId,
          projectId,
        },
      },
    });

    if (!assignedMember) {
      throw new Error("Assigned user not part of project");
    }
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority,
      status: "TODO",
      projectId,
      assignedToId: data.assignedToId,
    },
  });
}

export async function getProjectTasks(userId: string, projectId: string) {
  const isMember = await isProjectMember(userId, projectId);
  if (!isMember) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignedTo: true,
    },
  });
}

export async function updateTaskStatus(
  userId: string,
  taskId: string,
  data: UpdateTaskStatusInput
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new Error("Task not found");

  const isMember = await isProjectMember(userId, task.projectId);
  if (!isMember) throw new Error("Unauthorized");

  return prisma.task.update({
    where: { id: taskId },
    data: {
      status: data.status,
    },
  });
}
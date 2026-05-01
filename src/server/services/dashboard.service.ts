import { prisma } from "@/server/lib/prisma";

export async function getDashboardData(userId: string) {
  // get all projects user belongs to
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true },
  });

  const projectIds = memberships.map((m) => m.projectId);

  const tasks = await prisma.task.findMany({
    where: {
      projectId: { in: projectIds },
    },
  });

  const totalTasks = tasks.length;

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  const overdueTasks = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "DONE"
  ).length;

  const tasksPerUser: Record<string, number> = {};

  tasks.forEach((task) => {
    if (!task.assignedToId) return;
    tasksPerUser[task.assignedToId] =
      (tasksPerUser[task.assignedToId] || 0) + 1;
  });

  return {
    totalTasks,
    tasksByStatus,
    overdueTasks,
    tasksPerUser,
  };
}
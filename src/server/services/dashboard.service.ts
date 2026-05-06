import { prisma } from "@/server/lib/prisma";
import { Status } from "@prisma/client";

type DashboardData = {
  totalTasks: number;
  tasksByStatus: Record<Status, number>;
  overdueTasks: number;
};

export async function getDashboardData(
  userId: string
): Promise<DashboardData> {
  // ONLY tasks assigned to user
  const tasks = await prisma.task.findMany({
    where: {
      assignedToId: userId,
    },
  });

  const tasksByStatus: Record<Status, number> = {
    PENDING: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };

  let overdueTasks = 0;
  const now = new Date();

  for (const task of tasks) {
    tasksByStatus[task.status]++;

    if (
      task.dueDate &&
      task.status !== "DONE" &&
      task.dueDate < now
    ) {
      overdueTasks++;
    }
  }

  return {
    totalTasks: tasks.length,
    tasksByStatus,
    overdueTasks,
  };
}
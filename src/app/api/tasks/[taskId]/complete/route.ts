import { getAuthSession } from "@/server/auth/auth";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import { prisma } from "@/server/lib/prisma";
import {
  triggerDashboardUpdate,
  triggerProjectUpdate,
} from "@/server/realtime/realtime";
import { completeTask } from "@/server/services/task.service";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const session = await getAuthSession();

  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const { taskId } = await params;

  const task = await completeTask(session.user.id, taskId);

  const updatedTask = await prisma.task.findUnique({
    where: { id: task.id },
    select: {
      projectId: true,
      assignedToId: true,
      project: {
        select: {
          createdById: true,
        },
      },
    },
  });

  if (updatedTask) {
    await triggerProjectUpdate(updatedTask.projectId);

    if (updatedTask.assignedToId) {
      await triggerDashboardUpdate(updatedTask.assignedToId);
    }

    await triggerDashboardUpdate(updatedTask.project.createdById);
  }

  return successResponse(task);
}

import { getAuthSession } from "@/server/lib/auth";
import { withErrorHandling } from "@/server/lib/with-errors";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import { prisma } from "@/server/lib/prisma";
import { requireProjectAdmin } from "@/server/services/project.service";

type ParamsContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export const DELETE = withErrorHandling<ParamsContext>(
  async (_req, context) => {
    const session = await getAuthSession();
    if (!session) return errorResponse("Unauthorized", 401);

    if (!context?.params) {
      throw new Error("Missing parameters");
    }

    const { taskId } = await context.params;

    if (!taskId) {
      throw new Error("Task ID required");
    }
    if (!taskId) throw new Error("Task ID required");

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new Error("Task not found");

    // 🔐 ADMIN ONLY
    const project = await prisma.project.findUnique({
  where: { id: task.projectId },
  select: { createdById: true },
});

if (!project) {
  throw new Error("Project not found");
}

if (project.createdById !== session.user.id) {
  throw new Error("Admin access required");
}

    await prisma.task.delete({
      where: { id: taskId },
    });

    return successResponse({ message: "Task deleted" });
  },
);

import { getAuthSession } from "@/server/lib/auth";
import { withErrorHandling } from "@/server/lib/with-errors";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import { prisma } from "@/server/lib/prisma";
import { ValidationError,ForbiddenError,NotFoundError,UnauthorizedError } from "@/server/lib/errors";
type ParamsContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export const DELETE = withErrorHandling<ParamsContext>(
  async (_req, context) => {
    const session = await getAuthSession();
    if (!session) throw new UnauthorizedError();

    if (!context?.params) {
      throw new ValidationError("Missing parameters");
    }

    const { taskId } = await context.params;

  
    if (!taskId) throw new ValidationError("Task ID required");

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundError("Task not found");

    // 🔐 ADMIN ONLY
    const project = await prisma.project.findUnique({
  where: { id: task.projectId },
  select: { createdById: true },
});

if (!project) {
  throw new NotFoundError("Project not found");
}

if (project.createdById !== session.user.id) {
  throw new ForbiddenError("Admin access required");
}

    await prisma.task.delete({
      where: { id: taskId },
    });

    return successResponse({ message: "Task deleted" });
  },
);

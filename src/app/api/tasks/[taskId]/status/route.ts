import { getAuthSession } from "@/server/lib/auth";
import { withErrorHandling } from "@/server/lib/with-errors";
import { successResponse } from "@/server/lib/api-response";
import { updateTaskStatusSchema } from "@/server/validators/task.validator";
import { prisma } from "@/server/lib/prisma";
import { requireProjectMember } from "@/server/services/project.service";

type ParamsContext = {
  params: {
    taskId: string;
  };
};

export const PATCH = withErrorHandling<ParamsContext>(
  async (req, { params }) => {
    const session = await getAuthSession();

    const body = updateTaskStatusSchema.parse(await req.json());

    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await requireProjectMember(session.user.id, task.projectId);

    const updated = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        status: body.status,
      },
    });

    return successResponse(updated);
  }
);
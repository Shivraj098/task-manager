import { getAuthSession } from "@/server/auth/auth";
import { withErrorHandling } from "@/server/errors/with-errors";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import {
  requireProjectAdmin,
  requireProjectMember,
} from "@/server/services/project.service";
import { prisma } from "@/server/lib/prisma";

type ParamsContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export const GET = withErrorHandling<ParamsContext>(
  async (_req: Request, context) => {
    const session = await getAuthSession();

    // ✅ AUTH CHECK
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    // ✅ PARAM VALIDATION
    if (!context?.params) throw new Error("Missing params");

    const { projectId } = await context.params;

    if (!projectId) throw new Error("Invalid projectId");

    if (!projectId || typeof projectId !== "string") {
      throw new Error("Invalid projectId");
    }

    // ✅ RBAC CHECK
    await requireProjectMember(session.user.id, projectId);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return successResponse(project);
  },
);

export const DELETE = withErrorHandling<ParamsContext>(
  async (_req: Request, context) => {
    const session = await getAuthSession();
    if (!session) return errorResponse("Unauthorized", 401);

    if (!context?.params) throw new Error("Missing params");

    const { projectId } = await context.params;

    if (!projectId) throw new Error("Invalid projectId");
    if (!projectId) throw new Error("Invalid projectId");

    // 🔐 ADMIN CHECK
    await requireProjectAdmin(session.user.id, projectId);

    //  DELETE CASCADE (mtranscation to ensure all-or-nothing)

    await prisma.$transaction(async (tx) => {
      await tx.task.deleteMany({
        where: { projectId },
      });

      await tx.projectMember.deleteMany({
        where: { projectId },
      });

      await tx.project.delete({
        where: { id: projectId },
      });
    });

    return successResponse({ message: "Project deleted" });
  },
);

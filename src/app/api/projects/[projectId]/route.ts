import { getAuthSession } from "@/server/lib/auth";
import { withErrorHandling } from "@/server/lib/with-errors";
import { successResponse } from "@/server/lib/api-response";
import { requireProjectMember } from "@/server/services/project.service";
import { prisma } from "@/server/lib/prisma";

type ParamsContext = {
  params: {
    projectId: string;
  };
};

export const GET = withErrorHandling<ParamsContext>(
  async (_req, { params }) => {
    const session = await getAuthSession();

    await requireProjectMember(session.user.id, params.projectId);

    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
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
  }
);
import { getAuthSession } from "@/server/lib/auth";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import { prisma } from "@/server/lib/prisma";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Unauthorized", 401);

  const tasks = await prisma.task.findMany({
    where: {
      assignedToId: session.user.id,
    },
    include: {
      project: {
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

  return successResponse(tasks);
}
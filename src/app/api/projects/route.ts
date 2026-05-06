import { getAuthSession } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";
import { withErrorHandling } from "@/server/lib/with-errors";
import { successResponse } from "@/server/lib/api-response";
import { handleGetProjects } from "@/server/controllers/project.controller";
 
  import { UnauthorizedError, ValidationError } from "@/server/lib/errors";
export const GET = withErrorHandling(async () => {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new UnauthorizedError("Unauthorized");
  }

  const projects = await handleGetProjects(session.user.id);

  return successResponse(projects);
});

export const POST = withErrorHandling(async (req: Request) => {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new UnauthorizedError("Unauthorized");
  }

  const body = await req.json();

  if (!body.name) {
    throw new ValidationError("Project name required");
  }

  await prisma.project.create({
    data: {
      name: body.name,
      createdById: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
  });
  return successResponse(await handleGetProjects(session.user.id));
});

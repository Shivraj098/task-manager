import { getAuthSession } from "@/server/lib/auth";
import { createProjectSchema } from "@/server/validators/project.validator";
import { successResponse } from "@/server/lib/api-response";
import { withErrorHandling } from "@/server/lib/with-errors";
import { createProject } from "@/server/services/project.service";

export const POST = withErrorHandling(async (req: Request) => {
  const session = await getAuthSession();
  const body = createProjectSchema.parse(await req.json());

  const project = await createProject(session.user.id, body.name);

  return successResponse(project);
});
import { getAuthSession } from "@/server/lib/auth";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import { startTask } from "@/server/services/task.service";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Unauthorized", 401);

  const { taskId } = await params;

  const task = await startTask(session.user.id, taskId);

  return successResponse(task);
}
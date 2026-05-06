import { getAuthSession } from "@/server/lib/auth";
import { createTaskSchema } from "@/server/validators/task.validator";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import { withErrorHandling } from "@/server/lib/with-errors";
import { createTask, getProjectTasks } from "@/server/services/task.service";

type ParamsContext = {
  params: Promise<{ projectId: string }>;
};

export const POST = withErrorHandling<ParamsContext>(
  async (req: Request, context) => {
    const session = await getAuthSession();
    if (!session) return errorResponse("Unauthorized", 401);

    if (!context?.params) throw new Error("Missing params");

    const { projectId } = await context.params;

    if (!projectId) throw new Error("Invalid projectId");

    const parsed = createTaskSchema.parse(await req.json());

    const task = await createTask(session.user.id, projectId, {
      ...parsed,
      assignedToId: parsed.assignedToId ?? undefined,
    });

    return successResponse(task);
  }
);

export const GET = withErrorHandling<ParamsContext>(
  async (req: Request, context) => {
    const session = await getAuthSession();
    if (!session) return errorResponse("Unauthorized", 401);

    if (!context?.params) throw new Error("Missing params");

    const { projectId } = await context.params;

    if (!projectId) throw new Error("Invalid projectId");

    const url = new URL(req.url);
    const statusFilter = url.searchParams.get("status");

    const tasks = await getProjectTasks(session.user.id, projectId);

    let filtered = tasks;

    if (statusFilter === "active") {
      filtered = tasks.filter((t) => t.status !== "DONE");
    } else if (statusFilter === "completed") {
      filtered = tasks.filter((t) => t.status === "DONE");
    }

    return successResponse(filtered);
  }
);
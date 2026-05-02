// src/app/api/projects/[projectId]/tasks/route.ts

import { getAuthSession } from "@/server/lib/auth";
import { createTaskSchema } from "@/server/validators/task.validator";
import { successResponse } from "@/server/lib/api-response";
import { withErrorHandling } from "@/server/lib/with-errors";
import { createTask } from "@/server/services/task.service";

type ParamsContext = {
  params: {
    projectId: string;
  };
};

export const POST = withErrorHandling<ParamsContext>(
  async (req, { params }) => {
    const session = await getAuthSession();

    const parsed = createTaskSchema.parse(await req.json());

    const normalizedBody = {
      ...parsed,
      assignedToId: parsed.assignedToId ?? undefined,
    };

    const task = await createTask(
      session.user.id,
      params.projectId,
      normalizedBody
    );

    return successResponse(task);
  }
);
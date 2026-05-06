import { getAuthSession } from "@/server/lib/auth";
import { withErrorHandling } from "@/server/lib/with-errors";
import { successResponse } from "@/server/lib/api-response";
import { handleAddMember } from "@/server/controllers/project.controller";

type ParamsContext = {
  params: Promise<{ projectId: string }>;
};

export const POST = withErrorHandling<ParamsContext>(
  async (req: Request, context) => {
    const session = await getAuthSession();

    if (!session) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 }
      );
    }
if (!context || !context.params) {
      throw new Error("Missing parameters");
    }
    const params = await context.params;
    const projectId = params.projectId;

    const body = await req.json();

    const result = await handleAddMember(
      session.user.id, // 🔥 REQUIRED
      projectId,
      body
    );

    return successResponse(result);
  }
);
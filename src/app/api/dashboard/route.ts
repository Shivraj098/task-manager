import { getAuthSession } from "@/server/lib/auth";
import { getDashboardData } from "@/server/services/dashboard.service";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return errorResponse("Unauthorized", 401);

  const data = await getDashboardData(session.user.id);

  return successResponse(data);
}
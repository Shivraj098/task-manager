import { prisma } from "@/server/lib/prisma";
import { withErrorHandling } from "@/server/lib/with-errors";
import { successResponse } from "@/server/lib/api-response";
import { getAuthSession } from "@/server/lib/auth";

export const GET = withErrorHandling(async () => {
  const session = await getAuthSession();

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return successResponse(users);
});
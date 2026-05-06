import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/authOptions";

/**
 * Safe session getter
 * Returns null instead of throwing
 */
export async function getAuthSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || typeof session.user.id !== "string") {
    return null;
  }

  return session;
}


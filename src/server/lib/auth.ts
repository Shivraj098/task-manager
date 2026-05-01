import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/authOptions";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}
import { redirect } from "next/navigation";

import { getAuthSession } from "@/server/auth/auth";

export default async function HomePage() {
  const session = await getAuthSession();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  redirect("/login");
}
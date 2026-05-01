import { NextResponse } from "next/server";
import { getAuthSession } from "@/server/lib/auth";
import { handleGetDashboard } from "@/server/controllers/dashboard.controller";

export async function GET() {
  const session = await getAuthSession();

  const data = await handleGetDashboard(session.user.id);

  return NextResponse.json(data);
}
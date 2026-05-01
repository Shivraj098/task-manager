import { NextResponse } from "next/server";
import { getAuthSession } from "@/server/lib/auth";
import { handleAddMember } from "@/server/controllers/project.controller";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getAuthSession();
  const body = await req.json();

  const result = await handleAddMember(
    session.user.id,
    params.projectId,
    body
  );

  return NextResponse.json(result);
}
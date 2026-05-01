import { NextResponse } from "next/server";
import { getAuthSession } from "@/server/lib/auth";
import { handleUpdateTaskStatus } from "@/server/controllers/task.controller";

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await getAuthSession();
  const body = await req.json();

  const task = await handleUpdateTaskStatus(
    session.user.id,
    params.taskId,
    body
  );

  return NextResponse.json(task);
}
// src/app/api/projects/[projectId]/tasks/route.ts

import { NextResponse } from "next/server";
import { getAuthSession } from "@/server/lib/auth";
import {
  handleCreateTask,
  handleGetTasks,
} from "@/server/controllers/task.controller";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getAuthSession();
  const body = await req.json();

  const task = await handleCreateTask(
    session.user.id,
    params.projectId,
    body
  );

  return NextResponse.json(task);
}

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getAuthSession();

  const tasks = await handleGetTasks(
    session.user.id,
    params.projectId
  );

  return NextResponse.json(tasks);
}
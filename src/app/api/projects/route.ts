import { NextResponse } from "next/server";
import { getAuthSession } from "@/server/lib/auth";
import { handleCreateProject, handleGetProjects } from "@/server/controllers/project.controller";

export async function POST(req: Request) {
  const session = await getAuthSession();
  const body = await req.json();

  const project = await handleCreateProject(session.user.id, body);
  return NextResponse.json(project);
}

export async function GET() {
  const session = await getAuthSession();

  const projects = await handleGetProjects(session.user.id);
  return NextResponse.json(projects);
}
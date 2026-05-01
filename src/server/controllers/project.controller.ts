import {
  createProject,
  getUserProjects,
  addMember,
} from "../services/project.service";
import { CreateProjectInput, AddMemberInput } from "../../types/project.types";
import { isProjectAdmin } from "../services/project.service";
export async function handleCreateProject(
  userId: string,
  body: CreateProjectInput,
) {
  if (!body.name || body.name.trim().length === 0) {
    throw new Error("Project name required");
  }

  return createProject(userId, body.name);
}

export async function handleGetProjects(userId: string) {
  return getUserProjects(userId);
}

export async function handleAddMember(
  userId: string,
  projectId: string,
  body: AddMemberInput,
) {
  const isAdmin = await isProjectAdmin(userId, projectId);

  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  if (!body.email) {
    throw new Error("Email is required");
  }

  return addMember(projectId, body.email);
}

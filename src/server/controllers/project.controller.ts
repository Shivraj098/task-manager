import {
  createProject,
  getAdminProjects,
  addMember,
} from "../services/project.service";
import { ValidationError } from "../errors/errors";
import { CreateProjectInput, AddMemberInput } from "../../types/project.types";

/**
 * Create project
 */
export async function handleCreateProject(
  userId: string,
  body: CreateProjectInput,
) {
  const name = body.name?.trim();

  if (!name) {
    throw new ValidationError("Project name required");
  }

  return createProject(userId, name);
}

/**
 * Get all user projects
 */
export async function handleGetProjects(userId: string) {
  return getAdminProjects(userId);
}

/**
 * Add member to project (ADMIN enforced in service)
 */
export async function handleAddMember(
  userId: string,
  projectId: string,
  body: AddMemberInput,
) {
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    throw new ValidationError("Email is required");
  }

  return addMember(userId, projectId, email);
}

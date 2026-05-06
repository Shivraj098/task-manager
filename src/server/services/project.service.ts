import { prisma } from "@/server/lib/prisma";

/**
 * Create a new project and assign creator as ADMIN
 */
export async function createProject(userId: string, name: string) {
  if (!name.trim()) {
    throw new Error("Project name required");
  }

  return prisma.project.create({
    data: {
      name: name.trim(),
      createdById: userId,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
  });
}

/**
 * Get all projects for a user
 */
export async function getAdminProjects(userId: string) {
  return prisma.project.findMany({
    where: {
      createdById: userId, //  ONLY ADMIN PROJECTS
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      tasks: {
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Add a member to a project (ADMIN ONLY)
 */
export async function addMember(
  userId: string,
  projectId: string,
  email: string,
) {
  // 🔒 Only admin can add members
  await requireProjectAdmin(userId, projectId);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 🚫 Prevent duplicates
  const existing = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId,
      },
    },
  });

  if (existing) {
    throw new Error("User already a member");
  }

  return prisma.projectMember.create({
    data: {
      userId: user.id,
      projectId,
      role: "MEMBER",
    },
  });
}

/**
 * Check if user is admin
 */
export async function isProjectAdmin(
  userId: string,
  projectId: string,
): Promise<boolean> {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    select: {
      role: true,
    },
  });

  return member?.role === "ADMIN";
}

/**
 * Ensure user is part of project
 */
export async function requireProjectMember(userId: string, projectId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!member) {
    throw new Error("Not a project member");
  }

  return member;
}

/**
 * Ensure user is admin of project
 */
export async function requireProjectAdmin(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { createdById: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdById !== userId) {
    throw new Error("Admin access required");
  }

  return true;
}

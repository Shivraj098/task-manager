import { prisma } from "@/server/lib/prisma";
import { ValidationError } from "../lib/errors";
import { AppError } from "@/server/lib/app-errors";
import { emitProjectUpdated } from "../lib/event-bus";
/**
 * Create a new project and assign creator as ADMIN
 */
export async function createProject(userId: string, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new AppError("Project name required", 400);
  }

  return prisma.$transaction(async (tx) => {
    return tx.project.create({
      data: {
        name: trimmedName,
        createdById: userId,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
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
      },
    });
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
  return prisma.$transaction(async (tx) => {
    await requireProjectAdmin(userId, projectId);

    const user = await tx.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const existing = await tx.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (existing) {
      throw new AppError("User already a member", 409);
    }

  const member =
  await tx.projectMember.create({
    data: {
      userId: user.id,
      projectId,
      role: "MEMBER",
    },
  });

await emitProjectUpdated(projectId);

return member;
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
    throw new AppError("Not a project member", 403);
  }

  return member;
}

/**
 * Ensure user is admin of project
 */
export async function requireProjectAdmin(
  userId: string,
  projectId: string,
) {
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

  if (!member) {
    throw new AppError("Project not found or access denied", 404);
  }

  if (member.role !== "ADMIN") {
    throw new AppError("Admin access required", 403);
  }

  return true;
}

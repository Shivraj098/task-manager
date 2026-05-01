import { prisma } from "@/server/lib/prisma";

export async function createProject(userId: string, name: string) {
  const project = await prisma.project.create({
    data: {
      name,
      createdById: userId,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
  });

  return project;
}

export async function getUserProjects(userId: string) {
  return prisma.project.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
    },
  });
}

export async function addMember(
  projectId: string,
  email: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  return prisma.projectMember.create({
    data: {
      userId: user.id,
      projectId,
      role: "MEMBER",
    },
  });
}
export async function isProjectAdmin(userId: string, projectId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  return member?.role === "ADMIN";
}
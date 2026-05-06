import { pusherServer } from "./pusher";

export async function triggerProjectUpdate(projectId: string) {
  await pusherServer.trigger(
    `project-${projectId}`,
    "project-updated",
    {
      projectId,
      timestamp: Date.now(),
    },
  );
}

export async function triggerDashboardUpdate(_userId: string) {
  await pusherServer.trigger(
    "dashboard-global",
    "dashboard-updated",
    {
      timestamp: Date.now(),
    },
  );
}
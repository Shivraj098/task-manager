import { pusherServer } from "./pusher";
import { REALTIME_EVENTS } from "@/lib/realtime-events";

export async function emitProjectUpdated(
  projectId: string,
) {
  await pusherServer.trigger(
    `project-${projectId}`,
    REALTIME_EVENTS.PROJECT_UPDATED,
    {
      timestamp: Date.now(),
    },
  );
}

export async function emitDashboardUpdated(
  userId: string,
) {
  await pusherServer.trigger(
    `dashboard-${userId}`,
    REALTIME_EVENTS.DASHBOARD_UPDATED,
    {
      timestamp: Date.now(),
    },
  );
}

export async function emitTaskUpdated(
  userId: string,
) {
  await pusherServer.trigger(
    `tasks-${userId}`,
    REALTIME_EVENTS.TASK_UPDATED,
    {
      timestamp: Date.now(),
    },
  );
}
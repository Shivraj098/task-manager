import Pusher from "pusher";
import { env } from "@/server/lib/env";

export const pusherServer = new Pusher({
  appId: env.PUSHER_APP_ID!,
  key: env.PUSHER_KEY!,
  secret: env.PUSHER_SECRET!,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});
"use client";

import { env } from "@/server/lib/env";
import * as Pusher from "pusher-js";

export const pusherClient =
  typeof window !== "undefined"
    ? new Pusher.default(
        env.NEXT_PUBLIC_PUSHER_KEY!,
        {
          cluster:
            env
              .NEXT_PUBLIC_PUSHER_CLUSTER!,
        },
      )
    : null;
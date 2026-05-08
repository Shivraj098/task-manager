"use client";

import {clientEnv}  from "@/server/lib/client-env";
import * as Pusher from "pusher-js";

export const pusherClient =
  typeof window !== "undefined"
    ? new Pusher.default(
        clientEnv.NEXT_PUBLIC_PUSHER_KEY,
        {
          cluster:
            clientEnv
              .NEXT_PUBLIC_PUSHER_CLUSTER,
        },
      )
    : null;
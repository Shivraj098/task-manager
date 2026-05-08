import { z } from "zod";

const clientEnvSchema =
  z.object({
    NEXT_PUBLIC_PUSHER_KEY:
      z.string().min(1),

    NEXT_PUBLIC_PUSHER_CLUSTER:
      z.string().min(1),
  });

export const clientEnv =
  clientEnvSchema.parse({
    NEXT_PUBLIC_PUSHER_KEY:
      process.env
        .NEXT_PUBLIC_PUSHER_KEY,

    NEXT_PUBLIC_PUSHER_CLUSTER:
      process.env
        .NEXT_PUBLIC_PUSHER_CLUSTER,
  });
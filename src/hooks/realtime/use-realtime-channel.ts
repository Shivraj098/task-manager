"use client";

import { useEffect } from "react";
import { pusherClient } from "@/server/lib/pusher-client";

type Props = {
  channelName: string;
  eventName: string;
  callback: () => void;
};


export function useRealtimeChannel({
  channelName,
  eventName,
  callback,
}: Props) {
  useEffect(() => {
    const channel =
      pusherClient.subscribe(
        channelName,
      );

    channel.bind(
      eventName,
      callback,
    );

    return () => {
      channel.unbind(
        eventName,
        callback,
      );

      pusherClient.unsubscribe(
        channelName,
      );
    };
  }, [
    channelName,
    eventName,
    callback,
  ]);
}
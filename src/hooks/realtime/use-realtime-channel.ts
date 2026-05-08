"use client";

import { useEffect } from "react";

import { pusherClient } from "@/lib/pusher-client";

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
    if (!pusherClient) return;

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

      if (pusherClient) {
        pusherClient.unsubscribe(
          channelName,
        );
      }
    };
  }, [
    channelName,
    eventName,
    callback,
  ]);
}
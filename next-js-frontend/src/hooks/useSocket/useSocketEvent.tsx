import { getSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { useEffect } from "react";

export const useSocketEvent = (eventName: Event, callback: any) => {
  const socket = getSocket();

  useEffect(() => {
    if (socket) {
      socket.on(eventName, callback);
    }
    return () => {
      socket?.off(eventName, callback);
    };
  }, [socket]);
};

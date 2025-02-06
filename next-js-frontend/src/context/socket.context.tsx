"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { selectLoggedInUser } from "../lib/client/slices/authSlice";
import { useAppSelector } from "../lib/client/store/hooks";

const socketContext = createContext<Socket | null>(null);

type PropTypes = {
  children: React.ReactNode;
};

export const useSocket = () => useContext(socketContext);

let socket: Socket | null = null; // Singleton instance

export const SocketProvider = ({ children }: PropTypes) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const loggedInUser = useAppSelector(selectLoggedInUser);

  useEffect(() => {
    if (typeof window != "undefined") {
      if (loggedInUser && !socket) {
        socket = io(process.env.NEXT_PUBLIC_ABSOLUTE_BASE_URL, {
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
          setIsConnected(true);
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        return () => {
          socket?.disconnect();
          socket = null; // Clean up the socket instance on unmount
        };
      }
    }
  }, [loggedInUser?.email]);

  const socketValue = useMemo(() => socket, [isConnected]);

  return (
    <socketContext.Provider value={socketValue}>
      {children}
    </socketContext.Provider>
  );
};

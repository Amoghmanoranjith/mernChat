'use client';
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "../services/redux/store/hooks";
import { selectLoggedInUser } from "../services/redux/slices/authSlice";

const socketContext = createContext<Socket | null>(null);

type PropTypes = {
    children: React.ReactNode;
};

export const getSocket = () => useContext(socketContext);

let socket: Socket | null = null; // Singleton instance

export const SocketProvider = ({ children }: PropTypes) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const loggedInUser = useAppSelector(selectLoggedInUser);

    useEffect(() => {
        if (loggedInUser && !socket) {
            socket = io(process.env.ABSOLUTE_BASE_URL, {
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
    }, [loggedInUser?.email]);

    const socketValue = useMemo(() => socket, [isConnected]);

    return (
        <socketContext.Provider value={socketValue}>
            {children}
        </socketContext.Provider>
    );
};

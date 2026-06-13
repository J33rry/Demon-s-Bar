"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAuth from "./userStore";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { userId } = useAuth(); // Holds current logged in Firebase UID

    useEffect(() => {
        let active = true;
        let socketConn: Socket | null = null;

        if (userId) {
            // Establish socket connection targeting the backend server
            socketConn = io("http://localhost:3002", {
                query: { userId },
                withCredentials: true,
            });

            // Set state asynchronously to avoid synchronous cascading renders warning
            setTimeout(() => {
                if (active) {
                    setSocket(socketConn);
                }
            }, 0);

            // Listen for active users mapping from server
            socketConn.on("getOnlineUsers", (users: string[]) => {
                if (active) {
                    setOnlineUsers(users);
                }
            });
        }

        // Disconnect socket connection on unmount or userId change
        return () => {
            active = false;
            if (socketConn) {
                socketConn.disconnect();
            }
            setSocket(null);
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

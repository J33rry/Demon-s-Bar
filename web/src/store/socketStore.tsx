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
        if (userId) {
            // Establish socket connection targeting the backend server
            const socketConn = io("http://localhost:3002", {
                query: { userId },
                withCredentials: true,
            });

            setSocket(socketConn);

            // Listen for active users mapping from server
            socketConn.on("getOnlineUsers", (users: string[]) => {
                setOnlineUsers(users);
            });

            // Disconnect socket connection on unmount
            return () => {
                socketConn.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
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

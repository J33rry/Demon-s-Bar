"use client";

import { User } from "firebase/auth";
import { createContext, useContext, useState, ReactNode } from "react";

interface ContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

const userContext = createContext<ContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    
    return (
        <userContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </userContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("useAuth must be used within a UserProvider");
    }
    return context;
};

export default useAuth;
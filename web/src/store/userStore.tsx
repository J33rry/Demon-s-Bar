"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

interface ContextType {
    user: string | null;
    setUser: (user: string | null) => void;
    userId: string | null;
    setUserId: (userId: string | null) => void;
    loading: boolean;
}

const userContext = createContext<ContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getMe() {
            try {
                const res = await fetch("http://localhost:3002/api/auth/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data?.user) {
                        setUser(data.user.name);
                        setUserId(data.user.firebaseUid);
                        return;
                    }
                }
                setUser(null);
                setUserId(null);
            } catch (error) {
                console.error("Error fetching user session:", error);
                setUser(null);
                setUserId(null);
            } finally {
                setLoading(false);
            }
        }
        getMe();
    }, []);

    return (
        <userContext.Provider value={{ user, setUser, userId, setUserId, loading }}>
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

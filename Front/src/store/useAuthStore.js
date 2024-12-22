import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL =
    import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get(
                "http://localhost:5001/api/auth/check"
            );

            set({ authUser: res.data });
            get().connectSocket();
        } catch (err) {
            console.log("Error in checkAuth", err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account Created successfully");
            get().connectSocket();
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out Successfully");
            get().disconnectSocket();
        } catch (err) {
            toast.error(err.response.data.message);
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in Successfully");
            get().connectSocket();
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updatedProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
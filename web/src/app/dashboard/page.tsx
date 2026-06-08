"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import useAuth from "@/store/userStore";

function page() {
    const router = useRouter();
    const { token } = useAuth();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3002/api/auth/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            // Sign out from Firebase
            await signOut(auth);

            router.replace("/login");
        } catch (error) {
            console.error(error);
        }
    };
    interface Chat {
        id: string;
        senderId: string;
        receiverId: string;
    }
    const [chats, setChats] = useState<Chat[]>([]);
    
    const getChats = async () => {
        try {
            const res = await fetch("http://localhost:3002/api/chats/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            setChats(data.chats || []);
        } catch (error) {
            console.error(error);
        }
    };

    const createChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const receiverId = formData.get("receiverId") as string;
        try {
            const res = await fetch("http://localhost:3002/api/chats/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    receiverId,
                }),
            });
            const data = await res.json();
            console.log(data);
            if (data.chat) {
                setChats((prev) => (prev ? [...prev, data.chat] : [data.chat]));
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        if (token) {
            getChats();
        }
    }, [token]);

    return (
        <div className="bg-green-600 h-screen w-screen">
            <button onClick={handleLogout} className="p-2">
                Logout
            </button>
            <div>
                {chats.length == 0 ? (
                    <div>No chats</div>
                ) : (
                    chats.map((chat) => (
                        <div key={chat.id}>
                            <div>{chat.senderId}</div>
                            <div>{chat.receiverId}</div>
                        </div>
                    ))
                )}
            </div>
            <div>
                <form onSubmit={createChat}>
                    <input type="text" placeholder="Receiver ID" />
                    <button type="submit">Create Chat</button>
                </form>
            </div>
        </div>
    );
}

export default page;

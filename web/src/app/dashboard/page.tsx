"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import useAuth from "@/store/userStore";
import { useSocket } from "@/store/socketStore";
import Header from "@/components/dashboard/Header";
import PatronRegistry from "@/components/dashboard/PatronRegistry";
import Ledger from "@/components/dashboard/Ledger";
import MessageArea from "@/components/dashboard/MessageArea";
import { compressImage } from "@/utils/image";

interface Chat {
    id: string;
    senderId: string;
    receiverId: string;
    status: "pending" | "accepted";
    createdAt?: string;
}

interface Message {
    id: string;
    senderId: string;
    chatId: string;
    text: string;
    image: string;
    replyToId?: string | null;
}

export default function Page() {
    const router = useRouter();
    const { userId, loading, setUser, setUserId } = useAuth();
    const { socket, onlineUsers } = useSocket();
    const [chats, setChats] = useState<Chat[]>([]);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessage] = useState<Message[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    // States for message replies and image sending
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [newMessageText, setNewMessageText] = useState<string>("");

    // Redirect to login if user session check is done and no user exists
    useEffect(() => {
        if (!loading && !userId) {
            router.replace("/login");
        }
    }, [userId, loading, router]);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3002/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            await signOut(auth);
            setUser(null);
            setUserId(null);
            router.replace("/login");
        } catch (error) {
            console.error(error);
        }
    };

    const getChats = async () => {
        try {
            setError(null);
            const res = await fetch("http://localhost:3002/api/chats/", {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            setChats(data.chats || []);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch active ledger entries.");
        }
    };

    const createChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const receiverId = (formData.get("receiverId") as string)?.trim();

        if (!receiverId) {
            setError("Patron UID cannot be blank.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3002/api/chats/create", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ receiverId }),
            });
            const data = await res.json();
            if (data.chat) {
                setChats((prev) => {
                    if (!prev) return [data.chat];
                    if (prev.some((c) => c.id === data.chat.id)) {
                        return prev;
                    }
                    return [...prev, data.chat];
                });
                form.reset();
            } else {
                setError(data.message || "Failed to create connection.");
            }
        } catch (error) {
            console.error(error);
            setError("Network error while establishing connection.");
        }
    };

    const handleDelete = async (chatId: string) => {
        try {
            setError(null);
            const chat = chats.find((c) => c.id === chatId);
            if (!chat) return;

            const otherUserId =
                chat.senderId === userId ? chat.receiverId : chat.senderId;

            const res = await fetch(
                `http://localhost:3002/api/chats/delete/${otherUserId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );

            if (res.ok) {
                setChats((prev) => {
                    if (!prev) return [];
                    return prev.filter((c) => c.id !== chatId);
                });
                if (selectedChatId === chatId) {
                    setSelectedChatId(null);
                }
            } else {
                console.error("Failed to delete chat: status", res.status);
                setError("Failed to sever connection link.");
            }
        } catch (err) {
            console.log(err);
            setError("Error occurred during connection deletion.");
        }
    };

    // Load ledger on mount
    useEffect(() => {
        const fetchChats = async () => {
            try {
                setError(null);
                const res = await fetch("http://localhost:3002/api/chats/", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                setChats(data.chats || []);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch active ledger entries.");
            }
        };
        if (userId) {
            fetchChats();
        }
    }, [userId]);

    const handleCopyMark = () => {
        if (userId) {
            navigator.clipboard.writeText(userId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessageText.trim() && !selectedImage) || !selectedChatId) return;

        try {
            console.log("sending msg");
            let base64Image = "";
            if (selectedImage) {
                base64Image = await compressImage(selectedImage, 0.7, 1200);
            }

            const res = await fetch(
                "http://localhost:3002/api/messages/send-message",
                {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({
                        text: newMessageText,
                        senderId: userId,
                        chatId: selectedChatId,
                        receiverId: activeRecipientUid, // Pass recipient UID
                        image: base64Image,
                        replyToId: replyingTo?.id || null,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = await res.json();
            if (data.message) {
                setMessage((prev) => [...prev, data.message]);
                setNewMessageText("");
                setReplyingTo(null);
                setSelectedImage(null);
                setImagePreview(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAccept = async (chatId: string) => {
        try {
            setError(null);
            const res = await fetch(`http://localhost:3002/api/chats/accept/${chatId}`, {
                method: "PUT",
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok && data.chat) {
                setChats((prev) =>
                    prev.map((c) => (c.id === chatId ? data.chat : c))
                );
            } else {
                setError(data.message || "Failed to accept connection request.");
            }
        } catch (error) {
            console.error(error);
            setError("Network error while accepting connection.");
        }
    };

    const handleSelectChat = async (chatId: string) => {
        setSelectedChatId(chatId);
        const chat = chats.find((c) => c.id === chatId);
        if (chat?.status !== "accepted") {
            setMessage([]);
            return;
        }
        try {
            const res = await fetch(
                `http://localhost:3002/api/messages/${chatId}`,
                {
                    credentials: "include",
                },
            );
            const data = await res.json();
            setMessage(data.messages || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const activeChat = chats.find((c) => c.id === selectedChatId);
    const activeRecipientUid = activeChat
        ? activeChat.senderId === userId
            ? activeChat.receiverId
            : activeChat.senderId
        : null;

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: Message) => {
            // Only append to screen state if it belongs to the active active chat
            if (newMessage.chatId === selectedChatId) {
                setMessage((prev) => [...prev, newMessage]);
            }
        };

        const handleChatCreated = (newChat: Chat) => {
            setChats((prev) => {
                if (prev.some((c) => c.id === newChat.id)) return prev;
                return [...prev, newChat];
            });
        };

        const handleChatUpdated = (updatedChat: Chat) => {
            setChats((prev) =>
                prev.map((c) => (c.id === updatedChat.id ? updatedChat : c))
            );
        };

        const handleChatDeleted = ({ otherUserId }: { otherUserId: string }) => {
            setChats((prev) => {
                const chatToDelete = prev.find(
                    (c) =>
                        (c.senderId === userId && c.receiverId === otherUserId) ||
                        (c.senderId === otherUserId && c.receiverId === userId)
                );
                if (!chatToDelete) return prev;
                if (selectedChatId === chatToDelete.id) {
                    setSelectedChatId(null);
                }
                return prev.filter((c) => c.id !== chatToDelete.id);
            });
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("chatCreated", handleChatCreated);
        socket.on("chatUpdated", handleChatUpdated);
        socket.on("chatDeleted", handleChatDeleted);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("chatCreated", handleChatCreated);
            socket.off("chatUpdated", handleChatUpdated);
            socket.off("chatDeleted", handleChatDeleted);
        };
    }, [socket, selectedChatId, userId]);

    if (loading) {
        return (
            <div className="relative min-h-screen bg-abyss flex flex-col items-center justify-center font-body text-parchment">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-ember/3 blur-[120px] animate-ember-float" />
                    <div
                        className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-ember/5 blur-[100px] animate-ember-float"
                        style={{ animationDelay: "-3s" }}
                    />
                </div>
                <div className="relative z-10 text-center space-y-4">
                    <svg
                        className="w-16 h-20 mx-auto drop-shadow-[0_0_8px_#C84B31] animate-candle-breathe"
                        viewBox="0 0 100 120"
                        fill="none"
                    >
                        <path
                            d="M50 15C50 15 35 45 35 60C35 72.5 41.7 80 50 80C58.3 80 65 72.5 65 60C65 45 50 15 50 15Z"
                            className="animate-flicker fill-ember origin-bottom"
                        />
                        <rect
                            x="44"
                            y="80"
                            width="12"
                            height="25"
                            rx="1"
                            fill="#eee5da"
                            opacity="0.8"
                        />
                    </svg>
                    <h2 className="font-display text-lg tracking-widest text-parchment text-glow uppercase animate-pulse">
                        Entering the Bar...
                    </h2>
                    <p className="text-[10px] font-mono tracking-widest text-ash uppercase">
                        Establishing connection
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-abyss flex flex-col font-body text-parchment">
            {/* Background Embers */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-ember/3 blur-[120px] animate-ember-float" />
                <div
                    className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-ember/5 blur-[100px] animate-ember-float"
                    style={{ animationDelay: "-3s" }}
                />
            </div>

            <Header
                userId={userId}
                copied={copied}
                onCopyMark={handleCopyMark}
                onLogout={handleLogout}
            />

            {/* Main Content Workspace */}
            <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl w-full mx-auto">
                {/* Left Panel: The Ledger */}
                <section className="w-full lg:w-105 flex flex-col gap-6">
                    <PatronRegistry onCreateChat={createChat} error={error} />
                    <Ledger
                        chats={chats}
                        selectedChatId={selectedChatId}
                        userId={userId}
                        onlineUsers={onlineUsers}
                        onSelectChat={handleSelectChat}
                        onDeleteChat={handleDelete}
                        onAcceptChat={handleAccept}
                        onSyncChats={getChats}
                    />
                </section>

                {/* Right Panel: The Counter Workspace */}
                <MessageArea
                    selectedChatId={selectedChatId}
                    messages={messages}
                    userId={userId}
                    activeRecipientUid={activeRecipientUid}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    newMessageText={newMessageText}
                    setNewMessageText={setNewMessageText}
                    onSendMessage={handleSendMessage}
                />
            </main>
        </div>
    );
}

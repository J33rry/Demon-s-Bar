"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import useAuth from "@/store/userStore";
import { useSocket } from "@/store/socketStore";

export default function Page() {
    const router = useRouter();
    const { userId } = useAuth();
    const { socket, onlineUsers } = useSocket();
    const [chats, setChats] = useState<Chat[]>([]);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessage] = useState<Message[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    interface Chat {
        id: string;
        senderId: string;
        receiverId: string;
        createdAt?: string;
    }
    interface Message {
        id: string;
        senderId: string;
        chatId: string;
        text: string;
        image: string;
    }

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:3002/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            await signOut(auth);
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
    const [newMessageText, setNewMessageText] = useState<string>("");

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageText.trim() || !selectedChatId) return;

        try {
            console.log("sending msg");
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
            }
        } catch (err) {
            console.log(err);
        }
    };
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeChat = chats.find((c) => c.id === selectedChatId);
    const activeRecipientUid = activeChat
        ? activeChat.senderId === userId
            ? activeChat.receiverId
            : activeChat.senderId
        : null;

    const handleSelectChat = async (chatId: string) => {
        setSelectedChatId(chatId);
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            // Only append to screen state if it belongs to the active active chat
            if (newMessage.chatId === selectedChatId) {
                setMessage((prev) => [...prev, newMessage]);
            }
        });
        return () => {
            socket.off("newMessage");
        };
    }, [socket, selectedChatId]);

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

            {/* Header */}
            <header className="relative z-10 w-full bg-soot/80 backdrop-blur-md border-b border-ash/10 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <svg
                        className="w-8 h-10 drop-shadow-[0_0_3px_#C84B31] animate-candle-breathe"
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
                    <div>
                        <h1 className="font-display text-xl tracking-widest text-parchment text-glow uppercase">
                            Demon&apos;s Bar
                        </h1>
                        <p className="text-[9px] font-mono tracking-widest text-ash uppercase">
                            The Counter
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {userId && (
                        <div className="hidden md:flex items-center gap-2 bg-abyss/60 border border-ash/10 px-3 py-1.5 rounded-lg text-xs font-mono">
                            <span className="text-ash uppercase">Mark:</span>
                            <span
                                className="text-parchment max-w-30 truncate"
                                title={userId}
                            >
                                {userId}
                            </span>
                            <button
                                onClick={handleCopyMark}
                                className="text-ash hover:text-ember transition-colors p-1"
                                title="Copy Mark"
                            >
                                {copied ? (
                                    <svg
                                        className="w-3.5 h-3.5 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-soot hover:bg-ember border border-ash/10 hover:border-ember hover:text-white rounded-lg font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
                    >
                        Leave the Bar
                    </button>
                </div>
            </header>

            {/* Main Content Workspace */}
            <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl w-full mx-auto">
                {/* Left Panel: The Ledger */}
                <section className="w-full lg:w-105 flex flex-col gap-6">
                    {/* Add Connection Panel */}
                    <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
                        <h2 className="font-display text-sm tracking-widest text-parchment uppercase border-b border-ash/10 pb-3 mb-4">
                            Patron Registry
                        </h2>
                        <form onSubmit={createChat} className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-mono uppercase tracking-widest text-ash mb-2">
                                    Establish Link (Input Patron UID)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="receiverId"
                                        placeholder="Enter UID..."
                                        className="flex-1 min-w-0 px-4 py-2.5 bg-abyss/85 border border-ash/10 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl text-parchment font-mono text-sm placeholder-ash/20 outline-none transition-all duration-300"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 bg-ember hover:bg-ember/90 text-white font-mono text-xs tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-md shrink-0"
                                    >
                                        Link
                                    </button>
                                </div>
                            </div>
                        </form>
                        {error && (
                            <div className="mt-3 p-2.5 bg-ember/10 border border-ember/20 rounded-lg">
                                <p className="text-xs font-mono text-ember text-center">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Active Connections Panel */}
                    <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-100">
                        <div className="flex items-center justify-between border-b border-ash/10 pb-3 mb-4">
                            <h2 className="font-display text-sm tracking-widest text-parchment uppercase">
                                The Ledger
                            </h2>
                            <button
                                onClick={getChats}
                                className="text-xs font-mono text-ash hover:text-ember uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.22"
                                    />
                                </svg>
                                Sync
                            </button>
                        </div>

                        {/* Connection list */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {chats.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-40">
                                    <svg
                                        className="w-10 h-10 mb-3 text-ash"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    <p className="text-xs font-mono uppercase tracking-wider text-ash">
                                        No active threads
                                    </p>
                                    <p className="text-[10px] text-ash/80 mt-1 max-w-50">
                                        Establish a new link in the Patron
                                        Registry above.
                                    </p>
                                </div>
                            ) : (
                                chats.map((chat) => {
                                    const otherUser =
                                        chat.senderId === userId
                                            ? chat.receiverId
                                            : chat.senderId;
                                    const isOnline =
                                        onlineUsers.includes(otherUser);
                                    return (
                                        <div
                                            key={chat.id}
                                            onClick={() =>
                                                handleSelectChat(chat.id)
                                            }
                                            className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${
                                                selectedChatId === chat.id
                                                    ? "bg-ember/15 border-ember/45 ring-1 ring-ember/30"
                                                    : "bg-soot/40 hover:bg-soot/90 border border-ash/5"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-ember/10 flex items-center justify-center border border-ember/20 text-ember font-mono font-medium text-sm shrink-0">
                                                    ✦
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span
                                                        className="text-xs font-mono text-parchment truncate w-40 md:w-55 lg:w-37.5"
                                                        title={otherUser}
                                                    >
                                                        {otherUser}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-ash uppercase tracking-wide mt-0.5 flex items-center gap-1.5">
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-ember"}`}
                                                        />
                                                        {isOnline
                                                            ? `Connected`
                                                            : `Not connected`}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleDelete(chat.id)
                                                }
                                                className="p-2 text-ash hover:text-ember bg-abyss/40 border border-ash/10 hover:border-ember/30 rounded-lg transition-all duration-300 cursor-pointer shadow-sm"
                                                title="Sever Connection"
                                            >
                                                <svg
                                                    className="w-3.5 h-3.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Panel: The Counter Workspace */}
                <section className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden min-h-125">
                    {selectedChatId ? (
                        <div className="flex flex-1 flex-col h-full">
                            {/* Thread Header */}
                            <div className="p-4 border-b border-ash/10 bg-soot/30 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-ember animate-candle-breathe" />
                                <span className="text-xs font-mono truncate">
                                    {activeRecipientUid}
                                </span>
                            </div>

                            {/* Scrollable messages container */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === userId;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-xs px-4 py-2.5 rounded-2xl font-mono text-xs ${
                                                    isMe
                                                        ? "bg-ember text-white rounded-br-none"
                                                        : "bg-soot border border-ash/10 text-parchment rounded-bl-none"
                                                }`}
                                            >
                                                <p>{msg.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input bar */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-4 bg-soot/35 border-t border-ash/10 flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={newMessageText}
                                    onChange={(e) =>
                                        setNewMessageText(e.target.value)
                                    }
                                    placeholder="Whisper message..."
                                    className="flex-1 px-4 py-2.5 bg-abyss/90 border border-ash/10 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl text-xs font-mono outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 bg-ember hover:bg-ember/90 text-white font-mono text-xs uppercase rounded-xl transition-colors"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>No Chat Seleted</div>
                    )}
                </section>
            </main>
        </div>
    );
}

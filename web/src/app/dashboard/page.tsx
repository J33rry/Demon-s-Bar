"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import useAuth from "@/store/userStore";

export default function Page() {
    const router = useRouter();
    const { userId } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    interface Chat {
        id: string;
        senderId: string;
        receiverId: string;
        createdAt?: string;
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

            const otherUserId = chat.senderId === userId ? chat.receiverId : chat.senderId;

            const res = await fetch(`http://localhost:3002/api/chats/delete/${otherUserId}`, {
                method: "DELETE",
                credentials: "include",
            });

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

    return (
        <div className="relative min-h-screen bg-abyss flex flex-col font-body text-parchment">
            {/* Background Embers */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-ember/3 blur-[120px] animate-ember-float" />
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-ember/5 blur-[100px] animate-ember-float" style={{ animationDelay: "-3s" }} />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full bg-soot/80 backdrop-blur-md border-b border-ash/10 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-10 drop-shadow-[0_0_3px_#C84B31] animate-candle-breathe" viewBox="0 0 100 120" fill="none">
                        <path d="M50 15C50 15 35 45 35 60C35 72.5 41.7 80 50 80C58.3 80 65 72.5 65 60C65 45 50 15 50 15Z" className="animate-flicker fill-ember origin-bottom" />
                        <rect x="44" y="80" width="12" height="25" rx="1" fill="#eee5da" opacity="0.8" />
                    </svg>
                    <div>
                        <h1 className="font-display text-xl tracking-widest text-parchment text-glow uppercase">
                            Demon&apos;s Bar
                        </h1>
                        <p className="text-[9px] font-mono tracking-widest text-ash uppercase">The Counter</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {userId && (
                        <div className="hidden md:flex items-center gap-2 bg-abyss/60 border border-ash/10 px-3 py-1.5 rounded-lg text-xs font-mono">
                            <span className="text-ash uppercase">Mark:</span>
                            <span className="text-parchment max-w-[120px] truncate" title={userId}>{userId}</span>
                            <button 
                                onClick={handleCopyMark}
                                className="text-ash hover:text-ember transition-colors p-1"
                                title="Copy Mark"
                            >
                                {copied ? (
                                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
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
                <section className="w-full lg:w-[420px] flex flex-col gap-6">
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
                                <p className="text-xs font-mono text-ember text-center">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Active Connections Panel */}
                    <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-[400px]">
                        <div className="flex items-center justify-between border-b border-ash/10 pb-3 mb-4">
                            <h2 className="font-display text-sm tracking-widest text-parchment uppercase">
                                The Ledger
                            </h2>
                            <button
                                onClick={getChats}
                                className="text-xs font-mono text-ash hover:text-ember uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.22" />
                                </svg>
                                Sync
                            </button>
                        </div>

                        {/* Connection list */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {chats.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-40">
                                    <svg className="w-10 h-10 mb-3 text-ash" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-xs font-mono uppercase tracking-wider text-ash">No active threads</p>
                                    <p className="text-[10px] text-ash/80 mt-1 max-w-[200px]">Establish a new link in the Patron Registry above.</p>
                                </div>
                            ) : (
                                chats.map((chat) => {
                                    const otherUser = chat.senderId === userId ? chat.receiverId : chat.senderId;
                                    return (
                                        <div 
                                            key={chat.id}
                                            className="group flex items-center justify-between p-3.5 bg-soot/40 hover:bg-soot/90 border border-ash/5 hover:border-ember/20 rounded-xl transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-ember/10 flex items-center justify-center border border-ember/20 text-ember font-mono font-medium text-sm shrink-0">
                                                    ✦
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-mono text-parchment truncate w-[160px] md:w-[220px] lg:w-[150px]" title={otherUser}>
                                                        {otherUser}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-ash uppercase tracking-wide mt-0.5 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-ember animate-candle-breathe" />
                                                        Connected
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(chat.id)}
                                                className="p-2 text-ash hover:text-ember bg-abyss/40 border border-ash/10 hover:border-ember/30 rounded-lg transition-all duration-300 cursor-pointer shadow-sm"
                                                title="Sever Connection"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                <section className="flex-1 flex flex-col">
                    <div className="glass-panel rounded-2xl p-6 md:p-8 flex-1 flex flex-col justify-center items-center text-center">
                        <div className="max-w-md space-y-6">
                            {/* Decorative bar scene/candle */}
                            <div className="relative inline-flex items-center justify-center">
                                {/* Aura glow */}
                                <div className="absolute w-28 h-28 bg-ember/5 rounded-full blur-[30px] animate-candle-breathe" />
                                <svg className="w-20 h-28 drop-shadow-[0_0_10px_#C84B31] relative z-10" viewBox="0 0 100 120" fill="none">
                                    <path d="M50 15C50 15 30 40 30 58C30 70.5 39 78 50 78C61 78 70 70.5 70 58C70 40 50 15 50 15Z" 
                                          className="animate-candle-breathe animate-flicker fill-ember origin-bottom" />
                                    <line x1="50" y1="71" x2="50" y2="85" stroke="#8a8a93" strokeWidth="2" />
                                    <rect x="40" y="85" width="20" height="35" rx="2" fill="#eee5da" opacity="0.8" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-display text-2xl tracking-widest text-parchment uppercase">
                                    The Counter
                                </h3>
                                <p className="text-ash text-xs font-mono tracking-widest uppercase mt-2">
                                    Patron Desk State: Open
                                </p>
                            </div>

                            <div className="bg-abyss/40 border border-ash/10 p-5 rounded-2xl text-left space-y-4 max-w-sm mx-auto">
                                <h4 className="font-mono text-xs uppercase tracking-widest text-ember font-semibold">
                                    Bar Etiquette
                                </h4>
                                <ul className="space-y-3 font-mono text-[10px] text-ash">
                                    <li className="flex gap-2">
                                        <span className="text-ember shrink-0">✦</span>
                                        <span>Share your unique <strong>Mark (UID)</strong> with others to allow them to locate you.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-ember shrink-0">✦</span>
                                        <span>Input a patron&apos;s Mark in the registry on the left to establish a direct linked thread.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-ember shrink-0">✦</span>
                                        <span>Active threads populate dynamically. You can sever links at any time in the Ledger.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

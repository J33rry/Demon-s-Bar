"use client";

import LedgerSkeleton from "@/components/skeletons/LedgerSkeleton";

interface Chat {
    id: string;
    senderId: string;
    receiverId: string;
    status: "pending" | "accepted";
    createdAt?: string;
}

interface LedgerProps {
    chats: Chat[];
    selectedChatId: string | null;
    userId: string | null;
    onlineUsers: string[];
    onSelectChat: (chatId: string) => void;
    onDeleteChat: (chatId: string) => void;
    onAcceptChat: (chatId: string) => void;
    onSyncChats: () => void;
    loading: boolean;
}

export default function Ledger({
    chats,
    selectedChatId,
    userId,
    onlineUsers,
    onSelectChat,
    onDeleteChat,
    onAcceptChat,
    onSyncChats,
    loading,
}: LedgerProps) {
    const incomingRequests = chats.filter(
        (c) => c.status === "pending" && c.receiverId === userId
    );
    const outgoingRequests = chats.filter(
        (c) => c.status === "pending" && c.senderId === userId
    );
    const activeChats = chats.filter((c) => c.status === "accepted");

    return (
        <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col min-h-100">
            <div className="flex items-center justify-between border-b border-ash/10 pb-3 mb-4">
                <h2 className="font-display text-sm tracking-widest text-parchment uppercase">
                    The Ledger
                </h2>
                <button
                    onClick={onSyncChats}
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
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {loading ? (
                    <LedgerSkeleton />
                ) : chats.length === 0 ? (
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
                            Establish a new link in the Patron Registry above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 1. Incoming Invites */}
                        {incomingRequests.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-mono uppercase tracking-widest text-ember font-semibold px-1">
                                    Patron Invites
                                </h3>
                                {incomingRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex items-center justify-between p-3.5 bg-soot/60 border border-ember/20 rounded-xl animate-fade-in"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-mono text-parchment truncate w-36 md:w-48 lg:w-36" title={req.senderId}>
                                                {req.senderId}
                                            </span>
                                            <span className="text-[9px] font-mono text-ash uppercase tracking-wide mt-0.5">
                                                Wants to link
                                            </span>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => onAcceptChat(req.id)}
                                                className="px-2.5 py-1.5 bg-green-700 hover:bg-green-600 text-white font-mono text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => onDeleteChat(req.id)}
                                                className="px-2.5 py-1.5 bg-soot hover:bg-soot/80 border border-ash/10 text-ash font-mono text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. Outgoing Requests */}
                        {outgoingRequests.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-mono uppercase tracking-widest text-ash/60 px-1">
                                    Awaiting Patrons
                                </h3>
                                {outgoingRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex items-center justify-between p-3.5 bg-soot/25 border border-ash/5 rounded-xl opacity-80 animate-fade-in"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-mono text-ash truncate w-40 md:w-52 lg:w-36" title={req.receiverId}>
                                                {req.receiverId}
                                            </span>
                                            <span className="text-[9px] font-mono text-ash/40 uppercase tracking-wide mt-0.5">
                                                Pending reply...
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => onDeleteChat(req.id)}
                                            className="px-2.5 py-1.5 bg-soot hover:bg-soot/80 border border-ash/10 text-ash/60 hover:text-ash font-mono text-[10px] uppercase rounded-lg transition-colors cursor-pointer shrink-0"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3. Active Connections */}
                        <div className="space-y-2">
                            {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
                                <h3 className="text-[10px] font-mono uppercase tracking-widest text-ash/60 px-1">
                                    Active Connections
                                </h3>
                            )}
                            {activeChats.length === 0 ? (
                                (incomingRequests.length > 0 || outgoingRequests.length > 0) && (
                                    <p className="text-[10px] font-mono text-ash/40 px-1 py-2">
                                        No active connections established yet.
                                    </p>
                                )
                            ) : (
                                activeChats.map((chat) => {
                                    const otherUser =
                                        chat.senderId === userId
                                            ? chat.receiverId
                                            : chat.senderId;
                                    const isOnline =
                                        onlineUsers.includes(otherUser);
                                    return (
                                        <div
                                            key={chat.id}
                                            onClick={() => onSelectChat(chat.id)}
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
                                                        {isOnline ? "Connected" : "Not connected"}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteChat(chat.id);
                                                }}
                                                className="p-2 text-ash hover:text-ember bg-abyss/40 border border-ash/10 hover:border-ember/30 rounded-lg transition-all duration-300 cursor-pointer shadow-sm shrink-0"
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
                )}
            </div>
        </div>
    );
}

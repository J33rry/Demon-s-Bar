"use client";

import React, { useEffect, useRef } from "react";

interface Message {
    id: string;
    senderId: string;
    chatId: string;
    text: string;
    image: string;
    replyToId?: string | null;
}

interface MessageAreaProps {
    selectedChatId: string | null;
    messages: Message[];
    userId: string | null;
    activeRecipientUid: string | null;
    replyingTo: Message | null;
    setReplyingTo: (msg: Message | null) => void;
    selectedImage: File | null;
    setSelectedImage: (file: File | null) => void;
    imagePreview: string | null;
    setImagePreview: (preview: string | null) => void;
    newMessageText: string;
    setNewMessageText: (text: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
}

export default function MessageArea({
    selectedChatId,
    messages,
    userId,
    activeRecipientUid,
    replyingTo,
    setReplyingTo,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImagePreview,
    newMessageText,
    setNewMessageText,
    onSendMessage,
}: MessageAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
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
                            const repliedMsg = msg.replyToId
                                ? messages.find((m) => m.id === msg.replyToId)
                                : null;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"} group relative mb-1`}
                                >
                                    <div className={`flex items-center gap-2 max-w-[75%] ${isMe ? "flex-row" : "flex-row-reverse"}`}>
                                        <button
                                            onClick={() => setReplyingTo(msg)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-ash hover:text-ember cursor-pointer text-[10px] shrink-0"
                                            title="Reply"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                        </button>
                                        
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl font-mono text-xs flex flex-col ${
                                                isMe
                                                    ? "bg-ember text-white rounded-br-none"
                                                    : "bg-soot border border-ash/10 text-parchment rounded-bl-none"
                                            }`}
                                        >
                                            {repliedMsg && (
                                                <div className="mb-1.5 p-2 rounded bg-black/15 border-l-2 border-ash/30 text-[10px] text-ash/85 truncate max-w-full">
                                                    <span className="font-semibold text-ember">
                                                        {repliedMsg.senderId === userId ? "You" : "Patron"}
                                                    </span>: {repliedMsg.text || "[Image]"}
                                                </div>
                                            )}
                                            {msg.image && (
                                                <img
                                                    src={msg.image}
                                                    alt="Chat attachment"
                                                    className="max-w-full rounded-lg mb-1.5 border border-ash/5 object-cover max-h-48"
                                                />
                                            )}
                                            {msg.text && <p className="break-all whitespace-pre-wrap">{msg.text}</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Reply preview bar */}
                    {replyingTo && (
                        <div className="flex items-center justify-between px-4 py-2 bg-soot/50 border-t border-ash/10 text-[10px] font-mono text-ash animate-fade-in shrink-0">
                            <div className="truncate">
                                Replying to <span className="text-ember font-semibold">{replyingTo.senderId === userId ? "You" : "Patron"}</span>: {replyingTo.text || "[Image]"}
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="text-ash hover:text-ember cursor-pointer font-bold text-xs px-1"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Image upload preview */}
                    {imagePreview && (
                        <div className="relative p-3 bg-soot/40 border-t border-ash/10 flex items-center gap-3 shrink-0 animate-fade-in">
                            <div className="relative">
                                <img src={imagePreview} className="w-16 h-16 rounded-lg object-cover border border-ash/10" alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute -top-1.5 -right-1.5 bg-ember hover:bg-ember/90 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                            <span className="text-[10px] font-mono text-ash">{selectedImage?.name}</span>
                        </div>
                    )}

                    {/* Message input bar */}
                    <form
                        onSubmit={onSendMessage}
                        className="p-4 bg-soot/35 border-t border-ash/10 flex gap-2 items-center"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedImage(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }}
                            accept="image/*"
                            className="hidden"
                        />
                        
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 text-ash hover:text-ember bg-abyss/60 border border-ash/10 hover:border-ember/35 rounded-xl transition-all duration-300 cursor-pointer shrink-0"
                            title="Attach Image"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            placeholder="Whisper message..."
                            className="flex-1 px-4 py-2.5 bg-abyss/90 border border-ash/10 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl text-xs font-mono outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-ember hover:bg-ember/90 text-white font-mono text-xs uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-30">
                    <svg
                        className="w-12 h-16 mb-4 text-ash drop-shadow-[0_0_3px_#C84B31] animate-candle-breathe"
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
                    <p className="text-sm font-display uppercase tracking-widest text-parchment">
                        Select a Chat
                    </p>
                    <p className="text-xs font-mono text-ash/80 mt-1 max-w-60">
                        Choose an active connection from the ledger to begin whispering.
                    </p>
                </div>
            )}
        </section>
    );
}

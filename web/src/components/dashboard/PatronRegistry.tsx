"use client";

import React from "react";

interface PatronRegistryProps {
    onCreateChat: (e: React.FormEvent<HTMLFormElement>) => void;
    error: string | null;
}

export default function PatronRegistry({ onCreateChat, error }: PatronRegistryProps) {
    return (
        <div className="glass-panel rounded-2xl p-6 transition-all duration-300">
            <h2 className="font-display text-sm tracking-widest text-parchment uppercase border-b border-ash/10 pb-3 mb-4">
                Patron Registry
            </h2>
            <form onSubmit={onCreateChat} className="space-y-4">
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
    );
}

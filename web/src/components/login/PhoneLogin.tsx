"use client";

import React from "react";

interface PhoneLoginProps {
    phone: string;
    setPhone: (phone: string) => void;
    loading: boolean;
    onSendOtp: () => void;
}

export default function PhoneLogin({ phone, setPhone, loading, onSendOtp }: PhoneLoginProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-ash mb-2">
                    Device Contact (Phone)
                </label>
                <input
                    type="tel"
                    placeholder="+919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-abyss/80 border border-ash/10 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl text-parchment font-mono text-sm placeholder-ash/30 outline-none transition-all duration-300"
                />
            </div>
            <button
                onClick={onSendOtp}
                disabled={loading}
                className="w-full py-3 bg-ember hover:bg-ember/90 text-white font-mono text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
            >
                {loading ? "Whispering..." : "Whisper secret code"}
            </button>
        </div>
    );
}

"use client";

import React from "react";

interface OtpVerificationProps {
    otp: string;
    setOtp: (otp: string) => void;
    loading: boolean;
    onVerifyOtp: () => void;
    onBack: () => void;
}

export default function OtpVerification({
    otp,
    setOtp,
    loading,
    onVerifyOtp,
    onBack,
}: OtpVerificationProps) {
    return (
        <div className="space-y-4 animate-fade-in">
            <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-ash mb-2">
                    Verification Phrase (OTP)
                </label>
                <input
                    type="text"
                    placeholder="Enter secret code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-abyss/80 border border-ash/10 focus:border-ember focus:ring-1 focus:ring-ember rounded-xl text-parchment font-mono text-sm placeholder-ash/30 outline-none transition-all duration-300"
                />
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 bg-soot border border-ash/10 hover:border-ash/30 text-ash hover:text-parchment font-mono text-sm tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer"
                >
                    Back
                </button>
                <button
                    onClick={onVerifyOtp}
                    disabled={loading}
                    className="flex-1 py-3 bg-ember hover:bg-ember/90 text-white font-mono text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify Code"}
                </button>
            </div>
        </div>
    );
}

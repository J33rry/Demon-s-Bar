"use client";

import { useState } from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import useAuth from "@/store/userStore";

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
        null,
    );
    const { setUser, setUserId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const sendTokenToBackend = async (token: string) => {
        try {
            const response = await fetch(
                "http://localhost:3002/api/auth/sync-user",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                },
            );

            if (response.ok) {
                const data = await response.json();
                if (data?.user) {
                    setUser(data.user.name);
                    setUserId(data.user.firebaseUid);
                    router.push("/dashboard");
                } else {
                    console.error("User data missing in response:", data);
                    setStatusMessage(
                        "Auth synced but user details were missing.",
                    );
                }
            } else {
                console.error("Failed to sync user: status", response.status);
                setStatusMessage(
                    "Failed to synchronize user session with backend.",
                );
            }
        } catch (error) {
            console.error("Network error syncing user:", error);
            setStatusMessage("Network error during backend synchronization.");
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setStatusMessage(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            await sendTokenToBackend(token);
        } catch (error) {
            const err = error as Error;
            console.error(err);
            setStatusMessage(err.message || "Google Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const sendOtp = async () => {
        if (!phone) {
            setStatusMessage("Please enter a valid phone number.");
            return;
        }
        setLoading(true);
        setStatusMessage(null);
        try {
            const win = window as typeof window & {
                recaptchaVerifier?: RecaptchaVerifier;
            };
            if (!win.recaptchaVerifier) {
                win.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "invisible",
                    },
                );
            }
            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phone,
                win.recaptchaVerifier,
            );

            setConfirmation(confirmationResult);
            setStatusMessage(
                "A secret phrase (OTP) has been whispered to your device.",
            );
        } catch (error) {
            const err = error as Error;
            console.error(err);
            setStatusMessage(err.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            setStatusMessage("Please enter the verification code.");
            return;
        }
        setLoading(true);
        setStatusMessage(null);
        try {
            if (!confirmation) return;
            const result = await confirmation.confirm(otp);
            const token = await result.user.getIdToken();
            await sendTokenToBackend(token);
        } catch (error) {
            const err = error as Error;
            console.error(err);
            setStatusMessage(err.message || "Invalid OTP code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-abyss px-4 overflow-hidden font-body">
            {/* Background Embers */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-ember/5 blur-[100px] animate-ember-float" />
                <div
                    className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-ember/3 blur-[120px] animate-ember-float"
                    style={{ animationDelay: "-3s" }}
                />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md glass-panel rounded-2xl p-8 transition-all duration-300 md:p-10">
                {/* Immersive Candle Header */}
                <div className="text-center mb-8">
                    <svg
                        className="w-16 h-20 mx-auto mb-4"
                        viewBox="0 0 100 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Outer Glow filter applied via CSS */}
                        <path
                            d="M50 15C50 15 32 42 32 58C32 70.5 40 78 50 78C60 78 68 70.5 68 58C68 42 50 15 50 15Z"
                            className="animate-candle-breathe fill-ember origin-bottom"
                        />
                        <line
                            x1="50"
                            y1="73"
                            x2="50"
                            y2="85"
                            stroke="#8a8a93"
                            strokeWidth="2"
                        />
                        <rect
                            x="42"
                            y="85"
                            width="16"
                            height="30"
                            rx="2"
                            fill="#eee5da"
                            opacity="0.8"
                        />
                    </svg>
                    <h1 className="font-display text-3xl font-medium tracking-widest text-parchment text-glow uppercase">
                        Demon&apos;s Bar
                    </h1>
                    <p className="text-ash text-xs uppercase tracking-widest mt-2 font-mono">
                        Establish your connection
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-soot/80 border border-ash/10 hover:border-ember/40 rounded-xl font-mono text-sm tracking-wider uppercase text-parchment hover:text-white transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        Identify with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center justify-center my-4">
                        <div className="w-full h-px bg-ash/10" />
                        <span className="px-4 text-ash text-[10px] font-mono uppercase tracking-widest">
                            Or
                        </span>
                        <div className="w-full h-px bg-ash/10" />
                    </div>

                    {!confirmation ? (
                        /* Phone Input Form */
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
                                onClick={sendOtp}
                                disabled={loading}
                                className="w-full py-3 bg-ember hover:bg-ember/90 text-white font-mono text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
                            >
                                {loading
                                    ? "Whispering..."
                                    : "Whisper secret code"}
                            </button>
                        </div>
                    ) : (
                        /* OTP Verification Form */
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
                                    onClick={() => setConfirmation(null)}
                                    className="flex-1 py-3 bg-soot border border-ash/10 hover:border-ash/30 text-ash hover:text-parchment font-mono text-sm tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={verifyOtp}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-ember hover:bg-ember/90 text-white font-mono text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Verify Code"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status Feedback */}
                    {statusMessage && (
                        <div className="p-3 bg-ember/10 border border-ember/20 rounded-xl text-center">
                            <p className="text-xs font-mono text-ember">
                                {statusMessage}
                            </p>
                        </div>
                    )}

                    {/* Captcha target */}
                    <div
                        id="recaptcha-container"
                        className="flex justify-center"
                    />
                </div>
            </div>
        </div>
    );
}

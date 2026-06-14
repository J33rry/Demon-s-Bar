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
import LoginHeader from "@/components/login/LoginHeader";
import GoogleLogin from "@/components/login/GoogleLogin";
import PhoneLogin from "@/components/login/PhoneLogin";
import OtpVerification from "@/components/login/OtpVerification";

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
            let formattedPhone = phone.trim().replace(/[\s\-\(\)]/g, "");
            if (!formattedPhone.startsWith("+")) {
                if (formattedPhone.length === 10) {
                    formattedPhone = "+91" + formattedPhone;
                } else if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
                    formattedPhone = "+" + formattedPhone;
                } else {
                    formattedPhone = "+91" + formattedPhone;
                }
            }

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                formattedPhone,
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
                <LoginHeader />

                <div className="space-y-6">
                    <GoogleLogin loading={loading} onLogin={handleGoogleLogin} />

                    {/* Divider */}
                    <div className="flex items-center justify-center my-4">
                        <div className="w-full h-px bg-ash/10" />
                        <span className="px-4 text-ash text-[10px] font-mono uppercase tracking-widest">
                            Or
                        </span>
                        <div className="w-full h-px bg-ash/10" />
                    </div>

                    {!confirmation ? (
                        <PhoneLogin
                            phone={phone}
                            setPhone={setPhone}
                            loading={loading}
                            onSendOtp={sendOtp}
                        />
                    ) : (
                        <OtpVerification
                            otp={otp}
                            setOtp={setOtp}
                            loading={loading}
                            onVerifyOtp={verifyOtp}
                            onBack={() => setConfirmation(null)}
                        />
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

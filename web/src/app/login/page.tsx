"use client";

import { useState } from "react";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth";

import { auth } from "@/lib/firebase"; // your firebase config
import { useRouter } from "next/navigation";
import useAuth from "@/store/userStore";

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
        null,
    );
    const { setToken } = useAuth();
    const sendTokenToBackend = async (token: string) => {
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

        const data = await response.json();
        // console.log(data);
        setToken(token);
        router.push("/dashboard");
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);

            const token = await result.user.getIdToken();

            console.log("Firebase Token:", token);

            await sendTokenToBackend(token);
        } catch (error) {
            console.error(error);
        }
    };

    const sendOtp = async () => {
        try {
            if (!(window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "normal",
                    },
                );
            }

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phone,
                (window as any).recaptchaVerifier,
            );

            setConfirmation(confirmationResult);

            alert("OTP sent");
        } catch (error) {
            console.error(error);
        }
    };

    const verifyOtp = async () => {
        try {
            if (!confirmation) return;

            const result = await confirmation.confirm(otp);

            const token = await result.user.getIdToken();

            console.log("Firebase Token:", token);

            await sendTokenToBackend(token);

            alert("Login Successful");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-10">
            <h1>Firebase Auth Demo</h1>

            <button onClick={handleGoogleLogin} className="border p-2">
                Login with Google
            </button>

            <input
                type="text"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2"
            />

            <button onClick={sendOtp} className="border p-2">
                Send OTP
            </button>

            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2"
            />

            <button onClick={verifyOtp} className="border p-2">
                Verify OTP
            </button>

            <div id="recaptcha-container" />
        </div>
    );
}

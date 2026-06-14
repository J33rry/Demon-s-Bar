"use client";

import React from "react";

export default function LoginHeader() {
    return (
        <div className="text-center mb-8">
            <svg
                className="w-16 h-20 mx-auto mb-4"
                viewBox="0 0 100 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
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
    );
}

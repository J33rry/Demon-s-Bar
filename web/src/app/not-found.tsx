"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="relative min-h-screen bg-abyss flex flex-col items-center justify-center px-4 overflow-hidden font-body text-parchment">
            {/* Background Embers */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-ember/3 blur-[100px] animate-ember-float" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-ember/5 blur-[120px] animate-ember-float"
                    style={{ animationDelay: "-3s" }}
                />
            </div>

            {/* Content Card */}
            <div className="relative z-10 w-full max-w-lg glass-panel rounded-2xl p-8 md:p-12 text-center transition-all duration-300 shadow-2xl">
                {/* Spooky Extinguished/Flickering Candle */}
                <div className="relative w-24 h-32 mx-auto mb-6">
                    <svg
                        className="w-full h-full drop-shadow-[0_0_15px_#C84B31] animate-candle-breathe"
                        viewBox="0 0 100 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Extinguished/Whispering smoke trail */}
                        <path
                            d="M50 15C53 8 45 4 48 0C43 4 48 8 50 15Z"
                            stroke="#8a8a93"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="opacity-40 animate-pulse"
                            style={{ transformOrigin: "bottom", animationDuration: "4s" }}
                        />
                        {/* Dimly flickering flame */}
                        <path
                            d="M50 20C50 20 40 45 40 55C40 65 45 70 50 70C55 70 60 65 60 55C60 45 50 20 50 20Z"
                            className="animate-flicker fill-ember origin-bottom opacity-75"
                        />
                        <line
                            x1="50"
                            y1="68"
                            x2="50"
                            y2="82"
                            stroke="#8a8a93"
                            strokeWidth="2"
                        />
                        <rect
                            x="42"
                            y="82"
                            width="16"
                            height="35"
                            rx="2"
                            fill="#eee5da"
                            opacity="0.8"
                        />
                    </svg>
                </div>

                <h1 className="font-display text-7xl font-bold tracking-widest text-glow text-ember uppercase">
                    404
                </h1>
                
                <h2 className="font-display text-lg tracking-wider text-parchment uppercase mt-4">
                    Wandered into the Shadows
                </h2>
                
                <p className="text-ash text-xs font-mono max-w-sm mx-auto mt-3 leading-relaxed uppercase tracking-wider">
                    The Counter ledger does not contain a record of this location. The connection link has severed.
                </p>

                <div className="mt-8">
                    <Link href="/dashboard" passHref legacyBehavior>
                        <a className="inline-block px-6 py-3 bg-ember hover:bg-ember/90 text-white font-mono text-xs tracking-widest uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer transform hover:-translate-y-0.5">
                            Return to the Bar
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

interface HeaderProps {
    userId: string | null;
    copied: boolean;
    onCopyMark: () => void;
    onLogout: () => void;
}

export default function Header({ userId, copied, onCopyMark, onLogout }: HeaderProps) {
    return (
        <header className="relative z-10 w-full bg-soot/80 backdrop-blur-md border-b border-ash/10 py-4 px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <svg
                    className="w-8 h-10 drop-shadow-[0_0_3px_#C84B31] animate-candle-breathe"
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
                <div>
                    <h1 className="font-display text-xl tracking-widest text-parchment text-glow uppercase">
                        Demon&apos;s Bar
                    </h1>
                    <p className="text-[9px] font-mono tracking-widest text-ash uppercase">
                        The Counter
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {userId && (
                    <div className="hidden md:flex items-center gap-2 bg-abyss/60 border border-ash/10 px-3 py-1.5 rounded-lg text-xs font-mono">
                        <span className="text-ash uppercase">Mark:</span>
                        <span
                            className="text-parchment max-w-30 truncate"
                            title={userId}
                        >
                            {userId}
                        </span>
                        <button
                            onClick={onCopyMark}
                            className="text-ash hover:text-ember transition-colors p-1 cursor-pointer"
                            title="Copy Mark"
                        >
                            {copied ? (
                                <svg
                                    className="w-3.5 h-3.5 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
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
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-soot hover:bg-ember border border-ash/10 hover:border-ember hover:text-white rounded-lg font-mono text-xs tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
                >
                    Leave the Bar
                </button>
            </div>
        </header>
    );
}

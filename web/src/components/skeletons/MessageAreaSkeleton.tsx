"use client";

export default function MessageAreaSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => {
                const isLeft = i % 2 === 0;
                return (
                    <div
                        key={i}
                        className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-3.5 rounded-2xl ${
                                isLeft
                                    ? "bg-soot/60 border border-ash/10 rounded-bl-none"
                                    : "bg-ember/10 rounded-br-none"
                            } w-48 space-y-2`}
                        >
                            <div className="h-2.5 bg-ash/15 rounded w-5/6" />
                            <div className="h-2 bg-ash/10 rounded w-2/3" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

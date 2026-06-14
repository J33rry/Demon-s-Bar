"use client";

export default function LedgerSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-3.5 bg-soot/40 border border-ash/5 rounded-xl"
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-ash/15 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-ash/15 rounded w-2/3" />
                            <div className="h-2 bg-ash/10 rounded w-1/3" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

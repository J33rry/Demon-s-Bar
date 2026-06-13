import { useEffect, useRef, useState } from "react";

export default function Candle({ className = "", onFlare }) {
  const svgRef = useRef(null);
  const [flare, setFlare] = useState(false);

  useEffect(() => {
    if (!onFlare) return;
    const cleanup = onFlare(() => {
      setFlare(true);
      setTimeout(() => setFlare(false), 300);
    });
    return cleanup;
  }, [onFlare]);

  return (
    <svg
      ref={svgRef}
      className={`w-6 h-6 text-ember drop-shadow-[0_0_4px_#C84B31] transition-transform duration-300 ${flare ? "scale-125" : ""} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeIn in="coloredBlur" />
            <feMergeIn in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 2C11.5 2 11 2.5 11 3v7c0 1.5 1.5 2.5 2.5 2.5S16 11.5 16 10V3c0-.5-.5-1-1-1h-3z"
        filter="url(#glow)"
        className="animate-candle-breathe transform origin-center"
      />
      <path
        d="M10 10h4"
        strokeWidth="1"
        opacity="0.6"
      />
      <ellipse cx="12" cy="10" rx="2.5" ry="1" strokeWidth="1" opacity="0.3" />
      <path
        d="M12 3c0-1.5 2-2.5 3.5-2.5S19 1.5 19 3v1c0 .5-.5 1-1 1h-2v6c0 1.5-1.5 2.5-3.5 2.5S11 11.5 11 10V4h-2c-.5 0-1-.5-1-1V3z"
        fill="currentColor"
        opacity="0.15"
        className="animate-candle-breathe transform origin-center"
      />
    </svg>
  );
}
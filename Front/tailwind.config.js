/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0A0A0F",
        soot: "#14141C",
        ember: "#C84B31",
        "ember-glow": "#E87550",
        ash: "#6B6B7A",
        parchment: "#E8DCC8",
        "parchment-dim": "#B8A898",
      },
      fontFamily: {
        display: ["IM Fell French Canon", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        "sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "base": ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "lg": ["1.125rem", { lineHeight: "1.55", letterSpacing: "-0.01em" }],
        "xl": ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["1.75rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "3xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      animation: {
        "candle-breathe": "candleBreathe 4s ease-in-out infinite",
        "candle-flare": "candleFlare 300ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "slide-down": "slideDown 250ms ease-in",
        "fade-in": "fadeIn 200ms ease-out",
        "fade-out": "fadeOut 150ms ease-in",
      },
      keyframes: {
        candleBreathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.03)", opacity: "1" },
        },
        candleFlare: {
          "0%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.15)", filter: "brightness(1.4)" },
          "100%": { transform: "scale(1)", filter: "brightness(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      boxShadow: {
        "candle": "0 0 24px -4px #C84B31, 0 0 48px -8px #C84B31",
        "candle-soft": "0 0 16px -4px #C84B31",
        "soot": "0 4px 24px -4px rgba(0,0,0,0.6)",
        "ember-glow": "0 0 0 1px #C84B31, 0 0 16px -2px #C84B31",
      },
      borderRadius: {
        "candle": "9999px",
      },
      transitionDuration: {
        "candle": "400ms",
      },
      zIndex: {
        "navbar": "50",
        "sidebar": "40",
        "modal": "60",
        "toast": "70",
      },
    },
  },
  plugins: [],
};
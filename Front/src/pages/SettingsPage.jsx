import { useAppStore } from "../store/useAppStore";
import { Send } from "lucide-react";
import Candle from "../components/Candle";

const THEMES = [
  "dark",
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

const PREVIEW_MESSAGES = [
  { id: 1, content: "The deal stands.", isSent: false },
  { id: 2, content: "Midnight at the crossroads.", isSent: true },
];

export default function SettingsPage() {
  const { theme, setTheme } = useAppStore();

  return (
    <div className="min-h-screen bg-abyss pt-16">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-ember/5 rounded-full blur-[200px] -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Candle className="w-8 h-8 animate-candle-breathe shrink-0" />
          <div>
            <h1 className="font-display text-2xl text-parchment tracking-tight">Tab</h1>
            <p className="text-ash text-sm font-body mt-0.5">Adjust the atmosphere</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-body font-medium text-lg text-parchment">Theme</h2>
                <p className="text-ash text-sm font-body mt-0.5">Choose the lighting for your conversations</p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                    theme === t
                      ? "ring-2 ring-ember bg-ember/10 scale-[1.02]"
                      : "hover:bg-soot/50 hover:scale-[1.02]"
                  }`}
                  aria-pressed={theme === t}
                  aria-label={`Theme: ${t}`}
                >
                  <div className="relative w-full h-10 rounded-lg overflow-hidden border border-ash/20 bg-soot" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary" />
                      <div className="rounded bg-secondary" />
                      <div className="rounded bg-accent" />
                      <div className="rounded bg-neutral" />
                    </div>
                  </div>
                  <span className="text-xs font-body font-medium truncate w-full text-center text-parchment group-hover:text-ember transition-colors">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                  {theme === t && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ember flex items-center justify-center">
                      <svg className="w-3 h-3 text-parchment" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-body font-medium text-lg text-parchment mb-4 flex items-center gap-2">
              <Candle className="w-5 h-5 animate-candle-breathe" />
              Preview
            </h3>

            <div className="surface-raised rounded-2xl overflow-hidden border border-ash/20 shadow-soot">
              <div className="p-4 bg-soot/50 border-b border-ash/10">
                <div className="max-w-lg mx-auto">
                  <div className="surface-raised rounded-xl shadow-soot overflow-hidden border border-ash/20">
                    <div className="px-4 py-3 border-b border-ash/10 bg-soot/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ember/10 flex items-center justify-center">
                          <span className="font-body font-medium text-base text-ember">L</span>
                        </div>
                        <div>
                          <h4 className="font-body font-medium text-sm text-parchment">Lucien Vane</h4>
                          <p className="text-xs text-ash">Online</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-4 min-h-[180px] max-h-[180px] overflow-y-auto bg-abyss/30">
                      {PREVIEW_MESSAGES.map((message) => (
                        <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] ${message.isSent ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                            <div className={`rounded-2xl px-4 py-2.5 ${message.isSent ? "rounded-tr-sm bg-ember text-parchment shadow-candle-soft" : "rounded-tl-sm bg-soot border border-ash/20 text-parchment"}`}>
                              <p className="font-body text-sm">{message.content}</p>
                            </div>
                            <time className={`text-[10px] font-mono mt-1 ${message.isSent ? "text-ember/70" : "text-ash/50"}`}>
                              11:42 PM
                            </time>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-ash/10 bg-soot/50">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input-field flex-1 text-sm h-10"
                          placeholder="Type a message..."
                          value="This is a preview"
                          readOnly
                        />
                        <button className="btn-primary h-10 min-h-0 shrink-0">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <p className="text-center text-xs text-ash/50 mt-12 font-mono tracking-wider">
          Demon&apos;s Bar — Est. MMXXIII
        </p>
      </div>
    </div>
  );
}
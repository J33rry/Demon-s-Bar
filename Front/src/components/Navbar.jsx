import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Settings, User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import Candle from "./Candle";

export default function Navbar() {
  const location = useLocation();
  const { currentUser, theme, setTheme, sidebarOpen, toggleSidebar } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeCycle = () => {
    const themes = ["dark", "light", "cupcake", "dracula", "cyberpunk"];
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  if (isAuthPage) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-abyss/80 backdrop-blur-sm border-b border-ash/10 z-navbar">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <Link to="/" className="flex items-center gap-3" aria-label="Demon&apos;s Bar - Home">
              <Candle className="animate-candle-breathe" />
              <span className="font-display text-xl text-parchment tracking-tight">Demon&apos;s Bar</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleThemeCycle}
                className="btn-icon p-2"
                aria-label="Cycle theme"
                title="Cycle theme"
              >
                <span className="text-xs font-mono text-ash">{theme.slice(0, 3)}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-abyss/80 backdrop-blur-sm border-b border-ash/10 z-navbar">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden btn-icon p-2 -ml-2"
              aria-label={sidebarOpen ? "Close Ledger" : "Open Ledger"}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex items-center gap-3 px-2" aria-label="Demon&apos;s Bar - The Counter">
              <Candle className="animate-candle-breathe shrink-0" />
              <span className="font-display text-xl lg:text-2xl text-parchment tracking-tight hidden sm:block">
                Demon&apos;s Bar
              </span>
            </Link>

            <div className="hidden lg:block h-6 w-px bg-ash/20 mx-2" aria-hidden="true" />

            <nav className="flex items-center gap-1" aria-label="Main navigation">
              <Link
                to="/"
                className={`btn-ghost px-3 py-1.5 text-sm ${location.pathname === "/" ? "text-parchment bg-soot/50" : ""}`}
                aria-current={location.pathname === "/" ? "page" : undefined}
              >
                The Counter
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeCycle}
              className="btn-icon p-2 lg:p-2.5"
              aria-label={`Current theme: ${theme}. Click to cycle.`}
              title={`Theme: ${theme}`}
            >
              <span className="text-xs font-mono text-ash uppercase tracking-wider">{theme.slice(0, 4)}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-soot/50 focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <div className="avatar w-8 h-8">
                  <div className="w-full h-full rounded-full bg-ember/20 flex items-center justify-center">
                    <span className="font-body font-medium text-sm text-ember">
                      {currentUser.fullName.charAt(0)}
                    </span>
                  </div>
                </div>
                <span className="hidden sm:block font-body font-medium text-sm text-parchment">
                  {currentUser.fullName}
                </span>
                <ChevronDown className="w-4 h-4 text-ash" aria-hidden="true" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-[55]"
                    onClick={() => setShowUserMenu(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-48 surface-raised rounded-xl shadow-soot border border-ash/20 py-1 animate-fade-in" role="menu">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-parchment hover:bg-soot/50 font-body"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 text-ash" aria-hidden="true" />
                      Your Mark
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-parchment hover:bg-soot/50 font-body"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 text-ash" aria-hidden="true" />
                      Tab
                    </Link>
                    <div className="border-t border-ash/10 my-1" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-ember hover:bg-soot/50 font-body"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Leave the Bar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-abyss/95 backdrop-blur-sm z-[45] animate-slide-down p-4" role="dialog" aria-label="Mobile menu">
          <nav className="flex flex-col gap-2">
            <Link to="/" className="btn-ghost justify-start px-4 py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              The Counter
            </Link>
            <Link to="/profile" className="btn-ghost justify-start px-4 py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Your Mark
            </Link>
            <Link to="/settings" className="btn-ghost justify-start px-4 py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Tab
            </Link>
            <button className="btn-ghost justify-start px-4 py-3 text-lg text-ember" onClick={() => setMobileMenuOpen(false)}>
              Leave the Bar
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
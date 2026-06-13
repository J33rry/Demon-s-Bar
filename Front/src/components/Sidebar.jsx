import { useEffect, useRef } from "react";
import { X, User, Filter, ChevronRight } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { formatMessageTime } from "../lib/dummyData";

export default function Sidebar() {
  const {
    onlineUserIds,
    selectedUserId,
    sidebarOpen,
    closeSidebar,
    selectUser,
    showOnlineOnly,
    setShowOnlineOnly,
    getFilteredUsers,
    getUnreadCount,
    isUserOnline,
  } = useAppStore();

  const filteredUsers = getFilteredUsers();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) closeSidebar();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [sidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 lg:hidden bg-abyss/60 backdrop-blur-sm z-[35] animate-fade-in"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed lg:static inset-y-0 left-0 z-sidebar w-72 bg-soot/95 backdrop-blur-sm border-r border-ash/10 flex flex-col transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        role="complementary"
        aria-label="The Ledger - Contacts"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b border-ash/10">
          <h2 className="font-display text-lg text-parchment tracking-tight">The Ledger</h2>
          <button
            onClick={closeSidebar}
            className="lg:hidden btn-icon p-1.5 text-ash hover:text-parchment"
            aria-label="Close Ledger"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3 border-b border-ash/10">
          <label className="flex items-center gap-3 px-3 py-2 bg-abyss/50 rounded-lg cursor-pointer transition-colors hover:bg-abyss/70">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-4 h-4 accent-ember rounded border-ash/30 focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
              aria-label="Show online only"
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Filter className="w-4 h-4 text-ash shrink-0" aria-hidden="true" />
              <span className="text-sm font-body text-parchment truncate">Online only</span>
            </div>
            <span className="text-xs font-mono text-ash shrink-0">
              {onlineUserIds.filter((id) => id !== "current-user").length} online
            </span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin" role="list" aria-label="Contacts">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-ash py-12 px-4 text-center">
              <User className="w-10 h-10 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-sm font-body">No contacts found</p>
              <p className="text-xs mt-1">The Ledger is empty</p>
            </div>
          ) : (
            <ul className="space-y-1" role="list">
              {filteredUsers.map((user) => {
                const unread = getUnreadCount(user._id);
                const online = isUserOnline(user._id);
                const isSelected = selectedUserId === user._id;

                return (
                  <li key={user._id} role="listitem">
                    <button
                      onClick={() => selectUser(user)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group ${
                        isSelected
                          ? "bg-ember/10 ring-1 ring-ember/30"
                          : "hover:bg-soot/50"
                      }`}
                      aria-current={isSelected ? "true" : undefined}
                      aria-pressed={isSelected}
                    >
                      <div className="relative shrink-0">
                        <div className="avatar w-11 h-11">
                          <div className="w-full h-full rounded-full bg-ember/10 flex items-center justify-center overflow-hidden">
                            {user.profilePic ? (
                              <img src={user.profilePic} alt="" className="avatar-img" />
                            ) : (
                              <span className="font-body font-medium text-lg text-ember">
                                {user.fullName.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>
                        {online && (
                          <span
                            className={`avatar-status ${online ? "avatar-status-online" : "avatar-status-offline"}`}
                            aria-label={online ? "Online" : "Offline"}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-body font-medium text-sm text-parchment truncate">
                            {user.fullName}
                          </p>
                          {unread > 0 && (
                            <span
                              className="flex-shrink-0 px-2 py-0.5 text-[10px] font-mono font-medium text-parchment bg-ember rounded-candle"
                              aria-label={`${unread} unread`}
                            >
                              {unread > 9 ? "9+" : unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-body text-ash truncate mt-0.5">
                          {online ? "Online" : `Last seen ${formatMessageTime(user.lastSeen)}`}
                        </p>
                      </div>

                      {isSelected && (
                        <ChevronRight className="w-4 h-4 text-ember shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-ash/10">
          <p className="text-xs font-mono text-ash/60 text-center">
            {filteredUsers.length} contact{filteredUsers.length !== 1 ? "s" : ""} in The Ledger
          </p>
        </div>
      </aside>
    </>
  );
}
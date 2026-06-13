import { X, MoreVertical } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default function ChatHeader() {
  const { getSelectedUser, isUserOnline, closeSidebar } = useAppStore();
  const user = getSelectedUser();

  if (!user) return null;

  const online = isUserOnline(user._id);

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-ash/10 bg-soot/50 backdrop-blur-sm shrink-0">
      <button
        onClick={closeSidebar}
        className="lg:hidden btn-icon p-1.5 -ml-1"
        aria-label="Close Ledger"
      >
        <X size={20} />
      </button>

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
            className="avatar-status avatar-status-online"
            aria-label="Online"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-body font-medium text-sm text-parchment truncate">
          {user.fullName}
        </h3>
        <p className="text-xs font-body text-ash mt-0.5">
          {online ? "Online" : "Offline"}
        </p>
      </div>

      <button
        className="btn-icon p-1.5 text-ash hover:text-parchment opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>
    </header>
  );
}
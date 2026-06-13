import { useState, useRef } from "react";
import { Camera, Mail, User, Calendar, Shield, Flame } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import Candle from "../components/Candle";

export default function ProfilePage() {
  const { currentUser, theme } = useAppStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result);
      setIsUploading(false);
    };
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-abyss pt-16">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-ember/5 rounded-full blur-[200px] -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Candle className="w-8 h-8 animate-candle-breathe shrink-0" />
          <div>
            <h1 className="font-display text-2xl text-parchment tracking-tight">Your Mark</h1>
            <p className="text-ash text-sm font-body mt-0.5">Your presence in The Ledger</p>
          </div>
        </div>

        <div className="surface-raised rounded-2xl p-6 sm:p-8 shadow-soot border border-ash/20 space-y-8">
          <div className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full bg-ember/10 flex items-center justify-center overflow-hidden ring-2 ring-ash/20">
                  {selectedImg || currentUser.profilePic ? (
                    <img
                      src={selectedImg || currentUser.profilePic}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-body font-bold text-4xl text-ember">
                      {currentUser.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 w-10 h-10 rounded-full bg-ember flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-candle ring-4 ring-abyss ${
                    isUploading ? "animate-pulse pointer-events-none opacity-70" : ""
                  }`}
                  aria-label="Update avatar"
                >
                  <Camera className="w-5 h-5 text-parchment" aria-hidden="true" />
                  <input
                    type="file"
                    id="avatar-upload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-sm text-ash font-body">
                {isUploading ? "Updating..." : "Tap the flame to change"}
              </p>
            </div>

            <h2 className="font-display text-xl text-parchment tracking-tight mb-1">
              {currentUser.fullName}
            </h2>
            <p className="text-ash text-sm font-body">@{currentUser.email.split("@")[0]}</p>
          </div>

          <div className="border-t border-ash/10 pt-6 space-y-5">
            <h3 className="font-body font-medium text-sm text-parchment uppercase tracking-wider text-ash">
              Identity
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-soot/50 rounded-xl border border-ash/10">
                <div className="w-10 h-10 rounded-lg bg-ember/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-ember" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-ash/60 uppercase tracking-wider">Full Name</p>
                  <p className="font-body text-parchment truncate">{currentUser.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-soot/50 rounded-xl border border-ash/10">
                <div className="w-10 h-10 rounded-lg bg-ember/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-ember" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-ash/60 uppercase tracking-wider">Email Address</p>
                  <p className="font-body text-parchment truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-ash/10 pt-6 space-y-4">
            <h3 className="font-body font-medium text-sm text-parchment uppercase tracking-wider text-ash">
              Account
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-soot/50 rounded-xl border border-ash/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ember/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-ember" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-ash/60 uppercase tracking-wider">Member Since</p>
                    <p className="font-body text-sm text-parchment">{formatDate(currentUser.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-soot/50 rounded-xl border border-ash/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-ash/60 uppercase tracking-wider">Account Status</p>
                    <p className="font-body text-sm text-emerald-500">Active</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-soot/50 rounded-xl border border-ash/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ember/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-ember" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-ash/60 uppercase tracking-wider">Current Theme</p>
                    <p className="font-body text-sm text-parchment capitalize">{theme}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-ash/50 mt-8 font-mono tracking-wider">
          Demon&apos;s Bar — Est. MMXXIII
        </p>
      </div>
    </div>
  );
}
export const DUMMY_USERS = [
  {
    _id: "user-1",
    fullName: "Lucien Vane",
    email: "lucien@infernal.co",
    profilePic: null,
    createdAt: "2024-01-15T20:30:00Z",
    lastSeen: Date.now() - 1000 * 60 * 5,
  },
  {
    _id: "user-2",
    fullName: "Mara Thorn",
    email: "mara@infernal.co",
    profilePic: null,
    createdAt: "2024-02-20T14:15:00Z",
    lastSeen: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    _id: "user-3",
    fullName: "Crowley",
    email: "crowley@infernal.co",
    profilePic: null,
    createdAt: "2023-11-05T09:00:00Z",
    lastSeen: Date.now() - 1000 * 60 * 30,
  },
  {
    _id: "user-4",
    fullName: "Vesper Blackwood",
    email: "vesper@infernal.co",
    profilePic: null,
    createdAt: "2024-03-10T18:45:00Z",
    lastSeen: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    _id: "user-5",
    fullName: "Damien Kross",
    email: "damien@infernal.co",
    profilePic: null,
    createdAt: "2024-01-28T22:00:00Z",
    lastSeen: Date.now() - 1000 * 60 * 10,
  },
  {
    _id: "user-6",
    fullName: "Lilith Morningstar",
    email: "lilith@infernal.co",
    profilePic: null,
    createdAt: "2023-12-12T12:30:00Z",
    lastSeen: Date.now() - 1000 * 60 * 60 * 48,
  },
];

export const DUMMY_CURRENT_USER = {
  _id: "current-user",
  fullName: "The Patron",
  email: "patron@demonsbar.co",
  profilePic: null,
  createdAt: "2023-10-01T19:00:00Z",
};

export const DUMMY_MESSAGES = {
  "user-1": [
    { _id: "msg-1", senderId: "user-1", text: "The deal stands. Midnight at the crossroads.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { _id: "msg-2", senderId: "current-user", text: "Bring the sigil. I'll bring the wine.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { _id: "msg-3", senderId: "user-1", text: "Always a pleasure doing business.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ],
  "user-2": [
    { _id: "msg-4", senderId: "user-2", text: "Heard you're looking for the Grimoire of Ashes.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { _id: "msg-5", senderId: "current-user", text: "Maybe. What's your price?", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
    { _id: "msg-6", senderId: "user-2", text: "A favor. Nothing you can't handle.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
  ],
  "user-3": [
    { _id: "msg-7", senderId: "current-user", text: "Crowley. The Hellhound situation?", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { _id: "msg-8", senderId: "user-3", text: "Contained. Barely. Your tab's growing.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  ],
  "user-4": [
    { _id: "msg-9", senderId: "user-4", text: "The ritual worked. The veil is thin tonight.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
    { _id: "msg-10", senderId: "current-user", text: "Good. Keep watch. I'm coming through.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString() },
  ],
  "user-5": [
    { _id: "msg-11", senderId: "current-user", text: "Damien. The artifact?", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
    { _id: "msg-12", senderId: "user-5", text: "In my possession. Meet at the usual spot?", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { _id: "msg-13", senderId: "current-user", text: "Thirty minutes. Don't be late.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
  ],
  "user-6": [
    { _id: "msg-14", senderId: "user-6", text: "Darling, you missed quite the scene last night.", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
    { _id: "msg-15", senderId: "current-user", text: "Fill me in over whiskey?", image: null, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString() },
  ],
};

export const ONLINE_USER_IDS = ["user-1", "user-3", "user-5", "current-user"];

export function formatMessageTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
import { create } from "zustand";
import {
  DUMMY_USERS,
  DUMMY_CURRENT_USER,
  DUMMY_MESSAGES,
  ONLINE_USER_IDS,
  formatMessageTime,
} from "../lib/dummyData";

const SIMULATED_DELAY = 300;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const useAppStore = create((set, get) => ({
  currentUser: DUMMY_CURRENT_USER,
  users: DUMMY_USERS,
  onlineUserIds: ONLINE_USER_IDS,
  selectedUserId: null,
  messages: {},
  isUsersLoading: false,
  isMessagesLoading: false,
  isSending: false,
  sidebarOpen: true,
  showOnlineOnly: false,
  theme: "dark",
  unreadCounts: {},

  setTheme: (theme) => set({ theme }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  setShowOnlineOnly: (show) => set({ showOnlineOnly: show }),

  selectUser: async (user) => {
    const userId = user?._id ?? null;
    set({ selectedUserId: userId, isMessagesLoading: true });
    if (userId) {
      await delay(SIMULATED_DELAY);
      set({
        messages: { ...get().messages, [userId]: DUMMY_MESSAGES[userId] || [] },
        unreadCounts: { ...get().unreadCounts, [userId]: 0 },
        isMessagesLoading: false,
      });
    } else {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUserId, currentUser, messages } = get();
    if (!selectedUserId || (!text?.trim() && !image)) return;

    set({ isSending: true });
    await delay(SIMULATED_DELAY);

    const newMessage = {
      _id: `msg-${Date.now()}`,
      senderId: currentUser._id,
      text: text?.trim() || null,
      image: image || null,
      createdAt: new Date().toISOString(),
    };

    set({
      messages: {
        ...messages,
        [selectedUserId]: [...(messages[selectedUserId] || []), newMessage],
      },
      isSending: false,
    });

    setTimeout(() => {
      const { messages: currentMessages, onlineUserIds } = get();
      if (onlineUserIds.includes(selectedUserId)) {
        const reply = {
          _id: `msg-${Date.now() + 1}`,
          senderId: selectedUserId,
          text: getAutoReply(text),
          image: null,
          createdAt: new Date().toISOString(),
        };
        set({
          messages: {
            ...currentMessages,
            [selectedUserId]: [...(currentMessages[selectedUserId] || []), reply],
          },
        });
      } else {
        const unread = get().unreadCounts;
        set({ unreadCounts: { ...unread, [selectedUserId]: (unread[selectedUserId] || 0) + 1 } });
      }
    }, 1000 + Math.random() * 2000);
  },

  getFilteredUsers: () => {
    const { users, onlineUserIds, showOnlineOnly } = get();
    return showOnlineOnly
      ? users.filter((u) => onlineUserIds.includes(u._id))
      : users;
  },

  getSelectedUser: () => {
    const { selectedUserId, users } = get();
    return users.find((u) => u._id === selectedUserId) || null;
  },

  getMessagesForSelected: () => {
    const { selectedUserId, messages } = get();
    return selectedUserId ? messages[selectedUserId] || [] : [];
  },

  getUnreadCount: (userId) => get().unreadCounts[userId] || 0,

  isUserOnline: (userId) => ONLINE_USER_IDS.includes(userId),

  formatTime: formatMessageTime,
}));

function getAutoReply() {
  const replies = [
    "Understood.",
    "Consider it done.",
    "The ink is dry.",
    "A wise choice.",
    "I'll have it by dawn.",
    "The stars align.",
    "No loose ends.",
    "As you command.",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
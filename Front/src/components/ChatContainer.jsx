import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import MessageInput from "./MessageInput";

export default function ChatContainer() {
  const {
    selectedUserId,
    getMessagesForSelected,
    isMessagesLoading,
    isSending,
  } = useAppStore();

  const messages = getMessagesForSelected();
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMessagesLoading]);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!atBottom);
  };

  if (!selectedUserId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-abyss p-8 text-center">
        <div className="max-w-md">
          <svg
            className="w-20 h-20 mx-auto mb-6 text-ember/30 animate-candle-breathe"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2C11.5 2 11 2.5 11 3v7c0 1.5 1.5 2.5 2.5 2.5S16 11.5 16 10V3c0-.5-.5-1-1-1h-3z" />
            <path d="M10 10h4" strokeWidth="1" opacity="0.6" />
            <ellipse cx="12" cy="10" rx="2.5" ry="1" strokeWidth="1" opacity="0.3" />
          </svg>
          <h3 className="font-display text-2xl text-parchment tracking-tight mb-2">
            Select a Contact
          </h3>
          <p className="text-ash text-base font-body">
            Open The Ledger and choose someone to converse with at The Counter.
          </p>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" aria-label="Loading messages" />
        </div>
        <MessageInput disabled />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <ChatHeader />

      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin"
        role="log"
        aria-live="polite"
        aria-label="Messages"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-ash/50">
            <p className="text-sm font-body">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message._id} message={message} />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-16 right-4 z-10 btn-primary shadow-soot animate-fade-in"
          aria-label="Scroll to latest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      <div className="border-t border-ash/10 bg-soot/50 backdrop-blur-sm shrink-0">
        <MessageInput disabled={isSending} />
      </div>
    </div>
  );
}
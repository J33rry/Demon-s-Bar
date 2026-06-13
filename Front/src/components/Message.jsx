import { useAppStore } from "../store/useAppStore";
import { formatMessageTime } from "../lib/dummyData";

export default function Message({ message }) {
  const { currentUser } = useAppStore();
  const isSent = message.senderId === currentUser._id;
  const time = formatMessageTime(message.createdAt);

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`max-w-[75%] ${isSent ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
        {!isSent && (
          <p className="text-xs font-mono text-ash/60 mb-1 px-1">
            {time}
          </p>
        )}

        <div
          className={`
            relative rounded-2xl px-4 py-2.5
            ${isSent
              ? "rounded-tr-sm bg-ember text-parchment shadow-candle-soft"
              : "rounded-tl-sm bg-soot border border-ash/20 text-parchment"
            }
          `}
        >
          {message.image && (
            <div className="mb-2 rounded-lg overflow-hidden max-w-xs">
              <img
                src={message.image}
                alt="Attachment"
                className="w-full h-auto block"
              />
            </div>
          )}

          {message.text && (
            <p className="font-body text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}

          <time
            className={`absolute -bottom-5 right-0 text-[10px] font-mono ${
              isSent ? "text-ember/70" : "text-ash/50"
            }`}
            dateTime={message.createdAt}
          >
            {time}
          </time>
        </div>

        {isSent && (
          <p className="text-xs font-mono text-ash/60 mt-1 pr-1">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
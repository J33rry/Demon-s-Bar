import { useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Send, X, Paperclip } from "lucide-react";

export default function MessageInput({ disabled = false }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const { sendMessage, isSending } = useAppStore();

  const isDisabled = disabled || isSending;
  const hasContent = text.trim() || imagePreview;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasContent || isDisabled) return;

    await sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 animate-fade-in">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-ash/20"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-soot border border-ash/20 flex items-center justify-center hover:bg-ember/20 hover:border-ember transition-all"
              aria-label="Remove image"
            >
              <X className="size-3.5 text-ash hover:text-ember" />
            </button>
          </div>
          <span className="text-xs text-ash font-mono">Attachment ready</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-end gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className={`btn-icon p-2 shrink-0 transition-colors ${
              isDisabled
                ? "opacity-40 cursor-not-allowed"
                : "text-ash hover:text-ember"
            }`}
            aria-label="Attach image"
          >
            <Paperclip className="w-5 h-5" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isDisabled}
              aria-hidden="true"
            />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              placeholder="Write a message..."
              className={`input-field resize-none min-h-[44px] max-h-40 pr-12 ${isDisabled ? "opacity-60" : ""}`}
              rows={1}
              aria-label="Message"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!hasContent || isDisabled}
          className={`btn-primary shrink-0 mb-1 ${!hasContent || isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
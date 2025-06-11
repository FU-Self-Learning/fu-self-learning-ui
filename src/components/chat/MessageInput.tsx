import React, { useState } from "react";

const MessageInput: React.FC<{ onSend: (msg: string) => void }> = ({
  onSend,
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 border-t bg-white rounded-b-xl"
    >
      <input
        type="text"
        name="fake-user"
        autoComplete="username"
        className="hidden"
      />

      <input
        type="text"
        name="chat-input"
        id="chat-input"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="text-black flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 shadow-sm"
      />
      <button
        type="submit"
        className="min-w-[60px] px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm transition"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;

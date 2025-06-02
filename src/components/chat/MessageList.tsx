import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";

interface Props {
  messages: ChatMessage[];
  currentUserId: number;
}

const MessageList: React.FC<Props> = ({ messages, currentUserId }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-[400px] bg-gray-50">
      {messages.map((msg) => {
        const isOwn = msg.senderUserId === currentUserId;
        return (
          <div
            key={msg.id}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-md ${
                isOwn
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              <div className="text-xs font-semibold mb-1 text-gray-500">
                {msg.senderUserId}
              </div>
              <div>{msg.message}</div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;

import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import moment from "moment";

interface Props {
  messages: ChatMessage[];
  currentUserId: number;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const MessageList: React.FC<Props> = ({ 
  messages, 
  currentUserId, 
  onLoadMore, 
  hasMore, 
  isLoading 
}) => {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = endRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !isLoading) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore]);

  const formatTimestamp = (timestamp: string | Date): string => {
    const messageTime = moment(timestamp);
    const now = moment();

    if (messageTime.isSame(now, "day")) {
      return messageTime.format("HH:mm");
    } else if (messageTime.isSame(now, "year")) {
      return messageTime.format("MMM D, HH:mm");
    } else {
      return messageTime.format("MMM D, YYYY, HH:mm");
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col gap-3 p-4 overflow-y-auto flex-1 bg-gray-50 rounded-2xl border border-gray-300"
    >
      {isLoading && (
        <div className="text-center text-gray-500 text-sm py-2">
          Loading more messages...
        </div>
      )}
      {messages.map((msg) => {
        const isOwn = msg.senderId === currentUserId;
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
              <div>{msg.message}</div>
              {msg.createdAt && (
                <div
                  className={`text-xs mt-1 ${
                    isOwn ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTimestamp(msg.createdAt)}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;

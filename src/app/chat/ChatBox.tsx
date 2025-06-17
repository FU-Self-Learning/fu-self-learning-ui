"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ChatMessage, ChatPayload } from "@/types/chat";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

interface ChatBoxProps {
  senderUserId: number;
  receiverUserId: number;
}

interface RawMessage {
  id: number;
  message: string;
  createdAt: string;
  senderId?: number;
  receiverId?: number;
  senderUserId?: number;
  receiverUserId?: number;
}

interface PaginatedMessages {
  messages: RawMessage[];
  total: number;
  page: number;
  limit: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ senderUserId, receiverUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket(senderUserId);

  const loadMessages = (pageNum: number = 1) => {
    if (!socket || isLoading) return;

    setIsLoading(true);
    socket.emit("loadMessages", {
      senderUserId,
      receiverUserId,
      page: pageNum,
      limit: 20,
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg: RawMessage) => {
      if (!msg.senderId && !msg.senderUserId) {
        throw new Error("Invalid message: missing senderId");
      }

      const normalized: ChatMessage = {
        id: msg.id,
        message: msg.message,
        createdAt: msg.createdAt,
        senderId: (msg.senderId ?? msg.senderUserId) as number,
        receiverId: (msg.receiverId ?? msg.receiverUserId) as number,
      };

      setMessages((prev) => [...prev, normalized]);
    };

    const handleMessagesLoaded = (data: PaginatedMessages) => {
      if (!data || !Array.isArray(data.messages)) {
        console.error("Invalid messages data received:", data);
        return;
      }

      const normalized = data.messages.map(
        (msg): ChatMessage => ({
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: (msg.senderId ?? msg.senderUserId) as number,
          receiverId: (msg.receiverId ?? msg.receiverUserId) as number,
        })
      );

      setMessages((prev) => {
        if (data.page === 1) {
          return normalized.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        const combined = [...normalized, ...prev];
        return combined.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      setHasMore(normalized.length === data.limit);
      setPage(data.page);
      setIsLoading(false);
    };

    loadMessages(1);

    socket.on("messagesLoaded", handleMessagesLoaded);
    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageSent", handleIncomingMessage);

    return () => {
      socket.off("messagesLoaded", handleMessagesLoaded);
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageSent", handleIncomingMessage);
    };
  }, [!!socket, senderUserId, receiverUserId]);

  const loadMoreMessages = () => {
    if (hasMore && !isLoading) {
      loadMessages(page + 1);
    }
  };

  const sendMessage = (msg: string) => {
    const payload: ChatPayload = {
      senderUserId,
      receiverUserId,
      message: msg,
    };
    socket?.emit("sendMessage", payload);
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto shadow-md rounded-2xl border border-gray-300 bg-white">
      <MessageList
        messages={messages}
        currentUserId={senderUserId}
        onLoadMore={loadMoreMessages}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;

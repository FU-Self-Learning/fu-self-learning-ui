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

const ChatBox: React.FC<ChatBoxProps> = ({ senderUserId, receiverUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg: any) => {
      const normalized: ChatMessage = {
        id: msg.id,
        message: msg.message,
        createdAt: msg.createdAt,
        senderId: msg.senderId ?? msg.senderUserId,
        receiverId: msg.receiverId ?? msg.receiverUserId,
      };

      setMessages((prev) => [...prev, normalized]);
    };

    const handleMessagesLoaded = (loaded: any[]) => {
      const normalized = loaded.map(
        (msg): ChatMessage => ({
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: msg.senderId ?? msg.senderUserId,
          receiverId: msg.receiverId ?? msg.receiverUserId,
        })
      );

      setMessages(normalized);
    };

    socket.emit("loadMessages", { senderUserId, receiverUserId });

    socket.on("messagesLoaded", handleMessagesLoaded);
    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageSent", handleIncomingMessage);

    return () => {
      socket.off("messagesLoaded", handleMessagesLoaded);
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageSent", handleIncomingMessage);
    };
  }, [!!socket, senderUserId, receiverUserId]);

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
      <MessageList messages={messages} currentUserId={senderUserId} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;

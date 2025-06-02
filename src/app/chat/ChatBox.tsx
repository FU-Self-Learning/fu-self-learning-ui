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

    const handleIncomingMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("messageSent", handleIncomingMessage);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("messageSent", handleIncomingMessage);
    };
  }, [socket]);

  const sendMessage = (msg: string) => {
    const payload: ChatPayload = {
      senderUserId,
      receiverUserId,
      message: msg,
    };
    socket?.emit("sendMessage", payload);
  };

  return (
    <div className="flex flex-col h-full max-w-full mx-auto shadow-lg rounded-xl border border-gray-200">
      <MessageList messages={messages} currentUserId={senderUserId} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;

'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useGroupChatSocket } from '@/hooks/useGroupChatSocket';
import { ChatMessage, ChatPayload } from '@/types/chat';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

interface ChatBoxProps {
  senderUserId: number;
  receiverUserId?: number;
  receiverGroupId?: number;
}
interface RawMessage {
  id: number;
  message: string;
  createdAt: string;
  senderId?: number;
  receiverId?: number;
  senderUserId?: number;
  receiverUserId?: number;
  receiverGroupId?: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ senderUserId, receiverUserId, receiverGroupId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Unified socket logic for both 1vs1 and group chat
  const groupSocketObj = receiverGroupId
    ? useGroupChatSocket(senderUserId, receiverGroupId)
    : undefined;
  const socket = receiverGroupId ? groupSocketObj?.socket : useSocket(senderUserId);
  const isConnected = receiverGroupId ? groupSocketObj?.isConnected : true;

  useEffect(() => {
    if (!socket) return;
    // Unified logic for both chat types
    let handleIncomingMessage: (msg: RawMessage) => void;
    let handleMessagesLoaded: (loaded: RawMessage[]) => void;

    if (receiverGroupId) {
      // Group chat logic
      handleIncomingMessage = (msg: RawMessage) => {
        const group = msg.receiverGroupId;
        if (group !== receiverGroupId) return;
        const normalized: ChatMessage = {
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: msg.senderId ?? msg.senderUserId ?? 0,
          receiverId: msg.receiverId ?? msg.receiverUserId ?? 0,
        };
        setMessages((prev) => [...prev, normalized]);
      };
      handleMessagesLoaded = (loaded: RawMessage[]) => {
        const normalized = loaded
          .filter((msg) => msg.receiverGroupId === receiverGroupId)
          .map((msg): ChatMessage => ({
            id: msg.id,
            message: msg.message,
            createdAt: msg.createdAt,
            senderId: msg.senderId ?? msg.senderUserId ?? 0,
            receiverId: msg.receiverId ?? msg.receiverUserId ?? 0,
          }));
        setMessages(normalized);
      };
      socket.emit('loadGroupMessages', { groupId: receiverGroupId });
      socket.on('groupMessagesLoaded', handleMessagesLoaded);
      socket.on('newGroupMessage', handleIncomingMessage);
      socket.on('groupMessageSent', handleIncomingMessage);
      return () => {
        socket.off('groupMessagesLoaded', handleMessagesLoaded);
        socket.off('newGroupMessage', handleIncomingMessage);
        socket.off('groupMessageSent', handleIncomingMessage);
      };
    } else {
      // 1vs1 chat logic
      handleIncomingMessage = (msg: RawMessage) => {
        const sender = msg.senderId ?? msg.senderUserId;
        const receiver = msg.receiverId ?? msg.receiverUserId;
        const isFromCurrentChat =
          (sender === senderUserId && receiver === receiverUserId) ||
          (sender === receiverUserId && receiver === senderUserId);
        if (!isFromCurrentChat) return;
        const normalized: ChatMessage = {
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: sender ?? 0,
          receiverId: receiver ?? 0,
        };
        setMessages((prev) => [...prev, normalized]);
      };
      handleMessagesLoaded = (loaded: RawMessage[]) => {
        const normalized = loaded.map(
          (msg): ChatMessage => ({
            id: msg.id,
            message: msg.message,
            createdAt: msg.createdAt,
            senderId: (msg.senderId ?? msg.senderUserId ?? 0),
            receiverId: (msg.receiverId ?? msg.receiverUserId ?? 0),
          }),
        );
        setMessages(normalized);
      };
      socket.emit('loadMessages', { senderUserId, receiverUserId });
      socket.on('messagesLoaded', handleMessagesLoaded);
      socket.on('newMessage', handleIncomingMessage);
      socket.on('messageSent', handleIncomingMessage);
      return () => {
        socket.off('messagesLoaded', handleMessagesLoaded);
        socket.off('newMessage', handleIncomingMessage);
        socket.off('messageSent', handleIncomingMessage);
      };
    }
  }, [senderUserId, receiverUserId, receiverGroupId, socket]);

  const sendMessage = (msg: string) => {
    if (!socket || !isConnected) {
      console.warn('[Socket] Cannot send message: socket not connected');
      return;
    }
    if (receiverGroupId) {
      socket.emit('sendGroupMessage', { groupId: Number(receiverGroupId), senderId: senderUserId, message: msg });
    } else {
      const payload: ChatPayload = {
        senderUserId,
        receiverUserId: receiverUserId ?? 0,
        message: msg,
      };
      socket.emit('sendMessage', payload);
    }
  };

  return (
    <div className='flex flex-col h-full max-w-full mx-auto shadow-xl rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm overflow-hidden'>
      <MessageList messages={messages} currentUserId={senderUserId} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;

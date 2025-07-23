'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { ChatMessage, ChatPayload } from '@/types/chat';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

interface ChatBoxProps {
  senderUserId: number;
  receiverUserId: number;
  receiverUser?: {
    avatarUrl?: string;
    username: string;
    online?: boolean;
  } | null;
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

const ChatBox: React.FC<ChatBoxProps> = ({ senderUserId, receiverUserId, receiverUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socket = useSocket(senderUserId);

  useEffect(() => {
    if (!receiverUser || !socket) return;

    const handleIncomingMessage = (msg: RawMessage) => {
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
        senderId: sender,
        receiverId: receiver,
      };

      setMessages((prev) => [...prev, normalized]);
    };

    const handleMessagesLoaded = (loaded: RawMessage[]) => {
      const normalized = loaded.map(
        (msg): ChatMessage => ({
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: (msg.senderId ?? msg.senderUserId) as number,
          receiverId: (msg.receiverId ?? msg.receiverUserId) as number,
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
  }, [senderUserId, receiverUserId, socket, receiverUser]);

  const sendMessage = (msg: string) => {
    const payload: ChatPayload = {
      senderUserId,
      receiverUserId,
      message: msg,
    };
    socket?.emit('sendMessage', payload);
  };

  // Guard: only render chat UI if receiverUser exists
  if (!receiverUser) {
    return <div className='flex items-center justify-center h-full text-gray-400'>No user selected</div>;
  }

  const receiver = receiverUser;

  return (
    <div className='flex flex-col h-full max-w-full mx-auto shadow-lg rounded-3xl border border-blue-100 bg-white p-2'>

      <div className='flex items-center justify-between px-4 py-3 border-b bg-white'>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <img
              src={receiver.avatarUrl}
              alt={receiver.username}
              className='w-9 h-9 rounded-full object-cover border'
            />
            {receiver.online && (
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></span>
            )}
          </div>
          <span className='font-semibold text-gray-800'>{receiver.username}</span>
        </div>
        <div className='flex items-center gap-3 text-gray-400'>
          <button className='hover:text-blue-500'><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg></button>
          <button className='hover:text-pink-500'><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" /></svg></button>
        </div>
      </div>
      <MessageList messages={messages} currentUserId={senderUserId} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;

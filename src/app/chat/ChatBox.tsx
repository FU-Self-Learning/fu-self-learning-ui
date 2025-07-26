'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useGroupChatSocket } from '@/hooks/useGroupChatSocket';
import { ChatMessage, ChatPayload } from '@/types/chat';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { Avatar } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

interface ChatBoxProps {
  senderUserId: number;
  receiverUserId?: number;
  receiverGroupId?: number;
  receiverUser?: any;
  receiverGroup?: any;
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
  group?: { id: number };
  sender?: {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string | null;
    dob?: string | null;
    avatarUrl?: string | null;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

const ChatBox: React.FC<ChatBoxProps> = ({ senderUserId, receiverUserId, receiverGroupId, receiverUser, receiverGroup }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const groupSocketObj = useGroupChatSocket(senderUserId, receiverGroupId);
  const userSocketObj = useSocket(senderUserId);

  const socket = receiverGroupId ? groupSocketObj?.socket : userSocketObj;
  const isConnected = receiverGroupId ? groupSocketObj?.isConnected : true;

  useEffect(() => {
    if (!socket) return;
    let handleIncomingMessage: (msg: RawMessage) => void;
    let handleMessagesLoaded: (loaded: RawMessage[]) => void;

    if (receiverGroupId) {


      handleIncomingMessage = (msg: RawMessage) => {
        const group = msg.receiverGroupId ?? msg.group?.id;
        if (group !== receiverGroupId) return;
        const normalized: ChatMessage = {
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: msg.senderId ?? msg.senderUserId ?? 0,
          receiverId: msg.receiverId ?? msg.receiverUserId ?? 0,
          sender: msg.sender ? {
            id: msg.sender.id,
            username: msg.sender.username,
            email: msg.sender.email,
            phoneNumber: msg.sender.phoneNumber,
            dob: msg.sender.dob,
            avatarUrl: msg.sender.avatarUrl,
            role: msg.sender.role,
            isActive: msg.sender.isActive,
            createdAt: msg.sender.createdAt,
            updatedAt: msg.sender.updatedAt,
          } : undefined,
        };
        setMessages((prev) => [...prev, normalized]);
      };
      handleMessagesLoaded = (loaded: RawMessage[]) => {
        console.log('[Socket][groupMessagesLoaded] data:', loaded);
        const normalized = loaded.map((msg): ChatMessage => ({
          id: msg.id,
          message: msg.message,
          createdAt: msg.createdAt,
          senderId: msg.senderId ?? msg.senderUserId ?? 0,
          receiverId: msg.receiverId ?? msg.receiverUserId ?? 0,
          sender: msg.sender ? {
            id: msg.sender.id,
            username: msg.sender.username,
            email: msg.sender.email,
            phoneNumber: msg.sender.phoneNumber,
            dob: msg.sender.dob,
            avatarUrl: msg.sender.avatarUrl,
            role: msg.sender.role,
            isActive: msg.sender.isActive,
            createdAt: msg.sender.createdAt,
            updatedAt: msg.sender.updatedAt,
          } : undefined,
        }));
        setMessages(normalized);
      };

      socket.on('groupMessagesLoaded', handleMessagesLoaded);
      socket.on('newGroupMessage', handleIncomingMessage);
      socket.on('groupMessageSent', handleIncomingMessage);
      socket.emit('loadGroupMessages', { groupId: receiverGroupId });

      return () => {
        socket.off('groupMessagesLoaded', handleMessagesLoaded);
        socket.off('newGroupMessage', handleIncomingMessage);
        socket.off('groupMessageSent', handleIncomingMessage);
      };
    } else {
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

  if (!receiverGroupId && (!receiverUserId || !receiverUser)) {
    return <div className='flex items-center justify-center h-full text-gray-400'>No user selected</div>;
  }

  return (
    <div className='flex flex-col h-full w-full shadow-lg rounded-3xl border border-blue-100 bg-white p-2'>
      {/* Header user hoặc group */}
      {receiverUser ? (
        <div className='flex items-center justify-between px-4 py-3 border-b bg-white rounded-t-3xl'>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <img
                src={receiverUser.avatarUrl || 'https://via.placeholder.com/50'}
                alt={receiverUser.username}
                className='w-9 h-9 rounded-full object-cover border'
              />
              {receiverUser.online && (
                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></span>
              )}
            </div>
            <div className='flex flex-col'>
              <span className='font-semibold text-gray-800'>{receiverUser.username}</span>
              <span className='font-[50px] text-gray-500'>{receiverUser.email}</span>
            </div>
          </div>
        </div>
      ) : receiverGroup ? (
        <div className='flex items-center gap-3 px-4 py-3 border-b bg-white rounded-t-3xl'>
          <Avatar
            src={receiverGroup.avatarUrl || undefined}
            icon={!receiverGroup.avatarUrl ? <TeamOutlined /> : undefined}
            className='bg-gray-200 text-2xl text-gray-400 shadow-sm'
            size={44}
          />
          <span className='font-semibold text-blue-700 text-lg'>{receiverGroup.name}</span>
        </div>
      ) : null}
      <MessageList messages={messages} currentUserId={senderUserId} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;

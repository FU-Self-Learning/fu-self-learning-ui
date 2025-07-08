import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import moment from 'moment';

interface Props {
  messages: ChatMessage[];
  currentUserId: number;
}

const MessageList: React.FC<Props> = ({ messages, currentUserId }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = endRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (timestamp: string | Date): string => {
    const messageTime = moment(timestamp);
    const now = moment();

    if (messageTime.isSame(now, 'day')) {
      return messageTime.format('HH:mm');
    } else if (messageTime.isSame(now, 'year')) {
      return messageTime.format('MMM D, HH:mm');
    } else {
      return messageTime.format('MMM D, YYYY, HH:mm');
    }
  };

  return (
    <div className='flex flex-col gap-4 p-6 overflow-y-auto flex-1 bg-gradient-to-b from-slate-50/50 to-white/80'>
      {messages.length === 0 ? (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
              </svg>
            </div>
            <p className='text-gray-500'>No messages yet. Start the conversation!</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-lg transition-all duration-200 hover:shadow-xl ${
                  isOwn 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
                    : 'bg-white text-gray-800 border border-gray-200/50 rounded-bl-md'
                }`}
              >
                <div className='break-words'>{msg.message}</div>
                {msg.createdAt && (
                  <div className={`text-xs mt-2 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTimestamp(msg.createdAt)}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;

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
    <div className='flex flex-col gap-3 p-4 overflow-y-auto flex-1 bg-gray-50 rounded-2xl border border-gray-300'>
      {messages.map((msg) => {
        const isOwn = msg.senderId === currentUserId;
        return (
          <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-md ${
                isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'
              }`}
            >
              <div>{msg.message}</div>
              {msg.createdAt && (
                <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
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

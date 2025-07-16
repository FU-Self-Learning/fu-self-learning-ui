import React, { useState } from 'react';

const MessageInput: React.FC<{ onSend: (msg: string) => void }> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className='p-4 border-t border-gray-200/50 bg-white/90 backdrop-blur-sm'>
      <form autoComplete='off' onSubmit={handleSubmit} className='flex items-center gap-3'>
        <input type='text' name='fake-user' autoComplete='username' className='hidden' />

        <input
          type='text'
          name='chat-input'
          id='chat-input'
          autoComplete='off'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type a message...'
          className='text-black flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400 shadow-md transition-all duration-200 bg-gray-50 hover:bg-white'
        />
        <button
          type='submit'
          disabled={!text.trim()}
          className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
            text.trim()
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

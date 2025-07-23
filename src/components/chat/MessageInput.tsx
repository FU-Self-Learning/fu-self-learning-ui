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
    <form
      autoComplete='off'
      onSubmit={handleSubmit}
      className='flex items-center gap-3 p-4 border-t border-blue-100 bg-white rounded-b-2xl'
    >
      <input type='text' name='fake-user' autoComplete='username' className='hidden' />

      <input
        type='text'
        name='chat-input'
        id='chat-input'
        autoComplete='off'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Write something...'
        className='flex-1 px-5 py-3 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-blue-300 shadow-sm bg-blue-50 text-blue-900'
      />
      <button
        type='submit'
        className='w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow transition text-xl cursor-pointer'
        title='Send'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l18-9-18-9v7l15 2-15 2v7z" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;

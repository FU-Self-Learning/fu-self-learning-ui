'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageOutlined,
  SendOutlined,
  LoadingOutlined,
  RobotOutlined,
  UserOutlined,
  BookOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useChatbot } from '@/hooks/useChatbot';
import { useChatbotHistory } from '@/hooks/useChatbot';
import { Button, Input, message as antdMessage, Spin, Tooltip } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/providers/auth/selector/authSelector';
import type { ChatbotCourse } from '@/shared/api/chatbot.api';
import { useRouter } from 'next/navigation';
import { formatChatbotResponse } from '@/utils/formatChatbotResponse';
import ReactMarkdown from 'react-markdown';
import type { HistoryChatResponse } from '@/shared/api/chatbot.api';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  courses?: ChatbotCourse[];
}

// Card gợi ý khoá học UI đơn giản, thân thiện
const CourseSuggestionCard = ({ course }: { course: ChatbotCourse }) => {
  const router = useRouter();
  return (
    <div
      className='cursor-pointer rounded-lg bg-white/95 dark:bg-[#232946]/90 border border-gray-200 dark:border-gray-700 shadow-sm p-3 mb-1 transition-all duration-150 hover:border-blue-400 flex flex-col gap-1'
      onClick={() => router.push(`/course/${course.id}`)}
      title={course.title}
      style={{ minWidth: 0 }}
    >
      <div className='flex items-center gap-2 mb-0.5'>
        <BookOutlined className='text-base text-blue-400' />
        <span
          className='font-semibold text-sm text-gray-900 dark:text-gray-100 truncate'
          style={{ maxWidth: '170px' }}
        >
          {course.title}
        </span>
      </div>
      <div
        className='text-gray-600 dark:text-gray-300 text-xs mb-0.5 line-clamp-2'
        style={{ maxWidth: '210px' }}
      >
        {course.description}
      </div>
      <div className='flex flex-wrap gap-1 mt-0.5'>
        {course?.categories?.map((cat) => (
          <span
            key={cat}
            className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full text-[11px] font-normal'
          >
            <TagOutlined className='text-xs' /> {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

const ChatBotStudent = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);
  const chatbotMutation = useChatbot();
  const user = useSelector(selectAuthUser);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const { data: history } = useChatbotHistory(open && sessionId ? sessionId : undefined);

  // Generate sessionId (uuid or userId)
  useEffect(() => {
    if (user?.id) setSessionId(user.id.toString());
    else setSessionId(uuidv4());
  }, [user?.id]);

  // Khi mở chat lần đầu, load history nếu chưa có messages
  useEffect(() => {
    if (
      open &&
      sessionId &&
      !historyLoaded &&
      history &&
      history.length > 0 &&
      messages.length === 0
    ) {
      setMessages(
        (history as HistoryChatResponse[]).map((msg) => ({
          from: msg.role === 'assistant' ? 'bot' : 'user',
          text: msg.content,
          timestamp: msg.timestamp,
        })),
      );
      setHistoryLoaded(true);
    }
  }, [open, sessionId, history, historyLoaded, messages.length]);

  // Reset historyLoaded khi đóng chat
  useEffect(() => {
    if (!open) setHistoryLoaded(false);
  }, [open]);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    chatbotMutation.mutate(
      { message: input, sessionId },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { from: 'bot', text: data.response, courses: data.courses },
          ]);
        },
        onError: (error) => {
          antdMessage.error(extractErrorMessage(error) || 'Lỗi khi gửi tin nhắn');
          setMessages((prev) => [...prev, { from: 'bot', text: 'Bot gặp sự cố, thử lại sau.' }]);
        },
      },
    );
    setInput('');
  };

  return (
    <div className='fixed z-[1000] bottom-8 right-8 flex flex-col items-end select-none'>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className='w-96 max-w-[95vw] rounded-3xl shadow-2xl border border-blue-300/30 backdrop-blur-xl bg-white/60 dark:bg-[#181c2f]/70 bg-clip-padding flex flex-col overflow-hidden mb-4 relative'
            style={{ boxShadow: '0 8px 40px 0 rgba(60, 80, 180, 0.18)' }}
          >
            {/* Glowing border */}
            <div
              className='absolute inset-0 pointer-events-none rounded-3xl border-2 border-transparent'
              style={{ boxShadow: '0 0 24px 2px #7f9cf5, 0 0 0 2px #a5b4fc' }}
            />
            {/* Header */}
            <div className='relative z-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-6 py-4 flex items-center justify-between shadow-md'>
              <span className='font-extrabold text-xl flex items-center gap-2 drop-shadow-sm'>
                <RobotOutlined className='text-2xl animate-bounce-slow' />
                Trợ lý Studee
              </span>
              <Button
                type='text'
                size='small'
                className='!text-white !hover:bg-blue-600 !rounded-full !p-0 !w-8 !h-8'
                onClick={() => setOpen(false)}
                icon={<span className='text-2xl'>&times;</span>}
                aria-label='Đóng chatbot'
              />
            </div>
            {/* Chat area */}
            <div
              ref={chatRef}
              className='flex-1 px-5 py-4 space-y-3 overflow-y-auto max-h-96 bg-gradient-to-b from-white/80 via-blue-50/60 to-white/60 dark:from-[#232946]/80 dark:via-[#232946]/60 dark:to-[#181c2f]/60'
            >
              {messages.length === 0 && (
                <div className='text-gray-400 text-center mt-10 text-base font-medium'>
                  Hãy đặt câu hỏi cho trợ lý Studee...
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className={`relative px-5 py-3 rounded-2xl max-w-[80%] text-base font-medium shadow-lg transition-all duration-200 ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-md border border-blue-200/40'
                        : 'bg-white/90 dark:bg-[#232946]/90 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-200/40'
                    }`}
                  >
                    <span className='flex items-center gap-2'>
                      {msg.from === 'user' ? (
                        <UserOutlined className='text-lg opacity-70' />
                      ) : (
                        <RobotOutlined className='text-lg text-blue-400 opacity-80 animate-bounce-slow' />
                      )}
                      {msg.from === 'bot' ? (
                        <div className='whitespace-pre-line'>
                          <ReactMarkdown>{formatChatbotResponse(msg.text)}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </span>
                    {/* Hiển thị courses nếu có */}
                    {msg.from === 'bot' && msg.courses && msg.courses.length > 0 && (
                      <div className='mt-3 space-y-2'>
                        <div className='font-semibold text-blue-600 text-sm mb-1 flex items-center gap-2'>
                          <BookOutlined className='text-base' />
                          Gợi ý khoá học phù hợp:
                        </div>
                        <div className='grid gap-2'>
                          {msg.courses.map((course) => (
                            <CourseSuggestionCard key={course.id} course={course} />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
              {chatbotMutation.isPending && (
                <div className='flex justify-start'>
                  <div className='px-5 py-3 rounded-2xl bg-white/90 dark:bg-[#232946]/90 text-gray-800 dark:text-gray-100 shadow-lg text-base font-medium flex items-center gap-2 border border-gray-200/40 animate-pulse'>
                    <Spin indicator={<LoadingOutlined spin />} size='small' /> Đang trả lời...
                  </div>
                </div>
              )}
            </div>
            {/* Input area */}
            <div className='relative z-10 flex items-center gap-2 px-5 py-4 border-t border-blue-100/60 bg-white/70 dark:bg-[#181c2f]/80'>
              <Input
                className='flex-1 rounded-full !bg-white/80 !border-blue-200/60 !shadow-inner !text-base !py-2 !px-4 focus:!border-blue-400 focus:!ring-2 focus:!ring-blue-200/40 transition-all duration-200'
                placeholder='Nhập câu hỏi...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleSend}
                disabled={chatbotMutation.isPending}
                autoFocus={open}
                maxLength={500}
              />
              <Tooltip title='Gửi' placement='top'>
                <Button
                  type='primary'
                  shape='circle'
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={!input.trim() || chatbotMutation.isPending}
                  className='!bg-gradient-to-r !from-blue-500 !to-purple-500 !border-none !shadow-lg hover:!from-blue-600 hover:!to-indigo-600 !text-white !text-xl transition-all duration-200 focus:!ring-2 focus:!ring-blue-200/40'
                  style={{ boxShadow: '0 2px 12px 0 #7f9cf5' }}
                  aria-label='Gửi'
                />
              </Tooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating open button with glowing and floating animation */}
      <motion.button
        whileHover={{ scale: 1.08, boxShadow: '0 0 16px 4px #7f9cf5', cursor: 'pointer' }}
        whileTap={{ scale: 0.97 }}
        className='bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-full shadow-2xl p-5 flex items-center justify-center text-3xl focus:outline-none border-4 border-white/80 drop-shadow-xl'
        style={{ boxShadow: '0 4px 32px 0 #7f9cf5' }}
        onClick={() => setOpen((v) => !v)}
        aria-label='Mở trợ lý Studee'
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 1,
          y: [0, -8, 0],
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <MessageOutlined className='drop-shadow-lg' />
      </motion.button>
    </div>
  );
};

export default ChatBotStudent;

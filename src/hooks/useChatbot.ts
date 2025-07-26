import { useMutation, useQuery } from '@tanstack/react-query';
import {
  sendChatbotMessage,
  getChatbotHistory,
  ChatbotResponse,
  HistoryChatResponse,
} from '@/shared/api/chatbot.api';

interface ChatbotMutationVariables {
  message: string;
  sessionId?: string;
}

export const useChatbot = () => {
  return useMutation<ChatbotResponse, unknown, ChatbotMutationVariables>({
    mutationFn: ({ message, sessionId }) => sendChatbotMessage(message, sessionId),
  });
};

export const useChatbotHistory = (sessionId?: string) => {
  return useQuery<HistoryChatResponse[]>({
    queryKey: ['chatbotHistory', sessionId],
    queryFn: () => getChatbotHistory(sessionId),
    enabled: !!sessionId,
  });
};

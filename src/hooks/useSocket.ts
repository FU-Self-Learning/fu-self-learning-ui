import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import type { Socket } from '@/types/socket.type';
import { SOCKET_URL_BASE } from '@/shared/constants/apiConstants';

export const useSocket = (userId: number) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const SOCKET_URL = SOCKET_URL_BASE + '/chat';
  useEffect(() => {
    const newSocket = io(`${SOCKET_URL}`, {
      path: '/socket.io',
      transports: ['websocket'],
      query: { userId: userId },
      autoConnect: true,
      forceNew: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
};

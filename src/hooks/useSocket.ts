import { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "@/types/socket.type";

export const useSocket = (userId: number) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      path: "/socket.io",
      transports: ["websocket"],
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

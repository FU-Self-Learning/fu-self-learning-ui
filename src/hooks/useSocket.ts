import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "@/types/socket.type";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: true,
      forceNew: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

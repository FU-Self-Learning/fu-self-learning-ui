import io from "socket.io-client";

export const connectSocketIO = () => {
  const socket = io(process.env.NEXT_PUBLIC_API_URL as string);
  return socket;
};

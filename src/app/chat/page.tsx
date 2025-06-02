"use client";

import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { RootState } from "@/providers/store";
import ChatBox from "@/app/chat/ChatBox";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");
  const receiverUserId = userParam ? parseInt(userParam, 10) : null;

  const currentUser = useSelector((state: RootState) => state.auth.user);

  if (!currentUser || !receiverUserId) {
    return <div className="p-6 text-center text-gray-500">Loading chat...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Realtime</h2>
      <ChatBox
        senderUserId={Number(currentUser.id)}
        receiverUserId={receiverUserId}
      />
    </div>
  );
}

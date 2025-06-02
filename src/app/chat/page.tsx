"use client";

import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { RootState } from "@/providers/store";
import ChatBox from "@/app/chat/ChatBox";
import UserList from "@/components/chat/UserList";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");
  const receiverUserId = userParam ? parseInt(userParam, 10) : null;

  const currentUser = useSelector((state: RootState) => state.auth.user);

  if (!currentUser) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-6rem)]">
      <UserList currentUserId={Number(currentUser.id)} />
      <div className="flex-1 p-4">
        {receiverUserId ? (
          <ChatBox
            senderUserId={Number(currentUser.id)}
            receiverUserId={receiverUserId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

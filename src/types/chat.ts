export interface ChatPayload {
  senderUserId: number;
  receiverUserId: number;
  message: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
}

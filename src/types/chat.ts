export interface ChatPayload {
  senderUserId: number;
  receiverUserId: number;
  message: string;
}

export interface ChatMessage {
  id: number;
  senderUserId: number;
  receiverUserId: number;
  message: string;
  createdAt: string;
}

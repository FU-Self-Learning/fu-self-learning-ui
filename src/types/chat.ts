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
  sender?: {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string | null;
    dob?: string | null;
    avatarUrl?: string | null;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

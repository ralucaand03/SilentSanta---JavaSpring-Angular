export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  timestamp: Date;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}
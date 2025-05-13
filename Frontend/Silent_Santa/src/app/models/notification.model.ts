export interface Notification {
  id: string
  message: string
  userId: string
  timestamp: Date
  type: "CHAT_MESSAGE" | "REQUEST_UPDATE" | "SYSTEM"
  read?: boolean
}

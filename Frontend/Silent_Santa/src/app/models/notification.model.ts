export interface Notification { 
  type: "CHAT_MESSAGE" | "REQUEST_UPDATE" | "SYSTEM"
  userId: string
  letterTitle: string
  status: "ACCEPTED" | "WAITING"| "DENIED"
  timestamp: number
   
}

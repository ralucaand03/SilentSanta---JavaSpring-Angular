import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { Client, IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { AuthService } from "./auth.service"
import { HttpClient } from "@angular/common/http"
import { ChatMessage } from "../models/chat-message.model"
import { Notification } from "../models/notification.model"

const API_URL = "http://localhost:8080"

@Injectable({
  providedIn: "root",
})
export class WebsocketService {
  private client: Client
  private messageSubject = new BehaviorSubject<ChatMessage[]>([])
  private notificationSubject = new BehaviorSubject<Notification[]>([])
  private connectedSubject = new BehaviorSubject<boolean>(false)

  public messages$ = this.messageSubject.asObservable()
  public notifications$ = this.notificationSubject.asObservable()
  public connected$ = this.connectedSubject.asObservable()

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.client = new Client({
      // Use SockJS for WebSocket connection
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    this.client.onConnect = this.onConnect.bind(this)
    this.client.onDisconnect = this.onDisconnect.bind(this)
    this.client.onStompError = this.onError.bind(this)
  }

  public connect(): void {
    if (!this.client.active) {
      this.client.activate()
    }
  }

  public disconnect(): void {
    if (this.client.active) {
      this.client.deactivate()
    }
    this.messageSubject.next([])
    this.notificationSubject.next([])
    this.connectedSubject.next(false)
  }

  private onConnect(): void {
    console.log("WebSocket connection established")
    this.connectedSubject.next(true)

    const userId = this.authService.getCurrentUser()?.id
    if (userId) {
      // Subscribe to user-specific notifications
      this.client.subscribe(`/user/${userId}/queue/notifications`, this.onNotificationReceived.bind(this))
      this.client.subscribe(`/user/${userId}/queue/chat`, this.onMessageReceived.bind(this))
    }

    // Subscribe to broadcast notifications
    this.client.subscribe("/topic/notifications", this.onNotificationReceived.bind(this))
  }

  private onDisconnect(): void {
    console.log("WebSocket connection closed")
    this.connectedSubject.next(false)
  }

  private onError(error: any): void {
    console.error("WebSocket error:", error)
  }

  private onMessageReceived(message: IMessage): void {
    try {
      const chatMessage: ChatMessage = JSON.parse(message.body)
      // Prevent duplicate messages
      this.messageSubject.next([...this.messageSubject.value, chatMessage])
    } catch (error) {
      console.error("Error parsing chat message:", error)
    }
  }

  private onNotificationReceived(message: IMessage): void {
    try {
      const notification: Notification = JSON.parse(message.body)
      // Prevent duplicate notifications
      this.notificationSubject.next([...this.notificationSubject.value, notification])
    } catch (error) {
      console.error("Error parsing notification:", error)
    }
  }

  // Send notifications to the specific user
  public sendNotification(notification: Notification): void {
    if (this.client.active) {
      this.client.publish({
        destination: "/sendMessage",
        body: JSON.stringify(notification),
      })
    }
  }

  // Send broadcast notifications to all users
  public sendBroadcastNotification(notification: Notification): void {
    if (this.client.active) {
      this.client.publish({
        destination: "/sendBroadcast",
        body: JSON.stringify(notification),
      })
    }
  }

  // Send a chat message
  public sendMessage(message: ChatMessage): void {
    if (this.client.active) {
      this.client.publish({
        destination: "/chat.sendMessage",
        body: JSON.stringify(message),
      })
    }
  }

  // Get chat history between two users
  public getChatHistory(userId1: string, userId2: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${API_URL}/api/chat/history/${userId1}/${userId2}`)
  }
}

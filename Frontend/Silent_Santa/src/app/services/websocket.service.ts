// import { Injectable } from "@angular/core"
// import { BehaviorSubject, Observable } from "rxjs"
// import { Client, IMessage, StompSubscription } from "@stomp/stompjs"
// import SockJS from "sockjs-client"
// import { AuthService } from "./auth.service"
// import { HttpClient } from "@angular/common/http"
// import { ChatMessage } from "../models/chat-message.model"
// import { Notification } from "../models/notification.model"

// const API_URL = "http://localhost:8080"

// @Injectable({
//   providedIn: "root",
// })
// export class WebsocketService {
//   private client: Client = new Client
//   private messageSubject = new BehaviorSubject<ChatMessage[]>([])
//   private notificationSubject = new BehaviorSubject<Notification[]>([])
//   private connectedSubject = new BehaviorSubject<boolean>(false)
//   private subscriptions: StompSubscription[] = []
//   private reconnectAttempts = 0
//   private maxReconnectAttempts = 5

//   public messages$ = this.messageSubject.asObservable()
//   public notifications$ = this.notificationSubject.asObservable()
//   public connected$ = this.connectedSubject.asObservable()

//   constructor(
//     private authService: AuthService,
//     private http: HttpClient,
//   ) {
//     console.log("WebsocketService: Initializing")
//     this.setupStompClient()
//   }

//   private setupStompClient(): void {
//     console.log("WebsocketService: Setting up STOMP client")
//     this.client = new Client({
//       webSocketFactory: () => new SockJS(`${API_URL}/ws`),
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       debug: (msg) => {
//         if (msg.includes("error") || msg.includes("failed")) {
//           console.error("STOMP Debug:", msg)
//         } else {
//           console.log("STOMP Debug:", msg)
//         }
//       }
//     })

//     this.client.onConnect = this.onConnect.bind(this)
//     this.client.onDisconnect = this.onDisconnect.bind(this)
//     this.client.onStompError = this.onError.bind(this)
//     this.client.onWebSocketClose = this.onWebSocketClose.bind(this)
//   }

//   public connect(): void {
//     const user = this.authService.getCurrentUser()
//     if (!user) {
//       console.warn("WebsocketService: Cannot connect, no user logged in")
//       return
//     }

//     console.log("WebsocketService: Connecting with user:", user.id)
    
//     if (!this.client.active) {
//       console.log("WebsocketService: Activating client")
//       this.client.activate()
//     } else {
//       console.log("WebsocketService: Client already active")
//     }
//   }

//   public disconnect(): void {
//     console.log("WebsocketService: Disconnecting")
    
//     // Clear all subscriptions
//     this.clearSubscriptions()
    
//     if (this.client.active) {
//       this.client.deactivate()
//     }
    
//     this.messageSubject.next([])
//     this.notificationSubject.next([])
//     this.connectedSubject.next(false)
//     this.reconnectAttempts = 0
//   }

//   private clearSubscriptions(): void {
//     console.log("WebsocketService: Clearing subscriptions")
//     this.subscriptions.forEach(subscription => {
//       try {
//         if (subscription && subscription.id) {
//           console.log("WebsocketService: Unsubscribing from", subscription.id)
//           subscription.unsubscribe()
//         }
//       } catch (err) {
//         console.error("Error unsubscribing:", err)
//       }
//     })
//     this.subscriptions = []
//   }

//   private onConnect(): void {
//     console.log("WebsocketService: Connected successfully")
//     this.connectedSubject.next(true)
//     this.reconnectAttempts = 0

//     // Clear previous subscriptions
//     this.clearSubscriptions()

//     const userId = this.authService.getCurrentUser()?.id
//     if (userId) {
//       console.log(`WebsocketService: Subscribing for user ${userId}`)
      
//       // Subscribe to user-specific notifications
//       const userNotificationSub = this.client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
//         console.log("WebsocketService: Received user notification:", message)
//         this.onNotificationReceived(message)
//       })
//       this.subscriptions.push(userNotificationSub)
      
//       // Subscribe to user-specific chat messages
//       const chatSub = this.client.subscribe(`/user/${userId}/queue/chat`, (message) => {
//         console.log("WebsocketService: Received chat message:", message)
//         this.onMessageReceived(message)
//       })
//       this.subscriptions.push(chatSub)
//     }

//     // Subscribe to broadcast notifications
//     const broadcastSub = this.client.subscribe("/topic/notifications", (message) => {
//       console.log("WebsocketService: Received broadcast notification:", message)
//       this.onNotificationReceived(message)
//     })
//     this.subscriptions.push(broadcastSub)
    
//     // Send a test message to verify connectivity
//     //this.sendTestMessage()
//   }

//   private sendTestMessage(): void {
//     const userId = this.authService.getCurrentUser()?.id
//     if (!userId) return
    
//     console.log("WebsocketService: Sending test message to verify connection")
//     // Request a test notification from the server
//     this.http.get(`${API_URL}/api/debug/test-notification/${userId}`).subscribe({
//       next: (response) => console.log("Test notification response:", response),
//       error: (err) => console.error("Error requesting test notification:", err)
//     })
//   }

//   private onDisconnect(): void {
//     console.log("WebsocketService: Disconnected")
//     this.connectedSubject.next(false)
//   }

//   private onWebSocketClose(event: CloseEvent): void {
//     console.log("WebsocketService: WebSocket closed", event)
//     this.connectedSubject.next(false)
    
//     // Attempt to reconnect if not a normal closure
//     if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
//       this.reconnectAttempts++
//       console.log(`WebsocketService: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
//       setTimeout(() => {
//         console.log("WebsocketService: Reconnecting...")
//         this.disconnect()
//         this.setupStompClient()
//         this.connect()
//       }, 3000) // Wait 3 seconds before reconnecting
//     }
//   }

//   private onError(error: any): void {
//     console.error("WebsocketService: STOMP error:", error)
//   }

//   private onMessageReceived(message: IMessage): void {
//     try {
//       const chatMessage: ChatMessage = JSON.parse(message.body)
//       console.log("WebsocketService: Processed chat message:", chatMessage)
//       this.messageSubject.next([...this.messageSubject.value, chatMessage])
//     } catch (error) {
//       console.error("WebsocketService: Error parsing chat message:", error)
//     }
//   }

//   private onNotificationReceived(message: IMessage): void {
//     console.log("WebsocketService: Processing notification message body:", message.body)
//     try {
//       const notification: Notification = JSON.parse(message.body)
//       console.log("WebsocketService: Parsed notification:", notification)
      
//       // Check if this is a duplicate notification
//       const existingNotifications = this.notificationSubject.value
//       const isDuplicate = existingNotifications.some(n => n.id === notification.id)
      
//       if (!isDuplicate) {
//         console.log("WebsocketService: Adding new notification to list")
//         this.notificationSubject.next([...existingNotifications, notification])
//       } else {
//         console.log("WebsocketService: Ignoring duplicate notification")
//       }
//     } catch (error) {
//       console.error("WebsocketService: Error parsing notification:", error)
//     }
//   }

//   public sendNotification(notification: Notification): void {
//     if (!this.client.active) {
//       console.warn("WebsocketService: Client not active, can't send notification")
//       return
//     }
    
//     console.log("WebsocketService: Sending notification:", notification)
//     this.client.publish({
//       destination: "/app/sendMessage",
//       body: JSON.stringify(notification),
//     })
//   }

//   public sendBroadcastNotification(notification: Notification): void {
//     if (!this.client.active) {
//       console.warn("WebsocketService: Client not active, can't send broadcast")
//       return
//     }
    
//     console.log("WebsocketService: Sending broadcast notification:", notification)
//     this.client.publish({
//       destination: "/app/sendBroadcast",
//       body: JSON.stringify(notification),
//     })
//   }

//   public sendMessage(message: ChatMessage): void {
//     if (!this.client.active) {
//       console.warn("WebsocketService: Client not active, can't send message")
//       return
//     }
    
//     console.log("WebsocketService: Sending chat message:", message)
//     this.client.publish({
//       destination: "/app/chat.sendMessage",
//       body: JSON.stringify(message),
//     })
//   }

//   public getChatHistory(userId1: string, userId2: string): Observable<ChatMessage[]> {
//     return this.http.get<ChatMessage[]>(`${API_URL}/api/chat/history/${userId1}/${userId2}`)
//   }
// }
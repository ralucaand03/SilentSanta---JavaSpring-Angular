import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { WebsocketService } from "./websocket.service"
import { Notification } from "../models/notification.model"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  // Expose these as protected for easier access in tests and debugging
  protected notificationsSubject = new BehaviorSubject<Notification[]>([])
  public notifications$ = this.notificationsSubject.asObservable()
  
  protected unreadCount = 0
  protected unreadCountSubject = new BehaviorSubject<number>(0)
  public unreadCount$ = this.unreadCountSubject.asObservable()

  constructor(
    private websocketService: WebsocketService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    console.log("NotificationService: initializing")
    
    // Initialize WebSocket connection
    this.websocketService.connect()

    // Subscribe to notifications from WebSocket service with better logging
    this.websocketService.notifications$.subscribe((newNotifications) => {
      console.log("NotificationService: Received notifications from WebSocket:", newNotifications)
      
      if (newNotifications.length > 0) {
        const currentNotifications = this.notificationsSubject.value
        const latestNotification = newNotifications[newNotifications.length - 1]
        
        // Make sure the notification is for the current user
        const currentUserId = this.authService.getCurrentUser()?.id
        console.log(`NotificationService: Current User ID: ${currentUserId}, Notification User ID: ${latestNotification.userId}`)
        
        // Only process notifications meant for this user
        if (latestNotification.userId === currentUserId || latestNotification.userId === "broadcast") {
          // Check if this notification is already in our list
          if (!currentNotifications.some((n) => n.id === latestNotification.id)) {
            console.log("NotificationService: Adding new notification to list:", latestNotification)
            
            const updatedNotifications = [...currentNotifications, latestNotification]
            this.notificationsSubject.next(updatedNotifications)
            
            // Update unread count
            this.unreadCount++
            this.unreadCountSubject.next(this.unreadCount)
            
            // Show snackbar for new notification
            this.showNotificationSnackbar(latestNotification)
          } else {
            console.log("NotificationService: Notification already exists in list, skipping")
          }
        } else {
          console.log("NotificationService: Notification not for current user, skipping")
        }
      }
    })
    
    // Monitor WebSocket connection status
    this.websocketService.connected$.subscribe(connected => {
      console.log(`NotificationService: WebSocket connection status: ${connected ? 'connected' : 'disconnected'}`)
    })
  }

  private showNotificationSnackbar(notification: Notification): void {
    console.log("NotificationService: Showing snackbar for notification:", notification.message)
    
    this.snackBar.open(notification.message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ["notification-snackbar", `notification-${notification.type.toLowerCase()}`],
    })
  }

  public markAsRead(notificationId: string): void {
    console.log("NotificationService: Marking notification as read:", notificationId)
    
    const currentNotifications = this.notificationsSubject.value
    const updatedNotifications = currentNotifications.map((n) => {
      if (n.id === notificationId && !n.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1)
        this.unreadCountSubject.next(this.unreadCount)
        return { ...n, read: true }
      }
      return n
    })

    this.notificationsSubject.next(updatedNotifications)
  }

  public markAllAsRead(): void {
    console.log("NotificationService: Marking all notifications as read")
    
    const currentNotifications = this.notificationsSubject.value
    const updatedNotifications = currentNotifications.map((n) => ({ ...n, read: true }))

    this.notificationsSubject.next(updatedNotifications)
    this.unreadCount = 0
    this.unreadCountSubject.next(0)
  }

  public clearNotifications(): void {
    console.log("NotificationService: Clearing all notifications")
    
    this.notificationsSubject.next([])
    this.unreadCount = 0
    this.unreadCountSubject.next(0)
  }

  public sendNotification(notification: Notification): void {
    console.log("NotificationService: Sending notification:", notification)
    this.websocketService.sendNotification(notification)
  }

  public sendBroadcastNotification(notification: Notification): void {
    console.log("NotificationService: Sending broadcast notification:", notification)
    this.websocketService.sendBroadcastNotification(notification)
  }
  
  // Add method to manually add a notification (for testing)
  public addTestNotification(message: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.warn("NotificationService: Cannot add test notification, no user logged in");
      return;
    }
    
    const notification: Notification = {
      id: crypto.randomUUID(),
      message: message,
      userId: currentUser.id,
      timestamp: new Date(),
      type: "SYSTEM",
      read: false
    };
    
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    
    this.unreadCount++;
    this.unreadCountSubject.next(this.unreadCount);
    
    this.showNotificationSnackbar(notification);
  }
}
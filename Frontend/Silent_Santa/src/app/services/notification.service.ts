import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import   { WebsocketService } from "./websocket.service"
import   { Notification } from "../models/notification.model"
import   { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([])
  public notifications$ = this.notificationsSubject.asObservable()
  private unreadCount = 0
  private unreadCountSubject = new BehaviorSubject<number>(0)
  public unreadCount$ = this.unreadCountSubject.asObservable()

  constructor(
    private websocketService: WebsocketService,
    private snackBar: MatSnackBar,
  ) {
    // Initialize WebSocket connection
    this.websocketService.connect()

    // Subscribe to notifications from WebSocket service
    this.websocketService.notifications$.subscribe((newNotifications) => {
      if (newNotifications.length > 0) {
        const currentNotifications = this.notificationsSubject.value
        const latestNotification = newNotifications[newNotifications.length - 1]

        // Check if this notification is already in our list
        if (!currentNotifications.some((n) => n.id === latestNotification.id)) {
          const updatedNotifications = [...currentNotifications, latestNotification]
          this.notificationsSubject.next(updatedNotifications)

          // Update unread count
          this.unreadCount++
          this.unreadCountSubject.next(this.unreadCount)

          // Show snackbar for new notification
          this.showNotificationSnackbar(latestNotification)
        }
      }
    })
  }

  private showNotificationSnackbar(notification: Notification): void {
    this.snackBar.open(notification.message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ["notification-snackbar", `notification-${notification.type.toLowerCase()}`],
    })
  }

  public markAsRead(notificationId: string): void {
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
    const currentNotifications = this.notificationsSubject.value
    const updatedNotifications = currentNotifications.map((n) => ({ ...n, read: true }))

    this.notificationsSubject.next(updatedNotifications)
    this.unreadCount = 0
    this.unreadCountSubject.next(0)
  }

  public clearNotifications(): void {
    this.notificationsSubject.next([])
    this.unreadCount = 0
    this.unreadCountSubject.next(0)
  }

  public sendNotification(notification: Notification): void {
    this.websocketService.sendNotification(notification)
  }

  public sendBroadcastNotification(notification: Notification): void {
    this.websocketService.sendBroadcastNotification(notification)
  }
}

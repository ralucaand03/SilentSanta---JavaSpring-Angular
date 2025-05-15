import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { BehaviorSubject, type Subscription } from "rxjs"
 
import { WebSocketNotif  } from "../services/websocketnotif.service"
import { AuthService } from "../services/auth.service"
 
// Updated Notification model
export interface Notification {
  type: "CHAT_MESSAGE" | "REQUEST_UPDATE" | "SYSTEM"
  userId: string
  letterTitle: string
  status: "ACCEPTED" | "WAITING" | "DENIED"
  timestamp: number
}

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private websocketNotificationSubscription: Subscription | null = null
  private unreadCountSubject = new BehaviorSubject<number>(0)

  notifications: Notification[] = []
  showNotifications = false
  isConnected = false
  viewedNotifications: Set<string> = new Set() // Track viewed notifications by unique identifier

  constructor(
    private websocketNotifService: WebSocketNotif,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Check user is logged in
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      console.warn("NotificationComponent: No user is logged in")
    } else {
      console.log("NotificationComponent: User logged in with ID:", currentUser.id)
    }

    // Subscribe to notifications from the WebSocketNotifService
    this.websocketNotificationSubscription = this.websocketNotifService.notifications$.subscribe((notification) => {
      if (notification) {
        console.log("NotificationComponent: Received new notification:", notification)
        // Add the new notification to the list
        this.notifications = [notification, ...this.notifications]
        // Update unread count
        this.updateUnreadCount()
      }
    })

    // Ensure WebSocket is connected
    this.websocketNotifService.connect()
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: MouseEvent): void {
    if (this.showNotifications && !(event.target as HTMLElement).closest(".notification-bell")) {
      this.showNotifications = false
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications
    if (this.showNotifications && this.unreadCount > 0) {
      // Only mark as read when opening the dropdown
      this.markAllAsRead()
    }
  }

  // Create a unique identifier for a notification
  private getNotificationIdentifier(notification: Notification): string {
    return `${notification.userId}-${notification.type}-${notification.letterTitle}-${notification.timestamp}`
  }

  // Mark a notification as viewed
  markAsViewed(notification: Notification): void {
    const id = this.getNotificationIdentifier(notification)
    console.log("Marking notification as viewed:", id)
    this.viewedNotifications.add(id)
    this.updateUnreadCount()
  }

  // Mark all notifications as viewed
  markAllAsRead(): void {
    console.log("Marking all notifications as viewed")
    this.notifications.forEach((notification) => {
      this.viewedNotifications.add(this.getNotificationIdentifier(notification))
    })
    this.updateUnreadCount()
  }

  // Update the unread count based on viewed notifications
  private updateUnreadCount(): void {
    const unreadCount = this.notifications.filter(
      (notification) => !this.viewedNotifications.has(this.getNotificationIdentifier(notification)),
    ).length
    this.unreadCountSubject.next(unreadCount)
  }

  // Check if a notification has been viewed
  isViewed(notification: Notification): boolean {
    return this.viewedNotifications.has(this.getNotificationIdentifier(notification))
  }

  // Get unread count
  get unreadCount(): number {
    return this.unreadCountSubject.value
  }

  // Get appropriate icon based on notification type
  getNotificationIcon(type: string): string {
    switch (type) {
      case "CHAT_MESSAGE":
        return "message-circle"
      case "REQUEST_UPDATE":
        return "file-text"
      case "SYSTEM":
        return "bell"
      default:
        return "info"
    }
  }

  // Get appropriate status class
  getStatusClass(status: string): string {
    switch (status) {
      case "ACCEPTED":
        return "status-accepted"
      case "WAITING":
        return "status-waiting"
      case "DENIED":
        return "status-denied"
      default:
        return ""
    }
  }

  // Format timestamp to readable date
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString()
  }

  reconnectWebsocket(): void {
    console.log("Manually reconnecting WebSocket")
    this.websocketNotifService.disconnect()
    setTimeout(() => this.websocketNotifService.connect(), 500)
  }

  ngOnDestroy(): void {
    console.log("NotificationComponent: Destroying component")
    this.websocketNotificationSubscription?.unsubscribe()
  }
}

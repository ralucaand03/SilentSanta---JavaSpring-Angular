import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import   { NotificationService } from "../services/notification.service"
import   { Notification } from "../models/notification.model"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import   { Subscription } from "rxjs"

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private notificationsSubscription: Subscription | null = null
  private unreadCountSubscription: Subscription | null = null
  notifications: Notification[] = []
  unreadCount = 0
  showNotifications = false

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.notificationsSubscription = this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications
    })

    // Subscribe to unread count
    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count
    })

    // Add some test notifications if needed
    // this.addTestNotifications();
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

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id)
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead()
  }

  // For testing purposes
  private addTestNotifications(): void {
    if (this.notifications.length === 0) {
      const testNotification: Notification = {
        id: "1",
        message: "Welcome to Silent Santa!",
        userId: "123",
        timestamp: new Date(),
        type: "SYSTEM",
        read: false,
      }

      this.notificationService["notificationsSubject"].next([testNotification])
      this.notificationService["unreadCountSubject"].next(1)
    }
  }

  ngOnDestroy(): void {
    this.notificationsSubscription?.unsubscribe()
    this.unreadCountSubscription?.unsubscribe()
  }
}

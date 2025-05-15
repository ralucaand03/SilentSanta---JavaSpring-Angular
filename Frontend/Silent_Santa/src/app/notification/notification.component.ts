// 1. Update the notification.component.ts to add debugging and ensure proper initialization

import { Component, OnInit, OnDestroy, HostListener } from "@angular/core"
import { NotificationService } from "../services/notification.service"
import { Notification } from "../models/notification.model"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Subscription } from "rxjs"
import { AuthService } from "../services/auth.service"
import { WebsocketService } from "../services/websocket.service"

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
  private websocketConnectionSubscription: Subscription | null = null
  
  notifications: Notification[] = []
  unreadCount = 0
  showNotifications = false
  isConnected = false

  constructor(
    private notificationService: NotificationService, 
    private websocketService: WebsocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check user is logged in
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.warn('NotificationComponent: No user is logged in');
    } else {
      console.log('NotificationComponent: User logged in with ID:', currentUser.id);
    }
    
    // Subscribe to websocket connection status
    this.websocketConnectionSubscription = this.websocketService.connected$.subscribe(connected => {
      console.log('WebSocket connection status:', connected ? 'connected' : 'disconnected');
      this.isConnected = connected;
      
      // If connection is established, ensure we're properly subscribed
      if (connected) {
        // Force reconnect to ensure proper subscriptions
        this.websocketService.disconnect();
        setTimeout(() => this.websocketService.connect(), 500);
      }
    });
    
    // Subscribe to notifications
    this.notificationsSubscription = this.notificationService.notifications$.subscribe((notifications) => {
      console.log('NotificationComponent: Received notifications update:', notifications);
      this.notifications = notifications;
    });

    // Subscribe to unread count
    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe((count) => {
      console.log('NotificationComponent: Unread count updated:', count);
      this.unreadCount = count;
    });

    // Ensure WebSocket is connected
    this.websocketService.connect();
    
    // Add a test notification after a delay to verify the component works
    setTimeout(() => this.addTestNotification(), 3000);
  }

  addTestNotification(): void {
    const testNotification: Notification = {
      id: crypto.randomUUID(),
      message: "This is a test notification",
      userId: this.authService.getCurrentUser()?.id || "unknown",
      timestamp: new Date(),
      type: "SYSTEM",
      read: false,
    };
    
    console.log('Adding test notification:', testNotification);
    this.notificationService['notificationsSubject'].next([
      ...this.notificationService['notificationsSubject'].value,
      testNotification
    ]);
    
    // Update unread count
    const currentCount = this.notificationService['unreadCountSubject'].value;
    this.notificationService['unreadCountSubject'].next(currentCount + 1);
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
    console.log('Marking notification as read:', notification.id);
    this.notificationService.markAsRead(notification.id)
  }

  markAllAsRead(): void {
    console.log('Marking all notifications as read');
    this.notificationService.markAllAsRead()
  }

  reconnectWebsocket(): void {
    console.log('Manually reconnecting WebSocket');
    this.websocketService.disconnect();
    setTimeout(() => this.websocketService.connect(), 500);
  }

  ngOnDestroy(): void {
    console.log('NotificationComponent: Destroying component');
    this.notificationsSubscription?.unsubscribe()
    this.unreadCountSubscription?.unsubscribe()
    this.websocketConnectionSubscription?.unsubscribe()
  }
}
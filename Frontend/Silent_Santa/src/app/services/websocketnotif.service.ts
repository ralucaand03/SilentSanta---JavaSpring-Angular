import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { Client, Message, StompConfig } from '@stomp/stompjs';
import SockJS from "sockjs-client"
import { AuthService } from "./auth.service"
import { HttpClient } from "@angular/common/http"
import { ChatMessage } from "../models/chat-message.model"
import { Notification } from "../models/notification.model"
 
@Injectable({ providedIn: 'root' })
export class WebSocketNotif {
    private client: Client;
    private notificationSubject = new BehaviorSubject<Notification | null>(null) 
    private connected = false;
    private userId: string | null = null;

    constructor(private userService: AuthService) {
        const stompConfig: StompConfig = {
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (msg: string) => {
                console.log('[STOMP]', msg);
            },
            reconnectDelay: 5000
        };

        this.client = new Client(stompConfig);
        this.client.onConnect = (frame) => this.onConnected(frame);
        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Details: ' + frame.body);
        };

        this.userService.currentUserSubject.subscribe(user => {
            if (user && user.id) {
                this.userId = user.id;
                this.connect();
            } else {
                this.userId = null;
                this.disconnect();
            }
        });
    }

    public connect() {
        if (!this.connected && !this.client.active) {
            this.client.activate();
        }
    }

    public disconnect() {
        if (this.client.active) {
            this.client.deactivate();
            this.connected = false;
        }
    }

    private onConnected(frame: any) {
        this.connected = true;
        console.log('Connected to WebSocket');

        if (this.userId) {
            console.log(`Subscribing to user-specific topic: /topic/user/${this.userId}/notifications`);

            this.client.subscribe(`/topic/user/${this.userId}/notifications`, (msg: Message) => {
                try {
                    console.log(`Received message on user topic: ${msg.body}`);
                    const notification = JSON.parse(msg.body) as Notification;
                    this.notificationSubject.next(notification);
                } catch (e) {
                    console.error('Error parsing user notification:', e);
                }
            });

            this.client.publish({
                destination: `/app/user/${this.userId}/subscribe`,
                body: JSON.stringify({ userId: this.userId })
            });
        }

        const isAdmin = this.userService.isAdmin();
        if (isAdmin) {
            console.log('Admin subscribing to general notifications topic');

            this.client.subscribe('/topic/notifications', (msg: Message) => {
                try {
                    console.log(`Admin received general notification: ${msg.body}`);
                    const notification = JSON.parse(msg.body) as Notification;
                    this.notificationSubject.next(notification);
                } catch (e) {
                    console.error('Error parsing notification:', e);
                }
            });
        }
    }

    public get notifications$(): Observable<Notification | null> {
        return this.notificationSubject.asObservable();
    }

    public sendMessage(msg: string) {
        if (this.connected) {
            this.client.publish({
                destination: '/app/sendMessage',
                body: msg
            });
        } else {
            console.warn('Cannot send message: WebSocket not connected');
        }
    }

}
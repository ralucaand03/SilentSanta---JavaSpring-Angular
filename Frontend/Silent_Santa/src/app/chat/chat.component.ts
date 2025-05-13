import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebsocketService, ChatMessage } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() recipientId: string;
  @Input() recipientName: string;
  
  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  private messageSubscription: Subscription;
  private connectedSubscription: Subscription;
  isConnected = false;
  currentUserId: string;
  currentUserName: string;

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService,
    private fb: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId = currentUser.id;
      this.currentUserName = currentUser.name;
      
      // Connect to WebSocket
      this.websocketService.connect();
      
      // Subscribe to connection status
      this.connectedSubscription = this.websocketService.connected$.subscribe(
        connected => {
          this.isConnected = connected;
          if (connected) {
            this.loadChatHistory();
          }
        }
      );
      
      // Subscribe to new messages
      this.messageSubscription = this.websocketService.messages$.subscribe(
        newMessages => {
          // Filter messages for this conversation
          const relevantMessages = newMessages.filter(
            msg => (msg.senderId === this.recipientId && msg.recipientId === this.currentUserId) ||
                   (msg.senderId === this.currentUserId && msg.recipientId === this.recipientId)
          );
          
          if (relevantMessages.length > 0) {
            this.messages = [...this.messages, ...relevantMessages];
            // Scroll to bottom after new messages
            setTimeout(() => this.scrollToBottom(), 100);
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe();
    }
  }

  loadChatHistory(): void {
    if (this.currentUserId && this.recipientId) {
      this.websocketService.getChatHistory(this.currentUserId, this.recipientId)
        .subscribe({
          next: (history) => {
            this.messages = history;
            // Scroll to bottom after loading history
            setTimeout(() => this.scrollToBottom(), 100);
          },
          error: (error) => {
            console.error('Error loading chat history:', error);
          }
        });
    }
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.isConnected) {
      const content = this.messageForm.get('message')?.value;
      
      const message: ChatMessage = {
        id: '', // Will be set by server
        content: content,
        senderId: this.currentUserId,
        senderName: this.currentUserName,
        recipientId: this.recipientId,
        timestamp: new Date(),
        type: 'CHAT'
      };
      
      this.websocketService.sendMessage(message);
      
      // Add message to local display immediately
      this.messages.push(message);
      
      // Reset form
      this.messageForm.reset();
      
      // Scroll to bottom
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }
  
  private scrollToBottom(): void {
    try {
      const chatContainer = this.elementRef.nativeElement.querySelector('.messages-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
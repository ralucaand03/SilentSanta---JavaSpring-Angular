import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from "./footer/footer.component";
import { WebsocketService } from './services/websocket.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Silent_Santa';
  
  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Connect to WebSocket if user is logged in
    if (this.authService.isLoggedIn()) {
      this.websocketService.connect();
    }
  }
}
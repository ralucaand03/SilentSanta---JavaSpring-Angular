import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from "./subpage/footer/footer.component";
import { WebSocketNotif } from './services/websocketnotif.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

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
    private websocketService: WebSocketNotif,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService 
  ) {}

  ngOnInit(): void {
    // Connect to WebSocket if user is logged in
    if (this.authService.isLoggedIn()) {
      this.websocketService.connect();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl + F for favorites
    if (event.ctrlKey && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      this.router.navigate(['/favorites']);
    }
    // Ctrl + L for letters
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      this.router.navigate(['/letters']);
    }
    // Ctrl + M for my-letters
    if (event.ctrlKey && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      this.router.navigate(['/my-letters']);
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'd') {
      event.preventDefault();
      this.themeService.toggleDarkMode();
    }
  }
}

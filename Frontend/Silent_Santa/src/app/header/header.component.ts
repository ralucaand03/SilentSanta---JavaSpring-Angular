import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import   { AuthService } from "../services/auth.service"
import   { User } from "../models/user.model"
import   { Router } from "@angular/router"
import   { Subscription } from "rxjs"
import { NotificationBellComponent } from "../notification/notification.component" // Import the notification component
import { WebSocketNotif } from "../services/websocketnotif.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, NotificationBellComponent], // Add NotificationBellComponent to imports
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false
  isAdmin = false
  dropdownOpen = false
  mobileMenuOpen = false
  isMobile = false
  private userSub: Subscription | null = null
  private notificationSub: Subscription | null = null
  currentUser: User | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
    private websocketnotifService : WebSocketNotif
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user
      this.currentUser = user
      this.isAdmin = user?.role === "ADMIN"
    })

    this.checkScreenSize()

    // Listen for window resize events
    window.addEventListener("resize", () => {
      this.checkScreenSize()
    })

    this.notificationSub = this.websocketnotifService.notifications$.subscribe((notification) => {
      console.log("Received in HEADER");
    })
  }

  // Check if the screen is mobile size
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768
    if (window.innerWidth >= 768) {
      this.mobileMenuOpen = false
    }
  }

  // Toggle dropdown menu
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  // Handle logout
  logOut(): void {
    this.isAuthenticated = false
    this.authService.logout()
    this.router.navigate(["/login"])
    console.log("User logged out")
  }
}

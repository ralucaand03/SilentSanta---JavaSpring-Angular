import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { AuthService } from "../services/auth.service"
import  { User } from "../models/user.model"
import { Router } from "@angular/router"
import type { Subscription } from "rxjs"
@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
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
  currentUser: User | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
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
      // Redirect to login page or home page
      // this.router.navigate(['/login']);
  }
     
}
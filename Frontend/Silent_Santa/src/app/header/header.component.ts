import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false
  dropdownOpen = false
  mobileMenuOpen = false
  isMobile = false

  constructor() {}

  ngOnInit(): void {
    // Check screen size on initialization
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
    this.dropdownOpen = false
    // Add your actual logout logic here
    console.log("User logged out")
  }
}
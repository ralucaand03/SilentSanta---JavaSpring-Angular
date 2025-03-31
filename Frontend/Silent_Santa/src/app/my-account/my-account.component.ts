import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./my-account.component.html",
  styleUrl: "./my-account.component.css",
})
export class MyAccountComponent implements OnInit {
  user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Donor",
    joinDate: "January 15, 2023",
    profileImage: "/assets/Silent_Santa.png",
    stats: {
      lettersSent: 12,
      favoriteLetters: 8,
      childrenHelped: 5,
    },
  }

  constructor() {}

  ngOnInit(): void {
    // You could load user data from a service here
  }

  logout(): void {
    // Implement logout functionality
    console.log("User logged out")
    // Redirect to login page or home page
    // this.router.navigate(['/login']);
  }

  editProfile(): void {
    // Implement edit profile functionality
    console.log("Edit profile clicked")
  }

  editBio(): void {
    // Implement edit bio functionality
    console.log("Edit bio clicked")
  }
}


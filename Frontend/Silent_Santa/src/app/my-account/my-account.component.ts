import { Component, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { User } from "../models/user.model";
import { FavoritesService } from "../services/favorites.service";
import { Letters } from "../models/letters.model";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./my-account.component.html",
  styleUrl: "./my-account.component.css",
})
export class MyAccountComponent implements OnInit {
  user: any = {
    name: "",
    email: "",
    role: "",
    joinDate: "",
    profileImage: "assets/elf_icon.png",
    stats: {
      lettersSent: 0,
      favoriteLetters: 0, // Initially set to 0
      childrenHelped: 0,
    },
  };
  private userSub: Subscription | null = null;
  currentUser: User | null = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      if (user) {
        // Fetch the favorite letters count here
        this.favoritesService.getUserFavoriteCount(user.id).subscribe(
          (favoriteCount) => {
            this.user.stats.favoriteLetters = favoriteCount; // Set the favorite letters count
          },
          (error) => {
            console.error('Error fetching favorite letters count:', error);
          }
        );

        this.user = {
          name: user.email.split("@")[0],
          email: user.email,
          role: this.mapRole(user.role),
          joinDate: this.formatDate(new Date()),
          profileImage: "assets/elf_icon.png",
          stats: {
            lettersSent: 0, // You can set this as needed
            favoriteLetters: 0, // This will be updated once the count is fetched
            childrenHelped: 0,
          },
        };
      } else {
        this.router.navigate(["/login"]);
      }

      this.isLoading = false;
    });
  }

  private mapRole(role: string): string {
    switch (role) {
      case "ADMIN":
        return "Helper";
      case "USER":
        return "Giver";
      default:
        return role;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
    console.log("User logged out");
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  editProfile(): void {
    console.log("Edit profile clicked");
  }

  editBio(): void {
    console.log("Edit bio clicked");
  }
}

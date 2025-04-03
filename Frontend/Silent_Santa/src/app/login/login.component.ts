import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../header/header.component"
import { AuthService } from "../services/login.service" // Remove "type"
import { Router } from "@angular/router" // Remove "type"
import { HttpClientModule } from "@angular/common/http"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { LogIn } from "../models/login.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, HeaderComponent, HttpClientModule, CommonModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email = ""
  password = ""
  rememberMe = false
  errorMessage = ""
  isLoading = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLoginSubmit() {
    this.isLoading = true
    this.errorMessage = ""

    const loginData = {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe,
    }

    this.authService.login(loginData as LogIn).subscribe({
      next: (response) => {
        console.log("Login successful:", response)
        this.isLoading = false
        this.router.navigate(["/letters"])
      },
      error: (error) => {
        console.error("Login error:", error)
        this.isLoading = false
        if (error.status === 401) {
          this.errorMessage = "Invalid email or password"
        } else {
          this.errorMessage = "An error occurred during login. Please try again."
        }
      },
    })
  }
}
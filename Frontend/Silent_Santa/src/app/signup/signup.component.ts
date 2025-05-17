import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../header/header.component"
import   { AuthService } from "../services/auth.service"
import   { Router } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import   { HttpClient } from "@angular/common/http"

declare global {
  interface Window {
    grecaptcha: any
    onCaptchaVerified: (token: string) => void
    onCaptchaExpired: () => void
  }
}

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [FormsModule, HeaderComponent, HttpClientModule, CommonModule, RouterModule],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  firstname = ""
  lastname = ""
  email = ""
  phone = ""
  password = ""
  role = ""
  errorMessage = ""
  captchaError = ""
  isLoading = false
  captchaResponse = ""

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    // Set up global callbacks for reCAPTCHA
    window.onCaptchaVerified = (token: string) => {
      console.log("reCAPTCHA verified with token:", token.substring(0, 20) + "...")
      this.captchaResponse = token
      this.captchaError = ""
    }

    window.onCaptchaExpired = () => {
      console.log("reCAPTCHA expired")
      this.captchaResponse = ""
      this.captchaError = "reCAPTCHA verification expired. Please verify again."
    }
  }

  private mapRoleToBackend(role: string): string {
    switch (role.toUpperCase()) {
      case "GIVER":
        return "USER"
      case "HELPER":
        return "ADMIN"
      default:
        return "USER"
    }
  }

  onSignupSubmit() {
    // Validate form
    if (!this.role) {
      alert("Please select a role (Giver or Helper)")
      return
    }

    // Validate reCAPTCHA
    if (!this.captchaResponse) {
      this.captchaError = "Please complete the reCAPTCHA verification"
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.captchaError = ""

    const signupData = {
      firstName: this.firstname,
      lastName: this.lastname,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.mapRoleToBackend(this.role),
      captchaToken: this.captchaResponse, // Use the token from the callback
    }

    console.log("Submitting signup with captcha token:", this.captchaResponse.substring(0, 20) + "...")

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log("Signup successful:", response)
        this.isLoading = false
        this.router.navigate(["/login"])
      },
      error: (error) => {
        console.error("Signup error:", error)
        this.isLoading = false

        // Reset reCAPTCHA
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset()
          this.captchaResponse = ""
        }

        if (error.status === 409) {
          this.errorMessage = "Email already registered"
        } else if (error.status === 400 && error.error && error.error.message) {
          this.errorMessage = error.error.message
        } else {
          this.errorMessage = "An error occurred during signup. Please try again."
        }
      },
    })
  }

  selectRole(role: string) {
    this.role = role
  }
}

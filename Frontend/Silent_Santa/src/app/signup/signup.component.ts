import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../header/header.component"
import   { AuthService } from "../services/login.service"
import   { Router } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [FormsModule, HeaderComponent, HttpClientModule, CommonModule, RouterModule],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  firstname = ""
  lastname = ""
  email = ""
  phone = ""
  password = ""
  role = ""
  errorMessage = ""
  isLoading = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  
  private mapRoleToBackend(role: string): string {
    switch (role.toUpperCase()) {
      case "GIVER":
        return "USER";
      case "HELPER":
        return "ADMIN";
      default:
        return "USER";
    }
  }

  onSignupSubmit() {
    if (!this.role) {
      alert("Please select a role (Giver or Helper)")
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    const signupData = {
      firstName: this.firstname,
      lastName: this.lastname,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.mapRoleToBackend(this.role),  
    }

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log("Signup successful:", response)
        this.isLoading = false 
        this.router.navigate(["/login"])
      },
      error: (error) => {
        console.error("Signup error:", error)
        this.isLoading = false
        if (error.status === 409) {
          this.errorMessage = "Email already registered"
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


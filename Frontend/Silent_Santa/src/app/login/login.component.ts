import { Component } from "@angular/core"
import { FormsModule, NgForm } from "@angular/forms"
import { HeaderComponent } from "../header/header.component"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { LogIn } from "../models/login.model"
import { AuthResponseData } from "../models/auth.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, HeaderComponent, HttpClientModule, CommonModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  userData: LogIn = {
    email: "",
    role: "",
    password: "",
    rememberMe: false,
  }
  errorMessage = ""
  isLoading = false

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit(form: NgForm) {
    this.isLoading = true
    this.errorMessage = ""

    if (!form.valid) {
      this.errorMessage = "Form is invalid!"
      this.isLoading = false
      return
    }

    this.authService.login(this.userData).subscribe({
      next: (logInResponse: AuthResponseData) => {
        console.log("Log In successfully:", logInResponse)
        this.isLoading = false
        this.router.navigate(["/letters"])
        form.reset()
      },
      error: (error) => {
        this.errorMessage = "Log-in failed. Please try again."
        console.error('Error during log-in:', error)
        this.isLoading = false
        form.reset()
      },
    })
  }
}

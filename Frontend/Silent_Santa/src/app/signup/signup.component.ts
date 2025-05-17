import { Component,   OnInit,   NgZone } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../header/header.component"
import   { AuthService } from "../services/auth.service"
import   { Router } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

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
  firstname = "";
  lastname = "";
  email = "";
  phone = "";
  password = "";
  role = "";
  errorMessage = "";
  captchaError = "";
  isLoading = false;
  captchaResponse = "";
  captchaVerified = false;
  imageChallengeCompleted = false;
  imageChallengeSrc = "assets/captcha_image.jpg"; // Default image
  imageObjectName = "bus"; // Default object to find

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
  ) {}

    ngOnInit() {
    // Set up global callbacks for reCAPTCHA
    window.onCaptchaVerified = (token: string) => {
      this.zone.run(() => {
        console.log("reCAPTCHA verified with token:", token.substring(0, 20) + "...");
        this.captchaResponse = token;
        this.captchaError = "";
        this.captchaVerified = true; // Show the text input
      });
    };

    window.onCaptchaExpired = () => {
      this.zone.run(() => {
        console.log("reCAPTCHA expired");
        this.captchaResponse = "";
        this.captchaError = "reCAPTCHA verification expired. Please verify again.";
        this.captchaVerified = false; // Hide the text input
      });
    };

    this.ensureRecaptchaLoaded();
  }
  // Make sure reCAPTCHA is loaded
 private ensureRecaptchaLoaded() {
    if (!window.grecaptcha) {
      console.log("reCAPTCHA not loaded yet, trying again in 500ms");
      setTimeout(() => this.ensureRecaptchaLoaded(), 500);
      return;
    }

    console.log("reCAPTCHA loaded successfully");
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
      alert("Please select a role (Giver or Helper)");
      return;
    }

    // Validate reCAPTCHA
    if (!this.captchaResponse) {
      this.captchaError = "Please complete the reCAPTCHA verification";
      return;
    }

    // Validate the text input after CAPTCHA
    // if (!this.captchaText || this.captchaText.trim().length === 0) {
    //   this.errorMessage = "Please type the word above to continue.";
    //   return;
    // }

    this.isLoading = true;
    this.errorMessage = "";
    this.captchaError = "";

    const signupData = {
      firstName: this.firstname,
      lastName: this.lastname,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role,
      captchaToken: this.captchaResponse,
    };

    console.log("Submitting signup with data:", {
      ...signupData,
      password: "[REDACTED]",
      captchaToken: signupData.captchaToken ? "Present" : "Missing",
    });

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log("Signup successful:", response);
        this.isLoading = false;
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        console.error("Signup error:", error);
        this.isLoading = false;

        // Reset reCAPTCHA
        if (window.grecaptcha && window.grecaptcha.reset) {
          window.grecaptcha.reset();
          this.captchaResponse = "";
          this.captchaVerified = false;
        }

        this.errorMessage = "An error occurred during signup. Please try again.";
      },
    });
  }

  selectRole(role: string) {
    this.role = role
  }
}

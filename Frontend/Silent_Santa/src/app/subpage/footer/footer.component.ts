import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { SubscriberService } from "../../services/subscriber.service"
import { Subscriber } from "../../models/subscriber.model"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  email = ""
  currentYear = new Date().getFullYear()

  constructor(private subscriberService: SubscriberService) {}

  subscribeToNewsletter() {
    if (!this.email || !this.validateEmail(this.email)) {
      alert("Please enter a valid email.")
      return
    }

    const subscriber = new Subscriber(this.email)

    this.subscriberService.subscribeToNewsletter(subscriber).subscribe({
      next: (response) => {
        alert("Subscribed successfully!")
        this.email = "" // Clear input after successful subscription
      },
      error: (error) => {
        alert("Error subscribing: " + (error.error || "Unknown error occurred"))
      },
    })
  }

  // Simple email validation
  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }
}


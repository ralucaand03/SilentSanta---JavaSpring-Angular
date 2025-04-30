import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import  { RequestsService, Request } from '../services/requests.service'
import  { AuthService } from "../services/auth.service"

@Component({
  selector: "app-requests",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.css"],
})
export class RequestsComponent implements OnInit {
  // Requests data
  userRequests: Request[] = []
  letterOwnerRequests: Request[] = []

  // UI state
  activeTab: "outgoing" | "incoming" = "outgoing"
  isLoading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private requestsService: RequestsService,
  ) {}

  ngOnInit(): void {
    this.loadRequests()
  }

  setActiveTab(tab: "outgoing" | "incoming"): void {
    this.activeTab = tab
  }

  loadRequests(): void {
    this.isLoading = true
    this.errorMessage = ""

    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      this.errorMessage = "Please log in to view your requests."
      this.isLoading = false
      return
    }

    const userId = currentUser.id

    // Load outgoing requests (requests made by the user)
    this.requestsService.getUserRequests(userId).subscribe({
      next: (requests) => {
        this.userRequests = requests
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = "Failed to load your requests. Please try again."
        this.isLoading = false
        console.error("Error loading user requests:", err)
      },
    })

    // Load incoming requests (requests for letters posted by the user)
    this.requestsService.getLetterOwnerRequests(userId).subscribe({
      next: (requests) => {
        this.letterOwnerRequests = requests
      },
      error: (err) => {
        console.error("Error loading letter owner requests:", err)
      },
    })
  }

  cancelRequest(request: Request): void {
    if (confirm("Are you sure you want to cancel this request?")) {
      this.requestsService.deleteRequest(request.id).subscribe({
        next: () => {
          this.userRequests = this.userRequests.filter((r) => r.id !== request.id)
          this.successMessage = "Request cancelled successfully!"

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err) => {
          this.errorMessage = "Failed to cancel request. Please try again."
          console.error("Error cancelling request:", err)

          // Clear error message after 3 seconds
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
    }
  }

  updateRequestStatus(request: Request, status: "ACCEPTED" | "DENIED"): void {
    this.requestsService.updateRequestStatus(request.id, status).subscribe({
      next: (updatedRequest) => {
        // Update the request in the array
        const index = this.letterOwnerRequests.findIndex((r) => r.id === request.id)
        if (index !== -1) {
          this.letterOwnerRequests[index] = updatedRequest
        }

        this.successMessage = `Request ${status.toLowerCase()} successfully!`

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      },
      error: (err) => {
        this.errorMessage = `Failed to ${status.toLowerCase()} request. Please try again.`
        console.error(`Error ${status.toLowerCase()}ing request:`, err)

        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = ""
        }, 3000)
      },
    })
  }
}

import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import   { RequestsService } from "../services/requests.service"
import   { AuthService } from "../services/auth.service"
import   { LettersService } from "../services/letters.service"
import { Letters } from "../models/letters.model"

@Component({
  selector: "app-requests",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.css"],
})
export class RequestsComponent implements OnInit {
  // Requests data
  userRequests: Letters[] = []
  letterOwnerRequests: Letters[] = []

  // UI state
  isAdmin = false
  isLoading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private requestsService: RequestsService,
    private lettersService: LettersService,
  ) {}

  ngOnInit(): void {
    this.checkUserRole()
    this.loadRequests()
  }

  checkUserRole(): void { 
    const currentUser = this.authService.getCurrentUser()
    if (currentUser?.role === "ADMIN") {
      this.isAdmin = true
    }
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
    this.requestsService.getUserRequests(userId).subscribe({
      next: (requests) => { 
        if (!this.isAdmin) {
          this.userRequests = requests.filter((req) => req.status === "WAITING")
        } else {
          this.userRequests = requests
        }
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = "Failed to load your requests. Please try again."
        this.isLoading = false
        console.error("Error loading user requests:", err)
      },
    })
     if (this.isAdmin) {
      this.requestsService.getLetterOwnerRequests(userId).subscribe({
        next: (requests) => {
          this.letterOwnerRequests = requests
        },
        error: (err) => {
          console.error("Error loading letter owner requests:", err)
        },
      })
    }
  }

  cancelRequest(request: Letters): void {
    if (confirm("Are you sure you want to cancel this request?")) {
      this.requestsService.updateRequestStatus(request.id, "DENIED").subscribe({
        next: () => {
          this.userRequests = this.userRequests.filter((r) => r.id !== request.id)
          this.successMessage = "Request cancelled successfully!"
  
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err) => {
          this.errorMessage = "Failed to cancel request. Please try again."
          console.error("Error cancelling request:", err)
  
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
    }
  }
  
  updateRequestStatus(request: Letters, status: "ACCEPTED" | "DENIED"): void {
    this.requestsService.updateRequestStatus(request.id, status).subscribe({
      next: (updatedRequest) => {
        const index = this.letterOwnerRequests.findIndex((r) => r.id === request.id)
        if (index !== -1) {
          this.letterOwnerRequests[index] = updatedRequest
        }

        if (status === "ACCEPTED") {
          this.updateLetterStatus(request.id, "WORKING")
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

  updateLetterStatus(letterId: string, status: string): void {
    this.lettersService.changeStatus(letterId, status).subscribe({
      next: () => {
        console.log(`Letter status updated to ${status}`)
      },
      error: (err) => {
        console.error("Error updating letter status:", err)
      },
    })
  }
}

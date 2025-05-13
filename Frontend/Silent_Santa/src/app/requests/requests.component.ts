import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { RequestsService } from "../services/requests.service"
import { AuthService } from "../services/auth.service"
import { Letters } from "../models/letters.model"
import { LetterRequest } from "../models/letter-request.model"

@Component({
  selector: "app-requests",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.css"],
})
export class RequestsComponent implements OnInit {
  // User requests
  userRequests: Letters[] = []
  filteredRequests: Letters[] = []

  // Letter owner requests (for admins)
  letterOwnerRequests: LetterRequest[] = []
  filteredOwnerRequests: LetterRequest[] = []

  // Combined requests for filtering
  allRequests: Letters[] = []

  // Filter properties
  searchQuery = ""
  selectedLocation: string | null = null
  selectedGender: string | null = null
  selectedStatus: string | null = null
  locations: string[] = []

  // UI state
  isLoading = false
  errorMessage = ""
  successMessage = ""
  isAdmin = false

  constructor(
    private authService: AuthService,
    private requestsService: RequestsService,
  ) {}

  ngOnInit(): void {
    this.checkUserRole()
    this.fetchRequests()
  }

  checkUserRole(): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser) {
      // Assuming role is stored in the user object
      this.isAdmin = currentUser.role === "ADMIN"
    }
  }

  fetchRequests(): void {
    this.isLoading = true
    this.errorMessage = ""

    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      this.errorMessage = "You must be logged in to view requests."
      this.isLoading = false
      return
    }

    const userId = currentUser.id

    // Fetch user's requests
    this.requestsService.getUserRequests(userId).subscribe({
      next: (requests: Letters[]) => {
        this.userRequests = requests
        this.filteredRequests = [...requests]
        this.allRequests = [...requests]

        // Extract unique locations for filtering
        this.extractLocations()

        this.isLoading = false
      },
      error: (err) => {
        console.error("Error loading user requests:", err)
        this.errorMessage = "Failed to load your requests. Please try again."
        this.isLoading = false
      },
    })

    // If admin, fetch letter owner requests
    if (this.isAdmin) {
      this.requestsService.getLetterOwnerRequests(userId).subscribe({
        next: (requests: LetterRequest[]) => {
          this.letterOwnerRequests = requests
          this.filteredOwnerRequests = [...requests]

          // Add letter data to allRequests for filtering
          const letterData = requests.map((req) => req.letter)
          this.allRequests = [...this.allRequests, ...letterData]

          // Update locations with any new ones
          this.extractLocations()
        },
        error: (err) => {
          console.error("Error loading letter owner requests:", err)
          // Don't show error message for this as it's secondary
        },
      })
    }
  }

  extractLocations(): void {
    this.locations = [
      ...new Set(this.allRequests.map((request) => request.location).filter((loc): loc is string => loc !== undefined)),
    ]
  }

  toggleRequestView(request: Letters | LetterRequest, event: Event): void {
    // Only toggle on double click
    if (event instanceof MouseEvent && event.detail === 2) {
      if ("letter" in request) {
        // It's a LetterRequest
        request.letter.showImage = !request.letter.showImage
      } else {
        // It's a Letters
        request.showImage = !request.showImage
      }
    }
  }

  cancelRequest(request: Letters): void {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      this.errorMessage = "You must be logged in to cancel requests."
      return
    }

    const userId = currentUser.id

    this.requestsService.removeRequest(userId, request.id).subscribe({
      next: () => {
        // Remove from arrays
        this.userRequests = this.userRequests.filter((r) => r.id !== request.id)
        this.filteredRequests = this.filteredRequests.filter((r) => r.id !== request.id)
        this.allRequests = this.allRequests.filter((r) => r.id !== request.id)

        this.successMessage = "Request cancelled successfully."
        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      },
      error: (err) => {
        console.error("Error cancelling request:", err)
        this.errorMessage = "Failed to cancel request. Please try again."
        setTimeout(() => {
          this.errorMessage = ""
        }, 3000)
      },
    })
  }

  updateRequestStatus(request: LetterRequest, status: "ACCEPTED" | "DENIED"): void {
    this.requestsService.updateRequestStatus(request.requestId, status).subscribe({
      next: () => {
        // Update in arrays
        const updateInArray = (arr: LetterRequest[]) => {
          const index = arr.findIndex((r) => r.requestId === request.requestId)
          if (index !== -1) {
            arr[index].status = status
          }
        }

        updateInArray(this.letterOwnerRequests)
        updateInArray(this.filteredOwnerRequests)

        this.successMessage = `Request ${status.toLowerCase()}.`
        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      },
      error: (err) => {
        console.error(`Error updating request status to ${status}:`, err)
        this.errorMessage = `Failed to ${status.toLowerCase()} request. Please try again.`
        setTimeout(() => {
          this.errorMessage = ""
        }, 3000)
      },
    })
  }

  // Helper method to get status text for display
  getStatusText(status: string): string {
    switch (status) {
      case "ACCEPTED":
        return "Accepted"
      case "DENIED":
        return "Denied"
      case "WAITING":
        return "Waiting"
      default:
        return status
    }
  }

  // Filter methods
  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement
    this.searchQuery = input.value
    this.applyFilters()
  }

  filterByLocation(location: string | null): void {
    this.selectedLocation = location
    this.applyFilters()
  }

  filterByGender(gender: string | null): void {
    this.selectedGender = gender
    this.applyFilters()
  }

  filterByStatus(status: string | null): void {
    this.selectedStatus = status
    this.applyFilters()
  }

  clearFilters(): void {
    this.searchQuery = ""
    this.selectedLocation = null
    this.selectedGender = null
    this.selectedStatus = null
    this.filteredRequests = [...this.userRequests]
    this.filteredOwnerRequests = [...this.letterOwnerRequests]
  }

  applyFilters(): void {
    // Filter user requests
    this.filteredRequests = this.userRequests.filter((request) => {
      return this.matchesFilters(request)
    })

    // Filter letter owner requests if admin
    if (this.isAdmin) {
      this.filteredOwnerRequests = this.letterOwnerRequests.filter((request) => {
        return this.matchesFilters(request.letter)
      })
    }
  }

  matchesFilters(request: Letters): boolean {
    // Filter by location
    if (this.selectedLocation && request.location !== this.selectedLocation) {
      return false
    }

    // Filter by gender
    if (this.selectedGender && request.gender !== this.selectedGender) {
      return false
    }

    // Filter by status
    if (this.selectedStatus && request.status !== this.selectedStatus) {
      return false
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase()
      const nameMatch = request.childName?.toLowerCase().includes(query) || false
      const titleMatch = request.title?.toLowerCase().includes(query) || false
      const wishListMatch = request.wishList?.some((item) => item.toLowerCase().includes(query)) || false

      if (!nameMatch && !titleMatch && !wishListMatch) {
        return false
      }
    }

    return true
  }

  getImageSrc(imagePath: string | undefined): string {
    if (!imagePath) {
      return "assets/letter.png" // Default image
    }

    // If the path already includes 'assets/', don't add it again
    if (imagePath.startsWith("assets/")) {
      return imagePath
    }

    return "assets/letters/" + imagePath
  }
  sendNotificationToUser(request: Letters, status: string): void {
    const notification = {
      message: `Your request for letter ${request.childName} has been ${status}`,
      userId: request, // Assuming userId is available
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Send notification via the notification service
    //this.notificationService.sendNotification(notification);
  }
  chatWithRequester(request: LetterRequest): void {
    // This is a placeholder for the chat functionality
    // alert(`Opening chat with ${request.requester.name || "requester"}...`)

    // You could navigate to a chat page or open a chat modal
    // For example:
    // this.router.navigate(['/chat'], { queryParams: { userId: request.requester.id } });
  }
}

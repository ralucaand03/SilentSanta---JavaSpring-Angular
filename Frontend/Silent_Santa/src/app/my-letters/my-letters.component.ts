import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../header/header.component"
import   { RequestsService } from "../services/requests.service"
import   { LettersService } from "../services/letters.service"
import   { AuthService } from "../services/auth.service"
import   { Letters } from "../models/letters.model"

@Component({
  selector: "app-my-letters",
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: "./my-letters.component.html",
  styleUrl: "./my-letters.component.css",
})
export class MyLettersComponent implements OnInit {
  // User's approved letters
  approvedLetters: Letters[] = []
  filteredApprovedLetters: Letters[] = []

  // Admin's posted letters
  adminLetters: Letters[] = []
  filteredAdminLetters: Letters[] = []

  // UI state
  isLoading = false
  errorMessage = ""
  successMessage = ""
  isAdmin = false

  // Filter properties
  searchQuery = ""
  selectedLocation: string | null = null
  selectedGender: string | null = null
  locations: string[] = []

  constructor(
    private authService: AuthService,
    private requestsService: RequestsService,
    private lettersService: LettersService,
  ) {}

  ngOnInit(): void {
    this.checkUserRole()
    this.fetchLetters()
  }

  checkUserRole(): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser) {
      this.isAdmin = currentUser.role === "ADMIN"
    }
  }

  fetchLetters(): void {
    this.isLoading = true
    this.errorMessage = ""

    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      this.errorMessage = "You must be logged in to view your letters."
      this.isLoading = false
      return
    }

    const userId = currentUser.id

    // Fetch user's approved letters
    this.requestsService.getUserAcceptedRequests(userId).subscribe({
      next: (letters: Letters[]) => {
        this.approvedLetters = letters

        this.filteredApprovedLetters = [...letters]

        // Extract locations for filtering
        this.extractLocations(letters)

        this.isLoading = false
      },
      error: (err) => {
        console.error("Error loading approved letters:", err)
        this.errorMessage = "Failed to load your approved letters. Please try again."
        this.isLoading = false
      },
    })

    // If admin, fetch letters posted by the user
    if (this.isAdmin) {
      this.lettersService.getLetters().subscribe({
        next: (allLetters: Letters[]) => {
          // Filter to only include letters posted by this admin
          this.adminLetters = allLetters.filter((letter) => letter.postedBy && letter.postedBy.id === userId)
          this.filteredAdminLetters = [...this.adminLetters]

          // Update locations with any new ones
          this.extractLocations([...this.approvedLetters, ...this.adminLetters])
        },
        error: (err) => {
          console.error("Error loading admin letters:", err)
          // Don't show error message for this as it's secondary
        },
      })
    }
  }

  extractLocations(letters: Letters[]): void {
    this.locations = [
      ...new Set(letters.map((letter) => letter.location).filter((loc): loc is string => loc !== undefined)),
    ]
  }

  markAsCompleted(letter: Letters): void {
    this.lettersService.changeStatus(letter.id, "DONE").subscribe({
      next: (updatedLetter) => {
        // Update the letter in our arrays
        const updateInArray = (arr: Letters[]) => {
          const index = arr.findIndex((l) => l.id === letter.id)
          if (index !== -1) {
            arr[index].status = "DONE"
          }
        }

        updateInArray(this.approvedLetters)
        updateInArray(this.filteredApprovedLetters)

        this.successMessage = "Letter marked as completed!"
        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      },
      error: (err) => {
        console.error("Error marking letter as completed:", err)
        this.errorMessage = "Failed to mark letter as completed. Please try again."
        setTimeout(() => {
          this.errorMessage = ""
        }, 3000)
      },
    })
  }

  deleteLetter(letter: Letters): void {
    if (confirm("Are you sure you want to delete this letter? This action cannot be undone.")) {
      this.lettersService.deleteLetter(letter.id).subscribe({
        next: () => {
          // Remove from arrays
          this.adminLetters = this.adminLetters.filter((l) => l.id !== letter.id)
          this.filteredAdminLetters = this.filteredAdminLetters.filter((l) => l.id !== letter.id)

          this.successMessage = "Letter deleted successfully."
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err) => {
          console.error("Error deleting letter:", err)
          this.errorMessage = "Failed to delete letter. Please try again."
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
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

  clearFilters(): void {
    this.searchQuery = ""
    this.selectedLocation = null
    this.selectedGender = null
    this.filteredApprovedLetters = [...this.approvedLetters]
    this.filteredAdminLetters = [...this.adminLetters]
  }

  applyFilters(): void {
    // Filter approved letters
    this.filteredApprovedLetters = this.approvedLetters.filter((letter) => {
      return this.matchesFilters(letter)
    })

    // Filter admin letters
    if (this.isAdmin) {
      this.filteredAdminLetters = this.adminLetters.filter((letter) => {
        return this.matchesFilters(letter)
      })
    }
  }

  matchesFilters(letter: Letters): boolean {
    // Filter by location
    if (this.selectedLocation && letter.location !== this.selectedLocation) {
      return false
    }

    // Filter by gender
    if (this.selectedGender && letter.gender !== this.selectedGender) {
      return false
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase()
      const nameMatch = letter.childName?.toLowerCase().includes(query) || false
      const titleMatch = letter.title?.toLowerCase().includes(query) || false
      const wishListMatch = letter.wishList?.some((item) => item.toLowerCase().includes(query)) || false

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

  toggleLetterView(letter: Letters, event: Event): void {
    // Only toggle on double click
    if (event instanceof MouseEvent && event.detail === 2) {
      letter.showImage = !letter.showImage
    }
  }

  // Add the exportLetterXml method to the MyLettersComponent class
  exportLetterXml(letter: Letters, event: Event): void {
    event.stopPropagation() // Prevent letter card toggle

    this.lettersService.exportLetterAsXml(letter.id).subscribe({
      next: (response) => {
        // Create a blob from the XML response
        const blob = new Blob([response], { type: "application/xml" })

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob)

        // Sanitize the title for use as a filename
        let filename = letter.title || `letter-${letter.id}`
        // Replace invalid filename characters with underscores
        filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
        // Ensure the filename isn't too long
        filename = filename.substring(0, 100)

        // Create a temporary anchor element to trigger download
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}.xml`
        document.body.appendChild(a)
        a.click()

        // Clean up
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        this.successMessage = "Letter exported successfully!"
        setTimeout(() => {
          this.successMessage = ""
        }, 3000)
      },
      error: (err) => {
        console.error("Error exporting letter:", err)
        this.errorMessage = "Failed to export letter. Please try again."
        setTimeout(() => {
          this.errorMessage = ""
        }, 3000)
      },
    })
  }
}

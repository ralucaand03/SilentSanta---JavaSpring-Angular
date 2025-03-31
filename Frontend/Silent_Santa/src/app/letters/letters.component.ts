import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "../header/header.component"
import { FooterComponent } from "../footer/footer.component"

interface Letter {
  id: number
  childName: string
  childAge: number
  gender: "boy" | "girl"
  items: string[]
  location: string
  isFavorite: boolean
  isRequested: boolean
  showImage: boolean
}

@Component({
  selector: "app-letters",
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: "./letters.component.html",
  styleUrl: "./letters.component.css",
})
export class LettersComponent {
  letters: Letter[] = [
    {
      id: 1,
      childName: "Emma",
      childAge: 7,
      gender: "girl",
      items: ["Barbie doll", "Coloring books", "Winter boots (size 13)"],
      location: "Springfield Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 2,
      childName: "Michael",
      childAge: 9,
      gender: "boy",
      items: ["Lego set", "Soccer ball", "Science book"],
      location: "Oakridge School",
      isFavorite: true,
      isRequested: false,
      showImage: false,
    },
    {
      id: 3,
      childName: "Sophia",
      childAge: 5,
      gender: "girl",
      items: ["Teddy bear", "Picture books", "Art supplies"],
      location: "Pinecrest Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 4,
      childName: "Ethan",
      childAge: 10,
      gender: "boy",
      items: ["Remote control car", "Winter jacket (size M)", "Board game"],
      location: "Springfield Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 5,
      childName: "Olivia",
      childAge: 8,
      gender: "girl",
      items: ["Doll house", "Puzzle set", "Warm gloves"],
      location: "Oakridge School",
      isFavorite: false,
      isRequested: true,
      showImage: false,
    },
    {
      id: 6,
      childName: "Noah",
      childAge: 6,
      gender: "boy",
      items: ["Toy dinosaurs", "Children's books", "Winter hat"],
      location: "Pinecrest Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 7,
      childName: "Ava",
      childAge: 9,
      gender: "girl",
      items: ["Craft kit", "Headphones", "Warm socks"],
      location: "Springfield Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 8,
      childName: "William",
      childAge: 7,
      gender: "boy",
      items: ["Action figures", "Children's tablet", "Winter boots (size 12)"],
      location: "Oakridge School",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 9,
      childName: "Isabella",
      childAge: 6,
      gender: "girl",
      items: ["Princess dress", "Storybooks", "Winter coat (size S)"],
      location: "Springfield Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 10,
      childName: "James",
      childAge: 8,
      gender: "boy",
      items: ["Building blocks", "Toy cars", "Warm hat and gloves"],
      location: "Pinecrest Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 11,
      childName: "Charlotte",
      childAge: 10,
      gender: "girl",
      items: ["Art set", "Journal", "Winter boots (size 2)"],
      location: "Oakridge School",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
    {
      id: 12,
      childName: "Benjamin",
      childAge: 5,
      gender: "boy",
      items: ["Toy trucks", "Animal figures", "Warm pajamas (size 5T)"],
      location: "Springfield Elementary",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
  ]

  // Filter states
  selectedLocation: string | null = null
  selectedGender: string | null = null
  selectedAgeRange: string | null = null
  searchQuery = ""

  // Filter options
  locations = Array.from(new Set(this.letters.map((letter) => letter.location)))
  genders = ["boy", "girl"]
  ageRanges = ["5-6", "7-8", "9-10"]

  toggleFavorite(letter: Letter): void {
    letter.isFavorite = !letter.isFavorite
    // In a real app, you would call a service to update the favorite status
    console.log(`${letter.childName}'s letter ${letter.isFavorite ? "added to" : "removed from"} favorites`)
  }

  requestLetter(letter: Letter): void {
    if (!letter.isRequested) {
      letter.isRequested = true
      // In a real app, you would call a service to request the letter
      console.log(`${letter.childName}'s letter requested`)
    }
  }

  toggleLetterView(letter: Letter, event: MouseEvent): void {
    // Only toggle on double click
    if (event.detail === 2) {
      letter.showImage = !letter.showImage
    }
  }

  // Filter methods
  filterByLocation(location: string | null): void {
    this.selectedLocation = location
  }

  filterByGender(gender: string | null): void {
    this.selectedGender = gender
  }

  filterByAgeRange(ageRange: string | null): void {
    this.selectedAgeRange = ageRange
  }

  updateSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase()
  }

  clearFilters(): void {
    this.selectedLocation = null
    this.selectedGender = null
    this.selectedAgeRange = null
    this.searchQuery = ""
  }

  get filteredLetters(): Letter[] {
    return this.letters.filter((letter) => {
      // Filter by location
      if (this.selectedLocation && letter.location !== this.selectedLocation) {
        return false
      }

      // Filter by gender
      if (this.selectedGender && letter.gender !== this.selectedGender) {
        return false
      }

      // Filter by age range
      if (this.selectedAgeRange) {
        const [min, max] = this.selectedAgeRange.split("-").map(Number)
        if (letter.childAge < min || letter.childAge > max) {
          return false
        }
      }

      // Filter by search query
      if (this.searchQuery) {
        const nameMatch = letter.childName.toLowerCase().includes(this.searchQuery)
        const itemsMatch = letter.items.some((item) => item.toLowerCase().includes(this.searchQuery))
        if (!nameMatch && !itemsMatch) {
          return false
        }
      }

      return true
    })
  }
}


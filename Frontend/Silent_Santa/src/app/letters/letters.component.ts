import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "../header/header.component"
import { FooterComponent } from "../footer/footer.component"

interface Letter {
  id: number
  childName: string
  childAge: number
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
      items: ["Action figures", "Children's tablet", "Winter boots (size 12)"],
      location: "Oakridge School",
      isFavorite: false,
      isRequested: false,
      showImage: false,
    },
  ]

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

  // Filter methods for the location filter
  locations = Array.from(new Set(this.letters.map((letter) => letter.location)))
  selectedLocation: string | null = null

  filterByLocation(location: string | null): void {
    this.selectedLocation = location
  }

  get filteredLetters(): Letter[] {
    if (!this.selectedLocation) {
      return this.letters
    }
    return this.letters.filter((letter) => letter.location === this.selectedLocation)
  }
}


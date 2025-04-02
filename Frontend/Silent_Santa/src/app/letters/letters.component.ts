// src/app/letters/letters.component.ts
import { Component, OnInit } from '@angular/core';
import { LettersService } from '../services/letters.service';
import { Letters } from '../models/letters.model';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-letters',
  standalone:true,
  templateUrl: './letters.component.html',
  imports:[CommonModule,RouterModule],
  styleUrls: ['./letters.component.css']
})
export class LettersComponent implements OnInit {
  letters: Letters[] = [];
  filteredLetters: Letters[] = [];
  searchQuery: string = '';
  
  // Filter properties – you can adjust these as needed
  selectedLocation: string | null = null;
  selectedGender: string | null = null;
  selectedAgeRange: number | null = null;
  locations: string[] = [];
  ageRanges: number[] = [3, 4, 5, 6, 7]; // Example age ranges

  constructor(private lettersService: LettersService) { }

  ngOnInit(): void {
    this.fetchLetters();
  }

  // Fetch letters from the backend
  fetchLetters(): void {
    this.lettersService.getLetters().subscribe({
      next: (data: Letters[]) => {
        this.letters = data;
        this.filteredLetters = data;
        // Optionally, derive available locations from letters
        this.locations = [
          ...new Set(
            data
              .map(letter => letter.location)
              .filter((loc): loc is string => loc !== undefined)
          )
        ];
        
      },
      error: (err) => {
        console.error('Error fetching letters:', err);
      }
    });
  }

  // Clear all filters and search
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLocation = null;
    this.selectedGender = null;
    this.selectedAgeRange = null;
    this.filteredLetters = [...this.letters];
  }

  // Update search results based on input
  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    const query = this.searchQuery.toLowerCase();
    this.filteredLetters = this.letters.filter(letter =>
      letter.childName.toLowerCase().includes(query) ||
      // Note: Changed from "letter.items" to "letter.wishList"
      (letter.wishList && letter.wishList.some(item => item.toLowerCase().includes(query)))
    );
  }

  // Toggle between showing the letter content and image
  toggleLetterView(letter: Letters, event: Event): void {
    letter.showImage = !letter.showImage;
  }

  // Toggle favorite status
  toggleFavorite(letter: Letters): void {
    letter.isFavorite = !letter.isFavorite;
  }

  // Mark a letter as requested
  requestLetter(letter: Letters): void {
    letter.isRequested = true;
  }

  // Filtering by location
  filterByLocation(location: string | null): void {
    this.selectedLocation = location;
    this.filteredLetters = this.letters.filter(letter =>
      location ? letter.location === location : true
    );
  }

  // Filtering by gender
  filterByGender(gender: string | null): void {
    this.selectedGender = gender;
    this.filteredLetters = this.letters.filter(letter =>
      gender ? letter.gender === gender : true
    );
  }

  // Filtering by age range
  filterByAgeRange(ageRange: number | null): void {
    this.selectedAgeRange = ageRange;
    this.filteredLetters = this.letters.filter(letter =>
      ageRange ? letter.childAge === ageRange : true
    );
  }
}

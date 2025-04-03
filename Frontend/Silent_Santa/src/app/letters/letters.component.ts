import { Component, OnInit } from '@angular/core';
import { LettersService } from '../services/letters.service';
import { Letters } from '../models/letters.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-letters',
  standalone: true,
  templateUrl: './letters.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./letters.component.css']
})
export class LettersComponent implements OnInit {
handleImageError($event: ErrorEvent) {
throw new Error('Method not implemented.');
}
  letters: Letters[] = [];
  filteredLetters: Letters[] = [];
  searchQuery = '';
  
  // Filter properties
  selectedLocation: string | null = null;
  selectedGender: string | null = null;
  selectedAgeRange: number | null = null;
  locations: string[] = [];
  ageRanges: number[] = [ ];
  
  // Edit letter properties
  editForm: FormGroup;
  isEditing = false;
  currentEditLetter: Letters | null = null;
  
  // Status options
  statusOptions = ['WAITING', 'WORKING', 'DONE'];
  
  // Loading and error states
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private lettersService: LettersService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      childName: ['', Validators.required],
      childAge: [null, [Validators.required, Validators.min(1), Validators.max(18)]],
      gender: ['', Validators.required],
      location: ['', Validators.required],
      imagePath: [''],
      status: ['WAITING', Validators.required],
      wishList: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchLetters();
  }

  // Fetch letters from the backend
  fetchLetters(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.lettersService.getLetters().subscribe({
      next: (data: Letters[]) => {
        this.letters = data;
        this.applyFilters();
        
        // Extract unique locations from letters
        this.locations = [
          ...new Set(
            data
              .map(letter => letter.location)
              .filter((loc): loc is string => loc !== undefined)
          )
        ];
        
        this.ageRanges = [
          ...new Set(
            data
              .map(letter => letter.childAge)
              .filter((loc): loc is number => loc !== undefined)
          )
        ];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load letters. Please try again.';
        this.isLoading = false;
        console.error('Error fetching letters:', err);
      }
    });
  }

  // Apply all current filters
  applyFilters(): void {
    this.filteredLetters = this.letters.filter(letter => {
      // Filter by location
      if (this.selectedLocation && letter.location !== this.selectedLocation) {
        return false;
      }

      // Filter by gender
      if (this.selectedGender && letter.gender !== this.selectedGender) {
        return false;
      }

      // Filter by age
      if (this.selectedAgeRange && letter.childAge !== this.selectedAgeRange) {
        return false;
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const nameMatch = letter.childName.toLowerCase().includes(query);
        const titleMatch = letter.title.toLowerCase().includes(query);
        const wishListMatch = letter.wishList.some(item => 
          item.toLowerCase().includes(query)
        );
        
        if (!nameMatch && !titleMatch && !wishListMatch) {
          return false;
        }
      }
      
      return true;
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
    this.applyFilters();
  }

  // Toggle between showing the letter content and image
  toggleLetterView(letter: Letters, event: Event)
: void
{
  // Only toggle on double click
  if (event instanceof MouseEvent && event.detail === 2) {
    letter.showImage = !letter.showImage

    // Debug message
    if (letter.showImage) {
      console.log("Showing image for letter:", letter.id)
      console.log("Image path:", letter.imagePath)
      console.log("Full image URL:", this.getImageSrc(letter.imagePath))
    }
  }
}

  // Toggle favorite status - FIXED: Now handles event internally
  toggleFavorite(letter: Letters): void {
    const previousState = letter.isFavorite;
    letter.isFavorite = !letter.isFavorite;
    
    // Call the service to update on the server
    this.lettersService.toggleFavorite(letter.id, letter.isFavorite).subscribe({
      next: (response) => {
        this.successMessage = letter.isFavorite ? 
          'Letter added to favorites!' : 
          'Letter removed from favorites!';
          
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        // Revert the change if the server update fails
        letter.isFavorite = previousState;
        this.errorMessage = 'Failed to update favorite status. Please try again.';
        console.error('Error toggling favorite status:', err);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  // Mark a letter as requested - FIXED: Now handles event internally
  requestLetter(letter: Letters): void {
    if (!letter.isRequested) {
      const previousState = letter.isRequested;
      letter.isRequested = true;
      
      // Call the service to update on the server
      this.lettersService.requestLetter(letter.id).subscribe({
        next: (response) => {
          this.successMessage = 'Letter requested successfully!';
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          // Revert the change if the server update fails
          letter.isRequested = previousState;
          this.errorMessage = 'Failed to request letter. Please try again.';
          console.error('Error requesting letter:', err);
          
          // Clear error message after 3 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  // Change letter status
  changeStatus(letter: Letters, status: string): void {
    const previousStatus = letter.status;
    letter.status = status;
    
    this.lettersService.changeStatus(letter.id, status).subscribe({
      next: (response) => {
        this.successMessage = `Letter status changed to ${status}!`;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        // Revert the change if the server update fails
        letter.status = previousStatus;
        this.errorMessage = 'Failed to update letter status. Please try again.';
        console.error('Error changing letter status:', err);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  // Delete a letter
  deleteLetter(letter: Letters): void {
    if (confirm(`Are you sure you want to delete the letter from ${letter.childName}?`)) {
      this.lettersService.deleteLetter(letter.id).subscribe({
        next: (success) => {
          if (success) {
            // Remove the letter from the arrays
            this.letters = this.letters.filter(l => l.id !== letter.id);
            this.filteredLetters = this.filteredLetters.filter(l => l.id !== letter.id);
            
            this.successMessage = 'Letter deleted successfully!';
            
            // Clear success message after 3 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            this.errorMessage = 'Failed to delete letter. Please try again.';
          }
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete letter. Please try again.';
          console.error('Error deleting letter:', err);
          
          // Clear error message after 3 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  // Open edit form for a letter
  editLetter(letter: Letters): void {
    this.currentEditLetter = letter;
    this.isEditing = true;
    
    // Populate the form with the letter data
    this.editForm.patchValue({
      title: letter.title,
      childName: letter.childName,
      childAge: letter.childAge,
      gender: letter.gender,
      location: letter.location,
      imagePath: letter.imagePath,
      status: letter.status
    });
  }

  // Cancel editing
  cancelEdit(): void {
    this.isEditing = false;
    this.currentEditLetter = null;
    this.editForm.reset();
  }

  // Save edited letter
  saveEdit(): void {
    if (this.editForm.invalid || !this.currentEditLetter) {
      return;
    }
    
    const updatedLetter: Letters = {
      ...this.currentEditLetter,
      ...this.editForm.value
    };
    
    this.lettersService.updateLetter(updatedLetter).subscribe({
      next: (response) => {
        // Update the letter in the arrays
        this.letters = this.letters.map(l => 
          l.id === response.id ? response : l
        );
        this.filteredLetters = this.filteredLetters.map(l => 
          l.id === response.id ? response : l
        );
        
        this.successMessage = 'Letter updated successfully!';
        this.isEditing = false;
        this.currentEditLetter = null;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update letter. Please try again.';
        console.error('Error updating letter:', err);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  // Filtering by location
  filterByLocation(location: string | null): void {
    this.selectedLocation = location;
    this.applyFilters();
  }

  // Filtering by gender
  filterByGender(gender: string | null): void {
    this.selectedGender = gender;
    this.applyFilters();
  }

  // Filtering by age range
  filterByAgeRange(ageRange: number | null): void {
    this.selectedAgeRange = ageRange;
    this.applyFilters();
  }
  
  // Navigate to add letter page
  navigateToAddLetter(): void {
    window.location.href = '/letters/add';
  }
  getImageSrc(imagePath: string | undefined): string
{
  if (!imagePath) {
    return 'assets/letter.png'; // Default image
  }

  // If the path already includes 'assets/', don't add it again
  if (imagePath.startsWith("assets/")) {
    return imagePath;
  }

  return 'assets/letters/' + imagePath;
}

// Add this to your toggleLetterView method

 

}

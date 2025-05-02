import { Component, OnInit } from '@angular/core';
import { LettersService } from '../services/letters.service';
import { Letters } from '../models/letters.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-letters',
  standalone: true,
  templateUrl: './favorites.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./favorites.component.css']
})
 
export class FavoritesComponent implements OnInit {
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
    private authService: AuthService,
    private lettersService: LettersService,
    private favoritesService: FavoritesService,
    private requestService: RequestsService,
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
    this.fetchFavoritesLetters()
    //this.loadFavoriteStatus()
  }

  // Fetch letters from the backend
  fetchFavoritesLetters(): void {
    this.isLoading = true
    this.errorMessage = ""
   
    const currentUser = this.authService.getCurrentUser()
    if (currentUser) {
      const userId = currentUser.id
   
      this.favoritesService.getUserFavorites(userId).subscribe({
        next: (favoriteLetters: Letters[]) => {
          this.letters = favoriteLetters.map(letter => {
            letter.isFavorite = true;   
            return letter;
          }); 
          this.locations = [
            ...new Set(favoriteLetters.map((letter) => letter.location).filter((loc): loc is string => loc !== undefined)),
          ]
  
          this.ageRanges = [
            ...new Set(favoriteLetters.map((letter) => letter.childAge).filter((age): age is number => age !== undefined)),
          ]  
          this.applyFilters()
  
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = "Failed to load favorites. Please try again."
          this.isLoading = false
          console.error("Error fetching favorites:", err)
        },
      })
                // Get user's requets and update letter.isReq property
          this.requestService.getUserRequests(userId).subscribe({
            next: (reqLetters: Letters[]) => { 
              const reqIds = new Set(reqLetters.map((letter) => letter.id))
 
              this.letters.forEach((letter) => {
                letter.isRequested = reqIds.has(letter.id)
              })
 
              
            },
            error: (err) => {
              console.error("Error loading requests:", err) 
              this.applyFilters()
            },
          })
          // Get user's requets and update letter.isReq property
          this.requestService.getUserRequests(userId).subscribe({
            next: (reqLetters: Letters[]) => { 
              const reqIds = new Set(reqLetters.map((letter) => letter.id))
 
              this.letters.forEach((letter) => {
                letter.isRequested = reqIds.has(letter.id)
              })
 
              
            },
            error: (err) => {
              console.error("Error loading requests:", err) 
              this.applyFilters()
            },
          })
    } else {
      this.errorMessage = "Please log in to view your favorite letters."
      this.isLoading = false
    }
  }
  
  loadFavoriteStatus(): void {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      return // User not logged in
    }

    const userId = currentUser.id

    // Get all user favorites
    this.favoritesService.getUserFavorites(userId).subscribe({
      next: (favoriteLetters: Letters[]) => {
        // Create a set of favorite letter IDs for quick lookup
        const favoriteIds = new Set(favoriteLetters.map((letter) => letter.id))

        // Update isFavorite flag on all letters
        this.letters.forEach((letter) => {
          letter.isFavorite = favoriteIds.has(letter.id)
        })

        // Update filtered letters as well
        this.filteredLetters.forEach((letter) => {
          letter.isFavorite = favoriteIds.has(letter.id)
        })
      },
      error: (err) => {
        console.error("Error loading favorites:", err)
      },
    })
  }

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
 
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLocation = null;
    this.selectedGender = null;
    this.selectedAgeRange = null;
    this.filteredLetters = [...this.letters];
  }
 
  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.applyFilters();
  }

  
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
 //FAV
  toggleFavorite(letter: Letters): void {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      this.errorMessage = "You must be logged in to favorite letters."
      setTimeout(() => {
        this.errorMessage = ""
      }, 3000)
      return
    }

    const userId = currentUser.id
    const previousState = letter.isFavorite

    // Optimistically update UI
    letter.isFavorite = !letter.isFavorite

    if (letter.isFavorite) {
      // Add to favorites
      this.favoritesService.addFavorite(userId, letter.id).subscribe({
        next: () => {
          this.successMessage = "Letter added to favorites!"
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err) => {
          // Revert the change if the server update fails
          letter.isFavorite = previousState
          this.errorMessage = "Failed to add to favorites. Please try again."
          console.error("Error adding to favorites:", err)
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
    } else {
      // Remove from favorites
      this.favoritesService.removeFavorite(userId, letter.id).subscribe({
        next: () => {
          this.successMessage = "Letter removed from favorites!"
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err) => {
          // Revert the change if the server update fails
          letter.isFavorite = previousState
          this.errorMessage = "Failed to remove from favorites. Please try again."
          console.error("Error removing from favorites:", err)
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
    }
  }
   
  //REQ 
  requestLetter(letter: Letters): void {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      this.errorMessage = "You must be logged in to request letters."
      setTimeout(() => {
        this.errorMessage = ""
      }, 3000)
      return
    }
    const userId = currentUser.id
    const previousState = letter.isRequested
    letter.isRequested = !letter.isRequested

    if (letter.isRequested) {
      // Add to requests
      this.requestService.addRequest(userId, letter.id).subscribe({
        next: () => {
          this.successMessage = "Letter Requested!"
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err  ) => {
          // Revert the change if the server update fails
          letter.isRequested = previousState
          this.errorMessage = "Failed to request. Please try again."
          console.error("Error request:", err)
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
    } else {
      // Remove from favorites
      this.requestService.removeRequest(userId, letter.id).subscribe({
        next: () => {
          this.successMessage = "Letter removed from requests!"
          setTimeout(() => {
            this.successMessage = ""
          }, 3000)
        },
        error: (err ) => {
          // Revert the change if the server update fails
          letter.isRequested = previousState
          this.errorMessage = "Failed to remove from rq. Please try again."
          console.error("Error removing from rq:", err)
          setTimeout(() => {
            this.errorMessage = ""
          }, 3000)
        },
      })
    }
  }
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
 
  cancelEdit(): void {
    this.isEditing = false;
    this.currentEditLetter = null;
    this.editForm.reset();
  }
 
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
 
  filterByLocation(location: string | null): void {
    this.selectedLocation = location;
    this.applyFilters();
  }
 
  filterByGender(gender: string | null): void {
    this.selectedGender = gender;
    this.applyFilters();
  }
 
  filterByAgeRange(ageRange: number | null): void {
    this.selectedAgeRange = ageRange;
    this.applyFilters();
  }
   
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


}

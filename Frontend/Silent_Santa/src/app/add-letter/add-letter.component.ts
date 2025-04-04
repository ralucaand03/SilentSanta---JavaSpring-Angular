import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LettersService } from '../services/letters.service';
import { AuthService } from '../services/auth.service'; // Make sure this path is correct
import { HttpErrorResponse } from '@angular/common/http';
import { LetterCreation } from '../models/letter-creation.model';

@Component({
  selector: 'app-add-letter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-letter.component.html',
  styleUrls: ['./add-letter.component.css']
})
export class AddLetterComponent implements OnInit {
  letterForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private lettersService: LettersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.letterForm = this.fb.group({
      title: ['', Validators.required],
      childName: ['', Validators.required],
      childAge: [null, [Validators.required, Validators.min(1), Validators.max(18)]],
      gender: ['', Validators.required],
      location: ['', Validators.required],
      imagePath: [''],
      wishList: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  ngOnInit(): void {
    // Check if user is admin
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role === 'ADMIN') {
      this.isAdmin = true;
    } else {
      this.router.navigate(['/letters']);
    }
  }
  
  get wishListArray(): FormArray {
    return this.letterForm.get('wishList') as FormArray;
  }

  addWishItem(): void {
    this.wishListArray.push(this.fb.control('', Validators.required));
  }

  removeWishItem(index: number): void {
    if (this.wishListArray.length > 1) {
      this.wishListArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.letterForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Get the current user
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to add a letter.';
      this.isLoading = false;
      return;
    }

    // Filter out empty wish list items
    const filteredWishList = this.letterForm.value.wishList
      .filter((item: string) => item && item.trim() !== '');
    
    if (filteredWishList.length === 0) {
      this.errorMessage = 'At least one wish list item is required.';
      this.isLoading = false;
      return;
    }

    // Create the letter data with user information
    const letterData: LetterCreation & { postedBy: { id: string } } = {
      title: this.letterForm.value.title,
      childName: this.letterForm.value.childName,
      childAge: this.letterForm.value.childAge,
      gender: this.letterForm.value.gender,
      location: this.letterForm.value.location,
      imagePath: this.letterForm.value.imagePath || null,
      wishList: filteredWishList,
      status: 'WAITING',
      // Include the user ID to help the backend identify the user
      postedBy: {
        id: currentUser.id
      }
    };
    
    console.log('Sending letter data:', letterData);
    
    // Use the direct HTTP post method to have more control over the request
    this.lettersService.createLetterWithUser(letterData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Letter added successfully! Notification emails have been sent to subscribers.';
        this.letterForm.reset();
        // Reset wishList to have one empty item
        this.wishListArray.clear();
        this.addWishItem();
        
        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/letters']);
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Error adding letter:', error);
        
        // More detailed error logging
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          this.errorMessage = `Client error: ${error.error.message}`;
        } else {
          // Server-side error
          this.errorMessage = `Server error: ${error.status} - ${error.statusText}`;
          if (error.error && typeof error.error === 'object' && error.error.message) {
            this.errorMessage += ` - ${error.error.message}`;
          } else if (typeof error.error === 'string') {
            this.errorMessage += ` - ${error.error}`;
          }
          
          // Log the response body for debugging
          console.log('Error response body:', error.error);
        }
      }
    });
  }
}

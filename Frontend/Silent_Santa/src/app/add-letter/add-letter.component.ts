import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LettersService } from '../services/letters.service';
import { AuthService } from '../services/auth.service';

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
    this.authService.getCurrentUser()?.role === 'ADMIN' ? this.isAdmin = true : this.router.navigate(['/letters']);
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

    const letterData = this.letterForm.value;
    
    this.lettersService.addLetter(letterData).subscribe({
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
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to add letter. Please try again.';
      }
    });
  }
}

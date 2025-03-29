import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,  // Ensure this is set to true for standalone components
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Simulating authentication (you can replace this with actual logic)
  isAuthenticated: boolean = false;  // Change to true for testing authenticated state
  
  // Toggle the dropdown visibility
  dropdownOpen: boolean = false;

  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Simulate logging out (you would replace this with your actual logout logic)
  logOut() {
    console.log('User logged out');
    this.isAuthenticated = false;  // Set to false when logging out
    this.dropdownOpen = false;     // Close the dropdown on logout
  }
}

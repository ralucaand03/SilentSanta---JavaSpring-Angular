import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-header',
  standalone: true,  // Ensure this is set to true for standalone components
  imports: [CommonModule],  // Add CommonModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated: boolean = false;  // Simulated authentication state
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logOut() {
    console.log('User logged out');
    this.isAuthenticated = false;
    this.dropdownOpen = false;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,  // Ensure this is set to true
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
dropdownOpen: any;
toggleMobileMenu() {
throw new Error('Method not implemented.');
}
mobileMenuOpen: any;
toggleDropdown() {
throw new Error('Method not implemented.');
}
logOut() {
throw new Error('Method not implemented.');
}
}

import { Component } from '@angular/core';
import { NotificationBellComponent } from "../notification/notification.component";

@Component({
  selector: 'app-header',
  standalone: true,   
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NotificationBellComponent]
})
export class HeaderComponent {
[x: string]: any;
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

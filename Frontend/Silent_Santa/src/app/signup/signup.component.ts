import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  role: string = ''; 

  onSignupSubmit() {
    if (!this.role) {
      alert('Please select a role (Giver or Helper)');
      return;
    }
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Phone:', this.phone);
    console.log('Password:', this.password);
    console.log('Role:', this.role);
  }
  selectRole(role: string) {
    this.role = role;  // Set the selected role
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";  // Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HeaderComponent], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onLoginSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}

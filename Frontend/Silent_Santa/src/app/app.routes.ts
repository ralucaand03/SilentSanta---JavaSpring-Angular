import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Assuming the Login component path

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
  { path: 'login', component: LoginComponent },
 ];

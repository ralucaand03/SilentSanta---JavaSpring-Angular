import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';  
import { SignupComponent } from './signup/signup.component';
import { LettersComponent } from './letters/letters.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MyLettersComponent } from './my-letters/my-letters.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'letters', component:LettersComponent},
  { path: 'favorites', component:FavoritesComponent},
  { path: 'my-letters', component: MyLettersComponent}

 ];
 @NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
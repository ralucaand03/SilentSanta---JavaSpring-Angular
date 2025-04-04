import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';  
import { SignupComponent } from './signup/signup.component';
import { LettersComponent } from './letters/letters.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { MyLettersComponent } from './my-letters/my-letters.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AddLetterComponent } from './add-letter/add-letter.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'letters', component:LettersComponent},
  { path: 'favorites', component:FavoritesComponent},
  { path: 'my-letters', component: MyLettersComponent},
  { path: "my-account", component: MyAccountComponent},
  { path: "add-letter", component: AddLetterComponent},
  { path: "about-us", component:AboutUsComponent},
  { path: "contact", component:ContactComponent},
  { path: "faq", component:FaqComponent},
  { path: "privacy-policy", component:PrivacyPolicyComponent}
 ];
 @NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
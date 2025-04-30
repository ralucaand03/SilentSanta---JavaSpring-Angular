import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-my-letters',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './my-letters.component.html',
  styleUrl: './my-letters.component.css'
})
export class MyLettersComponent {

}
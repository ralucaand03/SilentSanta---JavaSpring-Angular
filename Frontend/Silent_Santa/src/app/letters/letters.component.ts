import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-letters',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './letters.component.html',
  styleUrl: './letters.component.css'
})
export class LettersComponent {

}

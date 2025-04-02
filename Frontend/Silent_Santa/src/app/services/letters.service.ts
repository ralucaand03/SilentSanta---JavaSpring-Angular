import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Letters } from '../models/letters.model';

@Injectable({ providedIn: 'root' })
 
export class LettersService {

    private baseUrl = 'http://localhost:8080/api/letters';

  constructor(private http: HttpClient) {}

  getLetters(): Observable<Letters[]> {
    return this.http.get<Letters[]>(this.baseUrl);
  }
}

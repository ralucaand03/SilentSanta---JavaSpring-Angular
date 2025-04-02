import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Letters } from '../models/letters.model';

@Injectable({
  providedIn: 'root'
})
export class LettersService {
  private baseUrl = 'http://localhost:8080/api/letters';

  constructor(private http: HttpClient) {}

  // Get all letters
  getLetters(): Observable<Letters[]> {
    return this.http.get<Letters[]>(this.baseUrl);
  }

  // Get a specific letter by ID
  getLetterById(id: string): Observable<Letters> {
    return this.http.get<Letters>(`${this.baseUrl}/${id}`);
  }

  // Add a new letter
  addLetter(letter: Letters): Observable<Letters> {
    return this.http.post<Letters>(`${this.baseUrl}/create`, letter);
  }

  // Update an existing letter
  updateLetter(letter: Letters): Observable<Letters> {
    return this.http.put<Letters>(`${this.baseUrl}/${letter.id}`, letter);
  }

  // Delete a letter
  deleteLetter(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  // Toggle favorite status
  toggleFavorite(id: string, isFavorite: boolean): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/favorite`, { isFavorite });
  }

  // Request a letter
  requestLetter(id: string): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/request`, {});
  }

  // Change letter status
  changeStatus(id: string, status: string): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/status`, { status });
  }
}

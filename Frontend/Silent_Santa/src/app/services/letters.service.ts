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
 
  getLetters(): Observable<Letters[]> {
    return this.http.get<Letters[]>(this.baseUrl);
  }
 
  getLetterById(id: string): Observable<Letters> {
    return this.http.get<Letters>(`${this.baseUrl}/${id}`);
  }
 
  addLetter(letter: Letters): Observable<Letters> {
    return this.http.post<Letters>(`${this.baseUrl}/create`, letter);
  }
 
  updateLetter(letter: Letters): Observable<Letters> {
    return this.http.put<Letters>(`${this.baseUrl}/${letter.id}`, letter);
  }
 
  deleteLetter(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
 
  toggleFavorite(id: string, isFavorite: boolean): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/favorite`, { isFavorite });
  }
 
  requestLetter(id: string): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/request`, {});
  }
 
  changeStatus(id: string, status: string): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/status`, { status });
  }
}

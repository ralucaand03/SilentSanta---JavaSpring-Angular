import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Letters } from '../models/letters.model';
import { LetterCreation } from '../models/letter-creation.model';

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
  
  createLetter(letterDTO: LetterCreation): Observable<Letters> {
    return this.http.post<Letters>(`${this.baseUrl}/create`, letterDTO);
  }

  // New method that includes user information
  createLetterWithUser(letterData: any): Observable<Letters> {
    // Add headers to ensure proper content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Letters>(`${this.baseUrl}/create`, letterData, { headers });
  }
  
  updateLetter(letter: Letters): Observable<Letters> {
    return this.http.put<Letters>(`${this.baseUrl}/${letter.id}`, letter);
  }
 
  deleteLetter(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
 
  requestLetter(id: string): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/request`, {});
  }
 
  changeStatus(id: string, status: string): Observable<Letters> {
    return this.http.patch<Letters>(`${this.baseUrl}/${id}/status`, { status });
  }
}
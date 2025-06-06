import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs'; 
import { Letters } from '../models/letters.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://localhost:8080/api/favorites';

  constructor(private http: HttpClient) {} 

  getUserFavorites(userId: string): Observable<Letters[]> {
    return this.http.get<Letters[]>(`${this.baseUrl}/user/${userId}`);
  }
 
  addFavorite(userId: string, letterId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/${userId}/letter/${letterId}`, {});
  }
   
  removeFavorite(userId: string, letterId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/${userId}/letter/${letterId}`);
  }
  
  checkFavorite(userId: string, letterId: string): Observable<{isFavorite: boolean}> {
    return this.http.get<{isFavorite: boolean}>(`${this.baseUrl}/user/${userId}/letter/${letterId}`);
  }
  
  getUserFavoriteCount(userId: string): Observable<number> {
    return this.getUserFavorites(userId).pipe(
      map(favorites => favorites.length)
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscriber } from '../models/subscriber.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  private apiUrl = 'http://localhost:8080/api/subscriber/subscribe';

  constructor(private http: HttpClient) { }

  subscribeToNewsletter(subscriber: Subscriber): Observable<string> { 
    return this.http.post(this.apiUrl, subscriber.email, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'   
    });
  }
}

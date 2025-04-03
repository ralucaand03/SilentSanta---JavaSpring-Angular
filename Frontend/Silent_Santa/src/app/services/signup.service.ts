import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignUp } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class LettersService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

}
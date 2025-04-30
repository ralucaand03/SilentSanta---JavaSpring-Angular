import { Injectable } from "@angular/core"
import   { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Letters } from "../models/letters.model"
import { LettersService } from "./letters.service"

@Injectable({
  providedIn: "root",
})
export class LettersWrapperService extends LettersService {
  private apiUrl = "http://localhost:8080/api/letters"
  private httpClient: HttpClient

  constructor(http: HttpClient) {
    super(http)
    this.httpClient = http // Store our own reference to HttpClient
  }

  // Get letters requested by the current user with status WAITING
  getRequestedLetters(): Observable<Letters[]> {
    return this.httpClient.get<Letters[]>(`${this.apiUrl}/requested/waiting`)
  }

  // Get letters accepted for the current user with status ACCEPTED
  getAcceptedLetters(): Observable<Letters[]> {
    return this.httpClient.get<Letters[]>(`${this.apiUrl}/requested/accepted`)
  }

  // Get letters posted by the current user (admin only)
  getMyPostedLetters(): Observable<Letters[]> {
    return this.httpClient.get<Letters[]>(`${this.apiUrl}/posted`)
  }
}


import { Injectable } from "@angular/core"
import   { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Letters } from "../models/letters.model"

export interface Request {
  id: string
  userId: string
  letterId: string
  status: "WAITING" | "ACCEPTED" | "DENIED"
  letter?: Letters
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

@Injectable({
  providedIn: "root",
})
export class RequestsService {
  private baseUrl = "http://localhost:8080/api/requests"

  constructor(private http: HttpClient) {}

  // Get all requests made by a user
  getUserRequests(userId: string): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.baseUrl}/user/${userId}`)
  }

  // Get all requests for letters posted by a user
  getLetterOwnerRequests(userId: string): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.baseUrl}/letter-owner/${userId}`)
  }

  // Create a new request
  createRequest(userId: string, letterId: string): Observable<Request> {
    return this.http.post<Request>(`${this.baseUrl}/user/${userId}/letter/${letterId}`, {})
  }

  // Update request status (accept or deny)
  updateRequestStatus(requestId: string, status: "ACCEPTED" | "DENIED"): Observable<Request> {
    return this.http.put<Request>(`${this.baseUrl}/${requestId}/status`, { status })
  }

  // Check if a user has already requested a letter
  checkRequestExists(userId: string, letterId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check/user/${userId}/letter/${letterId}`)
  }

  // Delete a request
  deleteRequest(requestId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${requestId}`)
  }
}

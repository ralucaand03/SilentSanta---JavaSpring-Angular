import { Injectable } from "@angular/core"
import   { HttpClient } from "@angular/common/http"
import   { Observable } from "rxjs"
import   { Letters } from "../models/letters.model"
import { LetterRequest } from "../models/letter-request.model"
import { User } from "../models/user.model"
 

 
@Injectable({
  providedIn: "root",
})
export class RequestsService {
  private baseUrl = "http://localhost:8080/api/requests"

  constructor(private http: HttpClient) {}
  
  getLetterOwnerRequests(userId: string): Observable<LetterRequest[]> {
    return this.http.get<LetterRequest[]>(`${this.baseUrl}/letter-owner/${userId}`)
  }

  updateRequestStatus(requestId: string, status: "ACCEPTED" | "DENIED", admin: User): Observable<any> {
    if (status === "ACCEPTED") {
      return this.acceptRequest(requestId, admin)
    } else {
      return this.denyRequest(requestId, admin)
    }
  }
  acceptRequest(requestId: string, admin: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/${requestId}/accept`, admin)
  }

  // New method to deny a request
  denyRequest(requestId: string, admin: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/${requestId}/deny`, admin)
  }
  getUserRequests(userId: string): Observable<Letters[]> {
    return this.http.get<Letters[]>(`${this.baseUrl}/user/${userId}`);
  }
   
  addRequest(userId: string, letterId: string): Observable<any> {
      return this.http.post(`${this.baseUrl}/user/${userId}/letter/${letterId}`, {});
  }
     
  removeRequest(userId: string, letterId: string): Observable<any> {
      return this.http.delete(`${this.baseUrl}/user/${userId}/letter/${letterId}`);
  }
    
  checkRequest(userId: string, letterId: string): Observable<{isRequested: boolean}> {
      return this.http.get<{isRequested: boolean}>(`${this.baseUrl}/user/${userId}/letter/${letterId}`);
  } 
   
}
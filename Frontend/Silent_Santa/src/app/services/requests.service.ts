import { Injectable } from "@angular/core"
import   { HttpClient } from "@angular/common/http"
import   { Observable } from "rxjs"
import   { Letters } from "../models/letters.model"
 

 
@Injectable({
  providedIn: "root",
})
export class RequestsService {
  private baseUrl = "http://localhost:8080/api/requests"

  constructor(private http: HttpClient) {}
  
  getLetterOwnerRequests(userId: string): Observable<Letters[]> {
    return this.http.get<Letters[]>(`${this.baseUrl}/letter-owner/${userId}`)
  }
  
  updateRequestStatus(requestId: string, status: "ACCEPTED" | "DENIED"): Observable<Letters> {
    return this.http.put<Letters>(`${this.baseUrl}/${requestId}/status`, { status })
  }
 
  checkRequestExists(userId: string, letterId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check/user/${userId}/letter/${letterId}`)
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

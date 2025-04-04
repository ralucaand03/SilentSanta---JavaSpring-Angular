import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"; // Change to regular import
import { Observable } from "rxjs"; // Regular import (no issues here)
import { SignUp } from "../models/signup.model";

@Injectable({
  providedIn: "root",
})
export class SignupService {
  private baseUrl = "http://localhost:8080/api/users";

  constructor(private http: HttpClient) {}
 
  private mapRoleToBackend(role: string): string {
    switch (role.toUpperCase()) {
      case "GIVER":
        return "USER";
      case "HELPER":
        return "ADMIN";
      default:
        return "USER";
    }
  }

  signup(user: SignUp): Observable<SignUp> { 
    const userToSend = {
      ...user,
      role: this.mapRoleToBackend(user.role),
    };

    return this.http.post<SignUp>(`${this.baseUrl}/signup`, userToSend);
  }
}

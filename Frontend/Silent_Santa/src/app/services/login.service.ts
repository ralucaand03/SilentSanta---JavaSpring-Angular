import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http" 
import { Observable, BehaviorSubject } from "rxjs"
import { tap } from "rxjs/operators"
import { LogIn } from "../models/login.model"
import { SignUp } from "../models/signup.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = "http://localhost:8080/api/users"
  private currentUserSubject = new BehaviorSubject<SignUp | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    // Check if user is stored in localStorage (for remember me)
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  login(credentials: LogIn): Observable<SignUp> {
    return this.http.post<SignUp>(`${this.baseUrl}/login`, credentials).pipe(
      tap((user) => {
        // Store user details in subject
        this.currentUserSubject.next(user)

        // If remember me is checked, store in localStorage
        if (credentials.rememberMe) {
          localStorage.setItem("currentUser", JSON.stringify(user))
        } else {
          // Otherwise, use sessionStorage (cleared when browser is closed)
          sessionStorage.setItem("currentUser", JSON.stringify(user))
        }
      }),
    )
  }
  // Add this helper function to your AuthService
  private mapRoleToBackend(role: string): string {
    // Map frontend roles to backend enum values
    switch (role.toUpperCase()) {
      case "GIVER":
        return "USER"
      case "HELPER":
        return "ADMIN"
      default:
        return "USER"
    }
  }
  signup(user: SignUp): Observable<SignUp> {
    const userToSend = {
      ...user,
      role: this.mapRoleToBackend(user.role),
    }
    return this.http.post<SignUp>(`${this.baseUrl}/signup`, user)
  }

  logout(): void {
    // Clear user from storage
    localStorage.removeItem("currentUser")
    sessionStorage.removeItem("currentUser")
    this.currentUserSubject.next(null)
  }

  getCurrentUser(): SignUp | null {
    return this.currentUserSubject.value
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value
  }
  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser()
    return user ? user.role : null
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRole = this.getUserRole()
    return userRole === role
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole("ADMIN")
  }
}
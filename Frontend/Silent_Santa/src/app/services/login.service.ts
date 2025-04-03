import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import { type Observable, BehaviorSubject } from "rxjs"
import { tap } from "rxjs/operators"
import type { LogIn } from "../models/login.model"
import type { SignUp } from "../models/signup.model"

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

  signup(user: SignUp): Observable<SignUp> {
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
}


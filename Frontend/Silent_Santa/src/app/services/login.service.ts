import { Injectable } from "@angular/core"
import   { HttpClient, HttpHeaders } from "@angular/common/http"
import { type Observable, BehaviorSubject } from "rxjs"
import { tap, catchError } from "rxjs/operators"
import type { LogIn } from "../models/login.model"
import type { SignUp } from "../models/signup.model"
import   { Router } from "@angular/router"
import { User } from "../models/user.model"
import type { AuthResponseData } from "../models/auth.model"
import { throwError } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = "http://localhost:8080/api/users"
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private tokenExpirationTimer: any

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.autoLogin()
  }

  login(credentials: LogIn): Observable<AuthResponseData> {
    const my_url = this.baseUrl + "/login"

    // Simplify the login data to match what the backend expects
    const logInData = {
      email: credentials.email,
      password: credentials.password,
      // Remove role and returnSecureToken as they're not needed for login
    }

    // Add headers to ensure proper content type
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    })

    console.log("Attempting login with:", { email: credentials.email })

    return this.http.post<AuthResponseData>(my_url, logInData, { headers }).pipe(
      tap((response) => {
        console.log("Login response:", response)

        // Check if role exists in the response, if not use a default value
        const userRole = response.role || "USER"

        this.handleAuthentication(response.email, response.localId, userRole, response.idToken, response.expiresIn)
      }),
      catchError((error) => {
        console.error("Login error details:", error)
        return throwError(() => error)
      }),
    )
  }

  logOutUser() {
    this.currentUserSubject.next(null)
    localStorage.removeItem("userData")
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
    console.log("User logged out!")
    this.router.navigate(["/login"])
  }

  private handleAuthentication(email: string, userId: string, role: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, role, token, expirationDate)
    this.currentUserSubject.next(user)
    localStorage.setItem("userData", JSON.stringify(user))

    // Set auto logout timer
    this.autoLogout(expiresIn * 1000)
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOutUser()
    }, expirationDuration)
  }

  autoLogin() {
    if (typeof window === "undefined" || !window.localStorage) {
      return
    }
    const userDataStr = localStorage.getItem("userData")
    if (!userDataStr) {
      return
    }
    const userData: {
      email: string
      id: string
      role: string
      _token: string
      _tokenExpirationDate: string
    } = JSON.parse(userDataStr)
    if (!userData) {
      return
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.role,
      userData._token,
      new Date(userData._tokenExpirationDate),
    )
    if (loadedUser.token) {
      this.currentUserSubject.next(loadedUser)

      // Calculate remaining time and set auto logout
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  // private mapRoleToBackend(role: string): string {
  //   switch (role.toUpperCase()) {
  //     case "GIVER":
  //       return "USER";
  //     case "HELPER":
  //       return "ADMIN";
  //     default:
  //       return "USER";
  //   }
  // }

  signup(user: SignUp): Observable<SignUp> {
    const userToSend = {
      ...user,
      role:  user.role,
    }
    return this.http.post<SignUp>(`${this.baseUrl}/signup`, userToSend)
  }

  logout(): void {
    this.logOutUser() // Use the existing method for consistency
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.token
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser()
    return user ? user.role : null
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole()
    return userRole === role
  }

  isAdmin(): boolean {
    return this.hasRole("ADMIN")
  }

  // Get the token for use in HTTP interceptor
  getToken(): string | null {
    const user = this.getCurrentUser()
    return user ? user.token : null
  }
}


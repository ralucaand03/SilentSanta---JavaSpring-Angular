import { Injectable } from "@angular/core"
import {   HttpClient, HttpHeaders } from "@angular/common/http"
import {   Observable, BehaviorSubject } from "rxjs"
import { tap, catchError, finalize } from "rxjs/operators"
import   { LogIn } from "../models/login.model"
import   { SignUp } from "../models/signup.model"
import   { Router } from "@angular/router"
import { User } from "../models/user.model"
import   { AuthResponseData } from "../models/auth.model"
import { throwError } from "rxjs"
import   { ActivityService } from "./activity.service"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = "http://localhost:8080/api/users"
  currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private tokenExpirationTimer: any
  private isLoggingOut = false // Add flag to prevent multiple logouts

  constructor(
    private http: HttpClient,
    private router: Router,
    private activityService: ActivityService,
  ) {
    this.autoLogin()
  }

  private handleAuthentication(email: string, userId: string, role: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, role, token, expirationDate)
    this.currentUserSubject.next(user)
    localStorage.setItem("userData", JSON.stringify(user))

    // Reset logout flag when a user logs in
    this.isLoggingOut = false

    // Set auto logout timer
    this.autoLogout(expiresIn * 1000)
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout() // Changed to use the public logout method
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

  public getChatHistory(userId1: string, userId2: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/chat/history/${userId1}/${userId2}`)
  }

  // Updated method to log activities using ActivityService
  private logActivity(type: "LOGIN" | "LOGOUT"): Observable<any> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      console.error("Cannot log activity: No user is logged in")
      return throwError(() => new Error("No user logged in"))
    }

    // Return the observable instead of subscribing
    return this.activityService.logActivity(currentUser.id, type)
  }

  // Main public logout method that components will call
  logout(): void {
    // Check if logout is already in progress
    if (this.isLoggingOut) {
      console.log("Logout already in progress, ignoring duplicate request")
      return
    }

    const currentUser = this.getCurrentUser()

    if (currentUser) {
      // Set flag to prevent multiple logouts
      this.isLoggingOut = true

      // Log the logout activity and then complete the logout process
      this.logActivity("LOGOUT")
        .pipe(
          // Use finalize to ensure logout happens even if there's an error
          // and to reset the isLoggingOut flag
          finalize(() => {
            this.completeLogout()
            // Reset the flag after a short delay to prevent rapid successive clicks
            setTimeout(() => {
              this.isLoggingOut = false
            }, 1000)
          }),
        )
        .subscribe({
          next: () => console.log("Logout activity logged successfully"),
          error: (error) => {
            console.error("Error logging logout activity:", error)
            // Still complete the logout even if logging fails
            this.completeLogout()
          },
        })
    } else {
      // If no user is logged in, just complete the logout
      this.completeLogout()
    }
  }

  // Helper method to complete the logout process
  private completeLogout(): void {
    // Clear user data
    this.currentUserSubject.next(null)
    localStorage.removeItem("userData")

    // Clear timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null

    console.log("User logged out!")

    // Navigate to login page
    this.router.navigate(["/login"])
  }

  // Keep this for backward compatibility, but make it call the new logout method
  logOutUser() {
    this.logout()
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

  // Update login method
  login(credentials: LogIn): Observable<AuthResponseData> {
    const my_url = this.baseUrl + "/login"

    // Simplify the login data to match what the backend expects
    const logInData = {
      email: credentials.email,
      password: credentials.password,
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

        // Log the login activity to the database
        this.logActivity("LOGIN").subscribe({
          next: () => console.log("Login activity logged successfully"),
          error: (error) => console.error("Error logging login activity:", error),
        })
      }),
      catchError((error) => {
        console.error("Login error details:", error)
        return throwError(() => error)
      }),
    )
  }

  signup(user: SignUp): Observable<SignUp> {
    console.log("Signup service called with data:", {
      ...user,
      password: "[REDACTED]",
      captchaToken: user.captchaToken ? "Present" : "Missing",
    })

    // Add headers to ensure proper content type
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    })

    return this.http.post<SignUp>(`${this.baseUrl}/signup`, user, { headers })
  }
}

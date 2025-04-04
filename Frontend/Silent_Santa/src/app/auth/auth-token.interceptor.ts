import type { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"

// Convert the class-based interceptor to a functional interceptor
export const AuthTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  // Get the token from the auth service
  const token = authService.getToken()

  // If token exists, clone the request and add the authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Pass the modified request to the next handler
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401 Unauthorized response, the token might be expired
      if (error.status === 401) {
        authService.logout()
        router.navigate(["/login"])
      }
      return throwError(() => error)
    }),
  )
}


import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

// Functional route guard for Angular v18+
export const authGuard = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isLoggedIn()) {
    return true
  }

  router.navigate(["/login"])
  return false
}

// Keep the class-based guard for backward compatibility
import { Injectable } from "@angular/core"
import type { CanActivate } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true
    }

    this.router.navigate(["/login"])
    return false
  }
}


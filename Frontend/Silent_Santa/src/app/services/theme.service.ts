import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false)
  public darkMode$ = this.darkMode.asObservable()

  constructor() {
    this.loadThemePreference()
  }

  toggleDarkMode(): void {
    const newValue = !this.darkMode.value
    this.darkMode.next(newValue)
    this.saveThemePreference(newValue)
    this.applyTheme(newValue)
  }

  private loadThemePreference(): void {
    // Check localStorage first
    const savedPreference = localStorage.getItem("darkMode")

    if (savedPreference !== null) {
      // Use saved preference if available
      const isDarkMode = savedPreference === "true"
      this.darkMode.next(isDarkMode)
      this.applyTheme(isDarkMode)
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      this.darkMode.next(prefersDark)
      this.applyTheme(prefersDark)
    }
  }

  private saveThemePreference(isDarkMode: boolean): void {
    localStorage.setItem("darkMode", isDarkMode.toString())
  }

  private applyTheme(isDarkMode: boolean): void {
    if (isDarkMode) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }
}

import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import   { ThemeService } from "../services/theme.service"

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./theme-toggle.component.html",
  styleUrls: ["./theme-toggle.component.css"],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark
    })
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode()
  }
}

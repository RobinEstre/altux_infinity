import { Component } from '@angular/core';
import { LocalhostKeys } from './shared/enum/localhost-keys';
import { PersonalizationService } from './shared/services/personalization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'windoors';

  constructor(
    public personalizationService: PersonalizationService
  ) {
  }

  ngOnInit(): void {
    const themeColor = localStorage.getItem(LocalhostKeys.THEME_COLOR) ?? 'theme-blue';
    this.personalizationService.setThemeColor(themeColor, 'theme-blue');
    const sidebarFillColor = localStorage.getItem(LocalhostKeys.SIDEBAR_FILL_COLOR) ?? '';
    this.personalizationService.setSidebarFillColor(sidebarFillColor, '');
    const backgroundImage = localStorage.getItem(LocalhostKeys.BACKGROUND_IMAGE) ?? 'assets/img/bg-1.jpg';
    setTimeout(() => {
      this.personalizationService.setBackgroundImage(backgroundImage);
    }, 500);
    const sidebarStyle = localStorage.getItem(LocalhostKeys.SIDEBAR_STYLE) ?? 'sidebar-pushcontent';
    this.personalizationService.setSidebarStyle(sidebarStyle, 'sidebar-pushcontent');
    const theme = localStorage.getItem(LocalhostKeys.THEME) ?? 'sidebar-pushcontent';
    this.personalizationService.setTheme(theme, 'theme-blue');
    const mode = localStorage.getItem(LocalhostKeys.MODE) ?? 'light-mode';
    setTimeout(() => {
      const defaultMode = mode === 'light-mode' ? 'dark-mode' : 'light-mode';
      this.personalizationService.setMode(mode, defaultMode);
    }, 500);
  }

}

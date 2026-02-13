import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) { }

  async ngOnInit() {
    // Apply saved theme preferences on startup
    this.applyThemeOnStartup();

    if (this.platform.is('capacitor')) {
      try {
        await StatusBar.setBackgroundColor({ color: '#4F46E5' });
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (e) {
        console.log('StatusBar not available', e);
      }
    }
  }

  private applyThemeOnStartup() {
    // Dark mode
    const savedDarkMode = localStorage.getItem('le_news_dark_mode');
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      document.body.classList.toggle('dark', isDark);
      document.body.classList.toggle('light', !isDark);
    }

    // Text size
    const textSize = localStorage.getItem('le_news_text_size') || 'medium';
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    document.body.classList.add('text-' + textSize);
  }
}

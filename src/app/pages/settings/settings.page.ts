import { Component, OnInit } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonIcon, IonItem, IonLabel, IonToggle, IonButton, ToastController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CustomAlertService } from '../../shared/custom-alert.service';
import { BookmarksService } from '../../core/services/bookmarks.service';

@Component({
  selector: 'app-settings',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="page-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/profile"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="settings-content">
      <div class="settings-wrapper ion-padding">

        <!-- Appearance -->
        <div class="section-title">
          <ion-icon name="color-palette-outline"></ion-icon>
          <span>Appearance</span>
        </div>

        <div class="settings-group">
          <ion-item lines="none" class="settings-item">
            <ion-icon name="moon-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Dark Mode</h2>
              <p>{{ darkMode ? 'On' : 'Follow system' }}</p>
            </ion-label>
            <ion-toggle [(ngModel)]="darkMode" (ionChange)="toggleDarkMode()" slot="end"></ion-toggle>
          </ion-item>

          <ion-item lines="none" class="settings-item" button="true" (click)="changeTextSize()">
            <ion-icon name="text-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Text Size</h2>
              <p>{{ textSizeLabel }}</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end" class="chevron-icon"></ion-icon>
          </ion-item>
        </div>

        <!-- News Preferences -->
        <div class="section-title">
          <ion-icon name="newspaper-outline"></ion-icon>
          <span>News Preferences</span>
        </div>

        <div class="settings-group">
          <ion-item lines="none" class="settings-item" button="true" (click)="changeRegion()">
            <ion-icon name="globe-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Region</h2>
              <p>{{ getRegionFlag(selectedRegionCode) }} {{ getRegionName(selectedRegionCode) }}</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end" class="chevron-icon"></ion-icon>
          </ion-item>

          <ion-item lines="none" class="settings-item">
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Auto Refresh</h2>
              <p>{{ autoRefresh ? 'Every 5 minutes' : 'Manual only' }}</p>
            </ion-label>
            <ion-toggle [(ngModel)]="autoRefresh" (ionChange)="savePreference('le_news_auto_refresh', autoRefresh)" slot="end"></ion-toggle>
          </ion-item>

          <ion-item lines="none" class="settings-item">
            <ion-icon name="image-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Load Images</h2>
              <p>{{ loadImages ? 'Show thumbnails' : 'Text only mode' }}</p>
            </ion-label>
            <ion-toggle [(ngModel)]="loadImages" (ionChange)="savePreference('le_news_load_images', loadImages)" slot="end"></ion-toggle>
          </ion-item>
        </div>

        <!-- Data Management -->
        <div class="section-title">
          <ion-icon name="server-outline"></ion-icon>
          <span>Data Management</span>
        </div>

        <div class="settings-group">
          <ion-item lines="none" class="settings-item" button="true" (click)="clearCache()">
            <ion-icon name="trash-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Clear Cache</h2>
              <p>Free up storage space</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end" class="chevron-icon"></ion-icon>
          </ion-item>

          <ion-item lines="none" class="settings-item" button="true" (click)="clearBookmarks()">
            <ion-icon name="bookmark-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Clear Saved Articles</h2>
              <p>{{ bookmarkCount }} articles saved</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end" class="chevron-icon"></ion-icon>
          </ion-item>

          <ion-item lines="none" class="settings-item" button="true" (click)="resetSettings()">
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>Reset All Settings</h2>
              <p>Restore default preferences</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end" class="chevron-icon"></ion-icon>
          </ion-item>
        </div>

        <!-- About App -->
        <div class="section-title">
          <ion-icon name="information-circle-outline"></ion-icon>
          <span>About</span>
        </div>

        <div class="settings-group">
          <ion-item lines="none" class="settings-item">
            <ion-icon name="newspaper" slot="start"></ion-icon>
            <ion-label>
              <h2>LE News</h2>
              <p>Version 1.0.0 · Build 2026.02</p>
            </ion-label>
          </ion-item>

          <ion-item lines="none" class="settings-item" button="true" (click)="showAbout()">
            <ion-icon name="heart-outline" slot="start"></ion-icon>
            <ion-label>
              <h2>About LE News</h2>
              <p>Made with ❤️</p>
            </ion-label>
            <ion-icon name="chevron-forward-outline" slot="end" class="chevron-icon"></ion-icon>
          </ion-item>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    .page-toolbar {
      --background: rgba(255, 255, 255, 0.95);
      --border-style: none;
      backdrop-filter: blur(20px);

      ion-title {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
      }

      @media (prefers-color-scheme: dark) {
        --background: rgba(15, 23, 42, 0.95);
      }
    }

    :host-context(.dark) .page-toolbar {
      --background: rgba(15, 23, 42, 0.95);
    }

    :host-context(.light) .page-toolbar {
      --background: rgba(255, 255, 255, 0.95);
    }

    .settings-content {
      --background: #F0F1F6;

      @media (prefers-color-scheme: dark) {
        --background: #0F172A;
      }
    }

    :host-context(.dark) .settings-content {
      --background: #0F172A;
    }

    :host-context(.light) .settings-content {
      --background: #F0F1F6;
    }

    .settings-wrapper {
      max-width: 700px;
      margin: 0 auto;
      padding-bottom: 60px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 20px 5px 10px;

      ion-icon {
        font-size: 1rem;
        color: var(--ion-color-primary);
      }

      span {
        font-family: 'Inter', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--ion-color-medium);
      }
    }

    .settings-group {
      background: var(--ion-background-color);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    .settings-item {
      --background: transparent;
      --padding-start: 16px;
      --inner-padding-end: 16px;
      min-height: 60px;

      ion-icon[slot="start"] {
        font-size: 22px;
        color: var(--ion-color-primary);
        margin-right: 14px;
        width: 36px;
        height: 36px;
        background: rgba(var(--ion-color-primary-rgb), 0.08);
        border-radius: 10px;
        padding: 7px;
      }

      h2 {
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 2px;
      }

      p {
        font-size: 0.78rem;
        color: var(--ion-color-medium);
        margin: 0;
      }

      .chevron-icon {
        font-size: 18px;
        color: var(--ion-color-medium);
        opacity: 0.4;
      }

      & + .settings-item {
        border-top: 1px solid rgba(0, 0, 0, 0.04);
      }
    }
  `],
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonIcon, IonItem, IonLabel, IonToggle, IonButton
  ]
})
export class SettingsPage implements OnInit {
  darkMode = false;
  autoRefresh = true;
  loadImages = true;
  textSize: 'small' | 'medium' | 'large' = 'medium';
  selectedRegionCode = 'us';
  bookmarkCount = 0;

  private regions = [
    { code: 'us', flag: '🇺🇸', name: 'United States' },
    { code: 'gb', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'mx', flag: '🇲🇽', name: 'Mexico' },
    { code: 'ca', flag: '🇨🇦', name: 'Canada' },
    { code: 'es', flag: '🇪🇸', name: 'Spain' },
    { code: 'de', flag: '🇩🇪', name: 'Germany' },
    { code: 'fr', flag: '🇫🇷', name: 'France' },
    { code: 'br', flag: '🇧🇷', name: 'Brazil' },
    { code: 'ar', flag: '🇦🇷', name: 'Argentina' },
  ];

  get textSizeLabel(): string {
    const labels = { small: 'Small', medium: 'Medium', large: 'Large' };
    return labels[this.textSize];
  }

  getRegionFlag(code: string): string {
    return this.regions.find(r => r.code === code)?.flag || '🌎';
  }

  getRegionName(code: string): string {
    return this.regions.find(r => r.code === code)?.name || 'Unknown';
  }

  constructor(
    private alertService: CustomAlertService,
    private bookmarksService: BookmarksService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // Load saved preferences
    this.darkMode = localStorage.getItem('le_news_dark_mode') === 'true';
    this.textSize = (localStorage.getItem('le_news_text_size') as any) || 'medium';
    this.selectedRegionCode = localStorage.getItem('le_news_region') || 'us';
    this.autoRefresh = localStorage.getItem('le_news_auto_refresh') !== 'false';
    this.loadImages = localStorage.getItem('le_news_load_images') !== 'false';
    this.bookmarkCount = this.bookmarksService.getCount();

    // Apply saved dark mode
    this.applyDarkMode();
    this.applyTextSize();

    // Subscribe to bookmark changes
    this.bookmarksService.bookmarks.subscribe(() => {
      this.bookmarkCount = this.bookmarksService.getCount();
    });
  }

  toggleDarkMode() {
    localStorage.setItem('le_news_dark_mode', String(this.darkMode));
    this.applyDarkMode();
  }

  private applyDarkMode() {
    document.body.classList.toggle('dark', this.darkMode);
    document.body.classList.toggle('light', !this.darkMode);
  }

  private applyTextSize() {
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    document.body.classList.add('text-' + this.textSize);
  }

  savePreference(key: string, value: boolean) {
    localStorage.setItem(key, String(value));
  }

  async changeTextSize() {
    const result = await this.alertService.radio({
      icon: 'text-outline',
      title: 'Text Size',
      message: 'Choose your preferred article reading size',
      radios: [
        { label: 'Small — Compact text', value: 'small', checked: this.textSize === 'small' },
        { label: 'Medium — Default size', value: 'medium', checked: this.textSize === 'medium' },
        { label: 'Large — Easier reading', value: 'large', checked: this.textSize === 'large' },
      ],
      confirmText: 'Apply',
    });

    if (result) {
      this.textSize = result as any;
      localStorage.setItem('le_news_text_size', result);
      this.applyTextSize();
      this.showToast('Text size updated to ' + this.textSizeLabel);
    }
  }

  async changeRegion() {
    const result = await this.alertService.radio({
      icon: 'globe-outline',
      title: 'News Region',
      message: 'Select where to get your news from',
      radios: this.regions.map(r => ({
        label: `${r.flag} ${r.name}`,
        value: r.code,
        checked: this.selectedRegionCode === r.code,
      })),
      confirmText: 'Select',
    });

    if (result) {
      this.selectedRegionCode = result;
      localStorage.setItem('le_news_region', result);
      this.showToast('Region changed — news will refresh');
    }
  }

  async clearCache() {
    const confirmed = await this.alertService.confirm({
      icon: 'trash-outline',
      title: 'Clear Cache',
      message: 'This will remove cached data. Your saved articles and settings will be preserved.',
      color: 'warning',
      confirmText: 'Clear Cache',
    });

    if (confirmed) {
      // Clear session storage and any cached data
      sessionStorage.clear();
      this.showToast('Cache cleared successfully');
    }
  }

  async clearBookmarks() {
    if (this.bookmarkCount === 0) {
      await this.alertService.info({
        icon: 'bookmark-outline',
        title: 'No Saved Articles',
        message: 'You don\'t have any saved articles to clear.',
        color: 'primary',
        buttonText: 'Got it',
      });
      return;
    }

    const confirmed = await this.alertService.confirm({
      icon: 'bookmark-outline',
      title: 'Clear All Saved Articles',
      message: `This will remove all ${this.bookmarkCount} saved articles. This action cannot be undone.`,
      color: 'danger',
      confirmText: 'Clear All',
    });

    if (confirmed) {
      localStorage.removeItem('le_news_bookmarks');
      this.bookmarkCount = 0;
      this.showToast('All saved articles cleared');
    }
  }

  async resetSettings() {
    const confirmed = await this.alertService.confirm({
      icon: 'refresh-outline',
      title: 'Reset Settings',
      message: 'This will restore all settings to their default values. Your saved articles will not be affected.',
      color: 'danger',
      confirmText: 'Reset All',
    });

    if (confirmed) {
      // Reset all preferences
      this.darkMode = false;
      this.textSize = 'medium';
      this.selectedRegionCode = 'us';
      this.autoRefresh = true;
      this.loadImages = true;

      localStorage.removeItem('le_news_dark_mode');
      localStorage.removeItem('le_news_text_size');
      localStorage.removeItem('le_news_region');
      localStorage.removeItem('le_news_auto_refresh');
      localStorage.removeItem('le_news_load_images');

      this.applyDarkMode();
      this.applyTextSize();
      this.showToast('All settings restored to defaults');
    }
  }

  async showAbout() {
    await this.alertService.info({
      icon: 'heart-outline',
      title: 'LE News',
      subtitle: 'Stay informed, stay ahead',
      message: 'Thank you for using LE News! Crafted with passion to keep you informed on the stories that matter most.',
      color: 'success',
      buttonText: 'Awesome! 🎉',
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
    });
    toast.present();
  }
}

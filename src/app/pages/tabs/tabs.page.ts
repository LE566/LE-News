import { Component } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="premium-tab-bar">
        <ion-tab-button tab="news">
          <ion-icon name="newspaper"></ion-icon>
          <ion-label>Feed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search">
          <ion-icon name="search-outline"></ion-icon>
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="bookmarks">
          <ion-icon name="bookmark-outline"></ion-icon>
          <ion-label>Saved</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    .premium-tab-bar {
      --background: rgba(255, 255, 255, 0.97);
      --border: none;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.06);
      padding-bottom: env(safe-area-inset-bottom, 0);
      height: 60px;
      border-radius: 24px 24px 0 0;

      ion-tab-button {
        --color: var(--ion-color-medium);
        --color-selected: var(--ion-color-primary);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.65rem;
        letter-spacing: 0.3px;
        transition: all 0.3s ease;

        ion-icon {
          font-size: 22px;
          margin-bottom: 2px;
        }

        &.tab-selected {
          ion-icon {
            transform: scale(1.1);
          }
        }
      }
    }

    @media (prefers-color-scheme: dark) {
      .premium-tab-bar {
        --background: rgba(15, 23, 42, 0.97);
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
      }
    }

    :host-context(.dark) .premium-tab-bar {
      --background: rgba(15, 23, 42, 0.97);
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
    }

    :host-context(.light) .premium-tab-bar {
      --background: rgba(255, 255, 255, 0.97);
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.06);
    }
  `],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage { }

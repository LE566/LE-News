import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonIcon
} from '@ionic/angular/standalone';

interface License {
  name: string;
  version: string;
  license: string;
  description: string;
}

@Component({
  selector: 'app-licenses',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="page-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/profile"></ion-back-button>
        </ion-buttons>
        <ion-title>Open Source Licenses</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="licenses-content">
      <div class="licenses-wrapper ion-padding">
        <div class="licenses-header">
          <ion-icon name="code-slash-outline"></ion-icon>
          <h1>Open Source</h1>
          <p>LE News is built with these amazing open source projects</p>
        </div>

        @for (lib of libraries; track lib.name) {
          <div class="license-card">
            <div class="license-header">
              <h3>{{ lib.name }}</h3>
              <span class="version">v{{ lib.version }}</span>
            </div>
            <p class="description">{{ lib.description }}</p>
            <span class="license-badge">{{ lib.license }}</span>
          </div>
        }

        <div class="footer-note">
          <p>We are grateful to the open source community for making LE News possible. ❤️</p>
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

    .licenses-content {
      --background: #F0F1F6;

      @media (prefers-color-scheme: dark) {
        --background: #0F172A;
      }
    }

    :host-context(.dark) .licenses-content {
      --background: #0F172A;
    }

    :host-context(.light) .licenses-content {
      --background: #F0F1F6;
    }

    .licenses-wrapper {
      max-width: 700px;
      margin: 0 auto;
      padding-bottom: 60px;
    }

    .licenses-header {
      text-align: center;
      padding: 20px 0 30px;

      ion-icon {
        font-size: 48px;
        color: var(--ion-color-primary);
        margin-bottom: 12px;
      }

      h1 {
        font-family: 'Inter', sans-serif;
        font-size: 1.8rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        margin: 0 0 8px;
      }

      p {
        font-size: 0.85rem;
        color: var(--ion-color-medium);
      }
    }

    .license-card {
      background: var(--ion-background-color);
      border-radius: 18px;
      padding: 20px 22px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

      .license-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        h3 {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
          color: var(--ion-text-color);
        }

        .version {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--ion-color-medium);
          background: var(--ion-color-step-50);
          padding: 3px 8px;
          border-radius: 6px;
        }
      }

      .description {
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--ion-color-step-600, #555);
        margin: 0 0 10px;
      }

      .license-badge {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--ion-color-primary);
        background: rgba(var(--ion-color-primary-rgb), 0.08);
        padding: 4px 10px;
        border-radius: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .footer-note {
      text-align: center;
      padding: 20px;

      p {
        font-size: 0.85rem;
        color: var(--ion-color-medium);
      }
    }
  `],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon]
})
export class LicensesPage {
  libraries: License[] = [
    { name: 'Angular', version: '19.0.0', license: 'MIT', description: 'Platform for building mobile and desktop web applications.' },
    { name: 'Ionic Framework', version: '8.0.0', license: 'MIT', description: 'Cross-platform mobile app development framework.' },
    { name: 'Capacitor', version: '7.0.0', license: 'MIT', description: 'Native runtime for building web native apps.' },
    { name: 'Ionicons', version: '7.0.0', license: 'MIT', description: 'Premium icon set with 1,300+ icons for web and mobile.' },
    { name: 'RxJS', version: '7.8.0', license: 'Apache-2.0', description: 'Reactive extensions library for JavaScript.' },
    { name: 'TypeScript', version: '5.5.0', license: 'Apache-2.0', description: 'Typed superset of JavaScript that compiles to plain JavaScript.' },
    { name: 'Zone.js', version: '0.15.0', license: 'MIT', description: 'An execution context for tracking asynchronous operations.' },
    { name: 'capacitor-native-biometric', version: '4.2.2', license: 'MIT', description: 'Native biometric authentication plugin for Capacitor.' },
  ];
}

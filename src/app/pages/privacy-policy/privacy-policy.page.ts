import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-privacy-policy',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="page-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/profile"></ion-back-button>
        </ion-buttons>
        <ion-title>Privacy Policy</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="policy-content">
      <div class="policy-wrapper ion-padding">
        <div class="policy-header">
          <ion-icon name="shield-checkmark-outline"></ion-icon>
          <h1>Privacy Policy</h1>
          <p class="updated">Last updated: February 13, 2026</p>
        </div>

        <div class="policy-section">
          <h2>1. Information We Collect</h2>
          <p>LE News collects the following types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
            <li><strong>Usage Data:</strong> Your reading preferences, category selections, and interaction patterns to improve your news feed.</li>
            <li><strong>Device Information:</strong> Device type, operating system, and biometric capability (only with your permission).</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and personalize your news experience</li>
            <li>Enable biometric authentication for quick login</li>
            <li>Send you breaking news notifications (with your consent)</li>
            <li>Improve our service and user experience</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2>3. Data Storage</h2>
          <p>Your personal data is stored locally on your device. We do not transmit your personal information to external servers. Your reading preferences and account data remain on-device for maximum privacy.</p>
        </div>

        <div class="policy-section">
          <h2>4. Third-Party Services</h2>
          <p>LE News fetches articles from third-party news providers through the NewsAPI service. When you click "Read Full Story," you will be redirected to the original publisher's website, which has its own privacy policy.</p>
        </div>

        <div class="policy-section">
          <h2>5. Biometric Data</h2>
          <p>If you enable biometric login, your biometric data is processed entirely by your device's secure enclave. LE News never has access to your actual biometric data — we only receive a success/failure response from the system.</p>
        </div>

        <div class="policy-section">
          <h2>6. Your Rights</h2>
          <p>You can:</p>
          <ul>
            <li>Delete your account and all associated data at any time</li>
            <li>Disable biometric authentication in your profile settings</li>
            <li>Opt out of push notifications</li>
          </ul>
        </div>

        <div class="policy-section">
          <h2>7. Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at <strong>support&#64;lenews.app</strong></p>
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

    .policy-content {
      --background: #F0F1F6;

      @media (prefers-color-scheme: dark) {
        --background: #0F172A;
      }
    }

    :host-context(.dark) .policy-content {
      --background: #0F172A;
    }

    :host-context(.light) .policy-content {
      --background: #F0F1F6;
    }

    .policy-wrapper {
      max-width: 700px;
      margin: 0 auto;
      padding-bottom: 60px;
    }

    .policy-header {
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

      .updated {
        font-size: 0.85rem;
        color: var(--ion-color-medium);
      }
    }

    .policy-section {
      background: var(--ion-background-color);
      border-radius: 18px;
      padding: 24px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

      h2 {
        font-family: 'Inter', sans-serif;
        font-size: 1.05rem;
        font-weight: 700;
        margin: 0 0 12px;
        color: var(--ion-text-color);
      }

      p {
        font-size: 0.92rem;
        line-height: 1.7;
        color: var(--ion-color-step-600, #555);
        margin: 0 0 8px;
      }

      ul {
        margin: 8px 0;
        padding-left: 20px;

        li {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--ion-color-step-600, #555);
          margin-bottom: 6px;
        }
      }
    }
  `],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon]
})
export class PrivacyPolicyPage { }

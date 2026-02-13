import { Component } from '@angular/core';
import {
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonList, IonItem, IonLabel, IonAvatar, ModalController
} from '@ionic/angular/standalone';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    icon: string;
    read: boolean;
}

@Component({
    selector: 'app-notifications',
    template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="notif-toolbar">
        <ion-title>Notifications</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="notif-content">
      <ion-list lines="none" class="notif-list">
        @for (notif of notifications; track notif.id) {
          <ion-item class="notif-item" [class.unread]="!notif.read" (click)="markRead(notif)">
            <div class="notif-icon-wrapper" slot="start">
              <ion-icon [name]="notif.icon"></ion-icon>
            </div>
            <ion-label>
              <h2>{{ notif.title }}</h2>
              <p>{{ notif.message }}</p>
              <span class="notif-time">{{ notif.time }}</span>
            </ion-label>
          </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
    styles: [`
    .notif-toolbar {
      --background: var(--ion-background-color);
      --border-style: none;

      ion-title {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 1.3rem;
        letter-spacing: -0.5px;
      }
    }

    .notif-content {
      --background: var(--ion-background-color);
    }

    .notif-list {
      padding: 0 16px;
      background: transparent;
    }

    .notif-item {
      --background: transparent;
      --padding-start: 0;
      --inner-padding-end: 0;
      margin-bottom: 8px;
      border-radius: 16px;
      padding: 12px 16px;
      transition: background 0.2s ease;

      &.unread {
        background: rgba(var(--ion-color-primary-rgb), 0.04);
        border-left: 3px solid var(--ion-color-primary);
      }

      .notif-icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: rgba(var(--ion-color-primary-rgb), 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;

        ion-icon {
          font-size: 20px;
          color: var(--ion-color-primary);
        }
      }

      h2 {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 0.95rem;
        margin-bottom: 4px;
      }

      p {
        font-size: 0.82rem;
        color: var(--ion-color-medium);
        white-space: normal;
        line-height: 1.4;
      }

      .notif-time {
        font-size: 0.72rem;
        color: var(--ion-color-medium);
        opacity: 0.6;
        margin-top: 4px;
        display: block;
      }
    }
  `],
    standalone: true,
    imports: [
        IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
        IonIcon, IonList, IonItem, IonLabel
    ]
})
export class NotificationsModal {
    notifications: Notification[] = [
        {
            id: 1,
            title: 'Breaking News',
            message: 'New development in global markets — stocks surge after policy announcement.',
            time: '2 min ago',
            icon: 'newspaper-outline',
            read: false
        },
        {
            id: 2,
            title: 'Trending Now',
            message: 'Tech giants report record quarterly earnings this season.',
            time: '15 min ago',
            icon: 'newspaper-outline',
            read: false
        },
        {
            id: 3,
            title: 'Welcome to LE News!',
            message: 'Thanks for using LE News. Explore top headlines from around the world.',
            time: '1 hour ago',
            icon: 'notifications-outline',
            read: true
        },
        {
            id: 4,
            title: 'Health Update',
            message: 'New study reveals benefits of daily exercise for productivity.',
            time: '3 hours ago',
            icon: 'newspaper-outline',
            read: true
        },
        {
            id: 5,
            title: 'Sports Highlight',
            message: 'Championship finals set — key matchups to watch this weekend.',
            time: '5 hours ago',
            icon: 'newspaper-outline',
            read: true
        },
    ];

    constructor(private modalCtrl: ModalController) { }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    markRead(notif: Notification) {
        notif.read = true;
    }
}

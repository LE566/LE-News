import { Component, OnInit, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import {
  camera, closeOutline, createOutline, shieldCheckmarkOutline,
  personOutline, mailOutline, fingerPrintOutline, notificationsOutline,
  settingsOutline, chevronForwardOutline, codeSlashOutline, logOutOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonBackButton, IonItem, IonInput, IonLabel, IonToggle,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { CustomAlertService } from '../../shared/custom-alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonBackButton, IonItem, IonInput, IonLabel, IonToggle
  ]
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private alertService = inject(CustomAlertService);
  private router = inject(Router);

  user: User | null = null;
  biometricsEnabled = false;
  notificationsEnabled = false;
  isEditing = false;

  constructor() {
    addIcons({
      camera, closeOutline, createOutline, shieldCheckmarkOutline,
      personOutline, mailOutline, fingerPrintOutline, notificationsOutline,
      settingsOutline, chevronForwardOutline, codeSlashOutline, logOutOutline
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = { ...user };
        this.biometricsEnabled = user.hasBiometricsEnabled;
      }
    });

    if (Capacitor.isNativePlatform()) {
      this.checkPermissions();
    }
  }

  async checkPermissions() {
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'granted') {
      this.notificationsEnabled = true;
    }
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
    } else {
      this.isEditing = true;
    }
  }

  async toggleNotifications() {
    if (this.notificationsEnabled) {
      // User is turning ON notifications
      if (Capacitor.getPlatform() !== 'web') {
        const permStatus = await PushNotifications.requestPermissions();
        if (permStatus.receive === 'granted') {
          await PushNotifications.register();
          this.addListeners();
          this.showToast('Push notifications enabled');
        } else {
          this.notificationsEnabled = false;
          this.showToast('Permission denied for notifications');
        }
      } else {
        this.showToast('Push notifications not supported on web');
        this.notificationsEnabled = false;
      }
    } else {
      // User is turning OFF notifications
      // In a real app we would unsubscribe from topic or update backend
      if (Capacitor.getPlatform() !== 'web') {
        await PushNotifications.removeAllListeners();
      }
      this.showToast('Push notifications disabled');
    }
  }

  addListeners() {
    PushNotifications.addListener('registration', token => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      this.showToast(`Notification received: ${notification.title}`);
    });
  }

  async toggleBiometrics() {
    if (this.user) {
      if (this.biometricsEnabled) {
        const data = await this.alertService.input({
          icon: 'finger-print-outline',
          title: 'Enable Biometrics',
          message: 'Enter your password to enable biometric login.',
          color: 'primary',
          inputs: [
            { name: 'password', type: 'password', placeholder: 'Enter password' }
          ],
          confirmText: 'Enable',
        });

        if (data && data['password']) {
          const success = await this.authService.enableBiometricAuth(this.user.email, data['password']);
          if (success) {
            this.user.hasBiometricsEnabled = true;
            this.authService.updateBiometrics(true);
            this.showToast('Biometrics enabled successfully');
          } else {
            this.biometricsEnabled = false;
            this.showToast('Incorrect password or biometrics failed');
          }
        } else {
          this.biometricsEnabled = false;
        }

      } else {
        this.user.hasBiometricsEnabled = false;
        this.authService.updateBiometrics(false);
        this.showToast('Biometrics disabled');
      }
    }
  }

  async changeProfilePicture() {
    if (!this.isEditing) return;

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt // Ask: Camera or Photos
      });

      if (image && image.dataUrl && this.user) {
        this.user.avatarUrl = image.dataUrl;
        this.authService.updateUser(this.user);
        this.showToast('Profile picture updated.');
      }
    } catch (error) {
      console.log('Camera/Gallery cancelled or failed', error);
    }
  }

  saveChanges() {
    if (this.user) {
      this.authService.updateUser(this.user);
      this.isEditing = false;
      this.showToast('Profile updated successfully');
    }
  }

  async logout() {
    const confirmed = await this.alertService.confirm({
      icon: 'log-out-outline',
      title: 'Sign Out',
      message: 'Are you sure you want to sign out of your account?',
      color: 'danger',
      confirmText: 'Sign Out',
      cancelText: 'Stay',
    });

    if (confirmed) {
      this.authService.logout();
    }
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  openPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  openLicenses() {
    this.router.navigate(['/licenses']);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

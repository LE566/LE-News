import { Component, OnInit } from '@angular/core';
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
  user: User | null = null;
  biometricsEnabled = false;
  notificationsEnabled = false;
  isEditing = false;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertService: CustomAlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = { ...user };
        this.biometricsEnabled = user.hasBiometricsEnabled;
      }
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
    } else {
      this.isEditing = true;
    }
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
            this.showToast('Failed to enable biometrics');
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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.user) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.user) {
          this.user.avatarUrl = reader.result as string;
          this.authService.updateUser(this.user);
          this.showToast('Profile picture updated.');
        }
      };
      reader.readAsDataURL(file);
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

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonCard, IonCardContent, IonSegment, IonSegmentButton,
  IonLabel, IonItem, IonIcon, IonInput, IonButton, IonAvatar,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DatabaseService } from '../../core/services/database.service';
import { User } from '../../core/models/user.model';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonCard, IonCardContent, IonSegment, IonSegmentButton,
    IonLabel, IonItem, IonIcon, IonInput, IonButton, IonAvatar
  ]
})
export class AuthPage implements OnInit {
  isLogin = true;
  userData = {
    name: '',
    email: '',
    password: ''
  };

  canBiometric = false;
  isBiometricLoading = false;

  availableUsers: any[] = [];

  constructor(
    private authService: AuthService,
    private db: DatabaseService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.checkBiometricAvailability();
    this.loadAvailableUsers();
  }

  ionViewWillEnter() {
    this.checkBiometricAvailability();
    this.loadAvailableUsers();
  }

  loadAvailableUsers() {
    this.availableUsers = this.db.getBiometricUsers();
  }

  async checkBiometricAvailability() {
    this.canBiometric = await this.authService.canUseBiometrics();
  }

  async loginWithUser(user: any) {
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.isBiometricLoading = true;
    
    try {
      const success = await this.authService.loginWithBiometrics(user.email);
      this.isBiometricLoading = false;

      if (success) {
        await Haptics.notification({ type: NotificationType.Success });
        await this.showToast(`Welcome back, ${user.name}`);
        this.router.navigate(['/news']);
      } else {
        await Haptics.notification({ type: NotificationType.Error });
        await this.showToast('Authentication failed');
      }
    } catch (e) {
      this.isBiometricLoading = false;
      await Haptics.notification({ type: NotificationType.Error });
      await this.showToast('Error logging in');
    }
  }

  async toggleMode() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.isLogin = !this.isLogin;
  }

  async onSubmit() {
    await Haptics.impact({ style: ImpactStyle.Medium });
    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  async login() {
    this.authService.login(this.userData.email, this.userData.password).subscribe(async (success) => {
      if (success) {
        await Haptics.notification({ type: NotificationType.Success });
        await this.showToast('Login successful!');
        this.router.navigate(['/news']);
      } else {
        await Haptics.notification({ type: NotificationType.Error });
        await this.showToast('Invalid credentials or user not found.');
      }
    });
  }

  async register() {
    const newUser: User = {
      id: '',
      name: this.userData.name,
      email: this.userData.email,
      password: this.userData.password,
      hasBiometricsEnabled: false
    };

    this.authService.register(newUser).subscribe(async (success) => {
      if (success) {
        await Haptics.notification({ type: NotificationType.Success });
        await this.showToast('Registration successful! Biometrics can be enabled in profile.');
        this.router.navigate(['/news']);
      } else {
        await Haptics.notification({ type: NotificationType.Error });
        await this.showToast('User already exists.');
      }
    });
  }

  async showToast(msg: string, duration = 2000, position: 'top' | 'bottom' | 'middle' = 'bottom') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position,
      color: 'dark'
    });
    toast.present();
  }
}
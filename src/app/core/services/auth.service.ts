import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { NativeBiometric } from 'capacitor-native-biometric';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // No localStorage keys needed for "Variables Only" approach
  // We keep NativeBiometric server ID though.

  constructor(
    private router: Router,
    private db: DatabaseService // Inject DB
  ) {
    // No loadUsers() or checkSession() from localStorage
    // Session is also ephemeral now.
  }

  register(user: User): Observable<boolean> {
    const existing = this.db.findUserByEmail(user.email);
    if (existing) {
      return of(false);
    }
    user.id = Math.random().toString(36).substr(2, 9);
    // user.hasBiometricsEnabled is set by caller or default false
    if (!user.avatarUrl) {
      user.avatarUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';
    }

    this.db.addUser(user);

    // Auto login
    this.login(user.email, user.password || '');
    return of(true);
  }

  login(email: string, password?: string): Observable<boolean> {
    const user = this.db.findUserByEmail(email);

    if (user && (password ? user.password === password : true)) {
      this.currentUserSubject.next(user);
      // We don't save session to localStorage anymore per request
      return of(true);
    }
    return of(false);
  }

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  updateBiometrics(enabled: boolean) {
    const user = this.currentUserSubject.value;
    if (user) {
      user.hasBiometricsEnabled = enabled;
      this.updateUser(user);
    }
  }

  updateUser(updatedUser: User) {
    const success = this.db.updateUser(updatedUser);
    if (success) {
      this.currentUserSubject.next({ ...updatedUser });
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // --- Native Biometrics ---

  async canUseBiometrics(): Promise<boolean> {
    try {
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch (e) {
      return false;
    }
  }

  async enableBiometricAuth(email: string, password: string): Promise<boolean> {
    try {
      const isAvailable = await this.canUseBiometrics();
      if (!isAvailable) return false;

      await NativeBiometric.verifyIdentity({
        reason: 'Enable biometric login',
        title: 'Confirm Identity',
        subtitle: 'Scan your fingerprint or face',
        description: 'Please authenticate to enable biometric login'
      });

      // Use email in server ID to support multiple users
      await NativeBiometric.setCredentials({
        username: email,
        password: password,
        server: `com.news.app.${email}`
      });

      return true;
    } catch (e) {
      console.error('Biometric enrollment failed', e);
      return false;
    }
  }

  async loginWithBiometrics(email: string): Promise<boolean> {
    try {
      const isAvailable = await this.canUseBiometrics();
      if (!isAvailable) return false;

      // Explicitly verify identity first to ensure the prompt appears
      // and the user feels the security check (as requested).
      await NativeBiometric.verifyIdentity({
        reason: `Login as ${email}`,
        title: 'Biometric Login',
        subtitle: 'Verify your identity',
        description: 'Please authenticate to log in'
      });

      const credentials = await NativeBiometric.getCredentials({
        server: `com.news.app.${email}`
      });

      if (credentials && credentials.username && credentials.password) {
        // Here is the catch with "Variables Only":
        // If the app restarted, DB is empty. The user from credentials won't exist in DB.
        // The user asked for "Variables", implying they accept this or are using it for a demo where they create user -> enable bio -> logout -> login (without restart).
        let success = false;
        // Verify against current DB state (Variables)
        // If app restarted, this might fail if DB is empty, but credentials exist in Keystore.
        // We will try to login. If DB is empty, 'login' returns false.
        // We could theoretically "restore" the user to DB here since we have the creds?
        // User asked for "Variables Only", so if memory is gone, maybe we shouldn't restore?
        // BUT, for a good demo, if we have the valid credentials from Keystore, we can "create" the session.
        // However, we lack the 'Name' and 'Avatar'.
        // Let's stick to: "If user exists in DB, login."

        this.login(credentials.username, credentials.password).subscribe(res => {
          success = res;
        });
        return success;
      }
      return false;

    } catch (e) {
      console.error('Biometric login failed', e);
      return false;
    }
  }
}

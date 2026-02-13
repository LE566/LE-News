import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private users: User[] = [];
    private readonly STORAGE_KEY = 'news_app_users';

    constructor() {
        this.loadUsers();
    }

    private loadUsers() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
            try {
                this.users = JSON.parse(data);
            } catch (e) {
                console.error('Error loading users', e);
                this.users = [];
            }
        }
    }

    private saveUsers() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    }

    getUsers(): User[] {
        return this.users;
    }

    getBiometricUsers(): User[] {
        return this.users.filter(u => u.hasBiometricsEnabled);
    }

    addUser(user: User): void {
        this.users.push(user);
        this.saveUsers();
    }

    findUserByEmail(email: string): User | undefined {
        return this.users.find(u => u.email === email);
    }

    findUserById(id: string): User | undefined {
        return this.users.find(u => u.id === id);
    }

    updateUser(updatedUser: User): boolean {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            this.users[index] = updatedUser;
            this.saveUsers();
            return true;
        }
        return false;
    }
}

import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { CustomAlertComponent, CustomAlertConfig, CustomAlertButton, CustomAlertRadio } from './custom-alert/custom-alert.component';

@Injectable({ providedIn: 'root' })
export class CustomAlertService {

    constructor(private modalCtrl: ModalController) { }

    async show(config: CustomAlertConfig): Promise<{ role: string; data: any }> {
        const modal = await this.modalCtrl.create({
            component: CustomAlertComponent,
            componentProps: { config },
            cssClass: 'transparent-modal',
            backdropDismiss: false,
            showBackdrop: false,
        });
        await modal.present();

        const { data, role } = await modal.onDidDismiss();
        return { data, role: role || 'cancel' };
    }

    async confirm(opts: {
        icon?: string;
        title: string;
        message: string;
        color?: 'primary' | 'danger' | 'success' | 'warning';
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean> {
        const result = await this.show({
            icon: opts.icon,
            title: opts.title,
            message: opts.message,
            color: opts.color || 'primary',
            buttons: [
                { text: opts.cancelText || 'Cancel', role: 'cancel' },
                { text: opts.confirmText || 'Confirm', role: opts.color === 'danger' ? 'destructive' : 'confirm' },
            ]
        });
        return result.role === 'confirm';
    }

    async info(opts: {
        icon?: string;
        title: string;
        subtitle?: string;
        message: string;
        color?: 'primary' | 'danger' | 'success' | 'warning';
        buttonText?: string;
    }): Promise<void> {
        await this.show({
            icon: opts.icon,
            title: opts.title,
            subtitle: opts.subtitle,
            message: opts.message,
            color: opts.color || 'primary',
            buttons: [
                { text: opts.buttonText || 'OK', role: 'confirm' }
            ]
        });
    }

    async radio(opts: {
        icon?: string;
        title: string;
        message?: string;
        color?: 'primary' | 'danger' | 'success' | 'warning';
        radios: CustomAlertRadio[];
        confirmText?: string;
        cancelText?: string;
    }): Promise<string | null> {
        const result = await this.show({
            icon: opts.icon,
            title: opts.title,
            message: opts.message,
            color: opts.color || 'primary',
            radios: opts.radios,
            buttons: [
                { text: opts.cancelText || 'Cancel', role: 'cancel' },
                { text: opts.confirmText || 'Apply', role: 'confirm' },
            ]
        });
        return result.role === 'confirm' ? result.data : null;
    }

    async input(opts: {
        icon?: string;
        title: string;
        message?: string;
        color?: 'primary' | 'danger' | 'success' | 'warning';
        inputs: { name: string; type: string; placeholder: string }[];
        confirmText?: string;
        cancelText?: string;
    }): Promise<Record<string, string> | null> {
        const result = await this.show({
            icon: opts.icon,
            title: opts.title,
            message: opts.message,
            color: opts.color || 'primary',
            inputs: opts.inputs,
            buttons: [
                { text: opts.cancelText || 'Cancel', role: 'cancel' },
                { text: opts.confirmText || 'Confirm', role: 'confirm' },
            ]
        });
        return result.role === 'confirm' ? result.data : null;
    }
}

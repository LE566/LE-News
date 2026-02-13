import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonIcon, IonButton, ModalController
} from '@ionic/angular/standalone';

export interface CustomAlertButton {
    text: string;
    role?: 'cancel' | 'confirm' | 'destructive';
    handler?: (data?: any) => void;
}

export interface CustomAlertRadio {
    label: string;
    value: string;
    checked?: boolean;
}

export interface CustomAlertConfig {
    icon?: string;
    title: string;
    subtitle?: string;
    message?: string;
    color?: 'primary' | 'danger' | 'success' | 'warning';
    inputs?: { name: string; type: string; placeholder: string }[];
    radios?: CustomAlertRadio[];
    buttons: CustomAlertButton[];
}

@Component({
    selector: 'app-custom-alert',
    template: `
    <div class="alert-backdrop" (click)="onBackdropClick()">
      <div class="alert-card" [class]="'alert-card color-' + (config.color || 'primary')" (click)="$event.stopPropagation()">

        <!-- Header with Icon -->
        <div class="alert-header" [class]="'color-' + (config.color || 'primary')">
          @if (config.icon) {
            <div class="alert-icon-wrapper">
              <ion-icon [name]="config.icon"></ion-icon>
            </div>
          }
          <h2 class="alert-title">{{ config.title }}</h2>
          @if (config.subtitle) {
            <p class="alert-subtitle">{{ config.subtitle }}</p>
          }
        </div>

        <!-- Body -->
        <div class="alert-body">
          @if (config.message) {
            <p class="alert-message">{{ config.message }}</p>
          }

          <!-- Input fields -->
          @if (config.inputs && config.inputs.length > 0) {
            <div class="alert-inputs">
              @for (input of config.inputs; track input.name) {
                <input
                  [type]="input.type"
                  [placeholder]="input.placeholder"
                  [(ngModel)]="inputValues[input.name]"
                  class="alert-input"
                />
              }
            </div>
          }

          <!-- Radio options -->
          @if (config.radios && config.radios.length > 0) {
            <div class="alert-radios">
              @for (radio of config.radios; track radio.value) {
                <div class="radio-option" [class.selected]="selectedRadio === radio.value"
                  (click)="selectedRadio = radio.value">
                  <div class="radio-circle">
                    @if (selectedRadio === radio.value) {
                      <div class="radio-dot"></div>
                    }
                  </div>
                  <span>{{ radio.label }}</span>
                </div>
              }
            </div>
          }
        </div>

        <!-- Buttons -->
        <div class="alert-buttons" [class.single]="config.buttons.length === 1">
          @for (btn of config.buttons; track btn.text) {
            <button
              class="alert-btn"
              [class.cancel]="btn.role === 'cancel'"
              [class.destructive]="btn.role === 'destructive'"
              [class.confirm]="btn.role === 'confirm' || (!btn.role && btn.role !== 'cancel')"
              (click)="onButtonClick(btn)">
              {{ btn.text }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .alert-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .alert-card {
      background: var(--ion-background-color, #fff);
      border-radius: 28px;
      width: 100%;
      max-width: 340px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease;
    }

    .alert-header {
      padding: 32px 28px 20px;
      text-align: center;

      &.color-primary {
        background: linear-gradient(145deg, #4F46E5, #7C3AED);
      }
      &.color-danger {
        background: linear-gradient(145deg, #EF4444, #F97316);
      }
      &.color-success {
        background: linear-gradient(145deg, #10B981, #3B82F6);
      }
      &.color-warning {
        background: linear-gradient(145deg, #F59E0B, #EF4444);
      }

      .alert-icon-wrapper {
        width: 56px;
        height: 56px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;

        ion-icon {
          font-size: 28px;
          color: white;
        }
      }

      .alert-title {
        color: white;
        font-family: 'Inter', sans-serif;
        font-size: 1.25rem;
        font-weight: 800;
        margin: 0 0 4px;
        letter-spacing: -0.3px;
      }

      .alert-subtitle {
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        margin: 0;
      }
    }

    .alert-body {
      padding: 24px 28px 8px;
    }

    .alert-message {
      font-family: 'Inter', sans-serif;
      font-size: 0.92rem;
      line-height: 1.5;
      color: var(--ion-color-step-600, #555);
      text-align: center;
      margin: 0 0 16px;
    }

    .alert-inputs {
      margin-bottom: 8px;
    }

    .alert-input {
      width: 100%;
      padding: 14px 18px;
      border: 2px solid var(--ion-color-step-100, #e5e5e5);
      border-radius: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      outline: none;
      transition: border-color 0.2s ease;
      background: var(--ion-background-color, #fff);
      color: var(--ion-text-color, #000);
      margin-bottom: 8px;

      &:focus {
        border-color: var(--ion-color-primary, #4F46E5);
      }

      &::placeholder {
        color: var(--ion-color-step-400, #999);
      }
    }

    .alert-radios {
      max-height: 240px;
      overflow-y: auto;
      margin-bottom: 8px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 14px;
      cursor: pointer;
      transition: background 0.2s ease;
      margin-bottom: 4px;

      &:active, &.selected {
        background: rgba(var(--ion-color-primary-rgb, 79, 70, 229), 0.06);
      }

      .radio-circle {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--ion-color-step-200, #ccc);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s ease;
        flex-shrink: 0;
      }

      &.selected .radio-circle {
        border-color: var(--ion-color-primary, #4F46E5);
      }

      .radio-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--ion-color-primary, #4F46E5);
        animation: scaleIn 0.2s ease;
      }

      @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }

      span {
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--ion-text-color, #000);
      }
    }

    .alert-buttons {
      padding: 16px 28px 28px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.single {
        padding-top: 8px;
      }
    }

    .alert-btn {
      width: 100%;
      padding: 15px 20px;
      border: none;
      border-radius: 16px;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
      letter-spacing: 0.2px;

      &:active {
        transform: scale(0.97);
      }

      &.confirm {
        background: linear-gradient(145deg, #4F46E5, #7C3AED);
        color: white;
        box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
      }

      &.destructive {
        background: linear-gradient(145deg, #EF4444, #F97316);
        color: white;
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
      }

      &.cancel {
        background: var(--ion-color-step-50, #f5f5f5);
        color: var(--ion-color-step-600, #555);
      }
    }
  `],
    standalone: true,
    imports: [CommonModule, FormsModule, IonIcon, IonButton]
})
export class CustomAlertComponent {
    @Input() config!: CustomAlertConfig;

    inputValues: Record<string, string> = {};
    selectedRadio = '';

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        if (this.config.radios) {
            const checked = this.config.radios.find(r => r.checked);
            if (checked) this.selectedRadio = checked.value;
        }
    }

    onBackdropClick() {
        const cancelBtn = this.config.buttons.find(b => b.role === 'cancel');
        if (cancelBtn) {
            this.modalCtrl.dismiss(null, 'cancel');
        }
    }

    onButtonClick(btn: CustomAlertButton) {
        if (btn.role === 'cancel') {
            if (btn.handler) btn.handler();
            this.modalCtrl.dismiss(null, 'cancel');
        } else {
            const data = this.config.radios ? this.selectedRadio : this.inputValues;
            if (btn.handler) btn.handler(data);
            this.modalCtrl.dismiss(data, 'confirm');
        }
    }
}

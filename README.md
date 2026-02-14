# 📰 LE News - Premium News App

LE News is a professional, high-performance news application built with **Ionic 8** and **Angular 19**. It features a stunning indigo-emerald theme, glassmorphism effects, and native-level performance.

![Dark Mode Preview](https://github.com/LE566/LE-News/raw/main/src/assets/icon/favicon.png)

## ✨ Features

- **Premium Design**: Modern indigo-emerald palette with smooth transitions and glassmorphism.
- **Dynamic Themes**: Full support for Dark Mode and Light Mode with manual override.
- **Biometric Authentication**: Secure login using Fingerprint or FaceID (via Capacitor Native Biometric).
- **Multi-Account Login**: Quick account switching for multiple registered users.
- **Custom Alert System**: Elegant, customized modals for all user interactions.
- **News Categories**: Browse top headlines by Technology, Business, Sports, and more.
- **Bookmarks**: Save your favorite articles for later reading with a dedicated storage system.
- **Search**: Fast, real-time news search powered by NewsAPI.
- **Adaptive Text Size**: Choose between Small, Medium, and Large text for better accessibility.

## 🛠️ Tech Stack

- **Framework**: [Ionic 8](https://ionicframework.com/) / [Angular 19](https://angular.io/)
- **State Management**: Standalone Components & RxJS
- **Native Bridge**: [Capacitor 7](https://capacitorjs.com/)
- **API**: [NewsAPI.org](https://newsapi.org/)
- **Storage**: LocalStorage (Persistent)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Ionic CLI](https://ionicframework.com/docs/cli)
- [Android Studio](https://developer.android.com/studio) (for Android build)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LE566/LE-News.git
   cd LE-News
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API Key:
   Renombre `src/environments/environment.example.ts` a `src/environments/environment.ts` y agregue su NewsAPI Key.

4. Run locally:
   ```bash
   ionic serve
   ```

## 📱 Android Download

Para descargar la aplicación en tu teléfono:
1. Ve a la raiz de este repositorio.
2. Descarga el archivo `LE News.apk`.
3. Abre el archivo en tu dispositivo Android y sigue las instrucciones de instalación.

---
Built with ❤️ by LE

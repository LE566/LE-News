import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lenews.app',
  appName: 'LE News',
  webDir: 'www',
  plugins: {
    StatusBar: {
      backgroundColor: '#4F46E5',
      style: 'LIGHT',
      overlaysWebView: false,
    },
  },
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jackson.app',
  appName: 'Jackson',
  webDir: 'out',
  server: {
    allowNavigation: [
      'http://94.249.151.176:4001'
    ],
    cleartext: true
  }
};

export default config;

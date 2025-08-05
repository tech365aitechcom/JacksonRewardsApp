import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jackson.app',
  appName: 'Jackson',
  webDir: 'out',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: process.env.GOOGLE_CLIENT_ID,
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;

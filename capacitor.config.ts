import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smile7dental.clinic',
  appName: 'Smile7 Dental',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;


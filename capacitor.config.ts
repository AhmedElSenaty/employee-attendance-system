import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.Attendance',
    appName: 'Attendance',
    webDir: 'dist',
    server: {
        url: 'http://193.227.34.53:5173',
        cleartext: true
    }
};

export default config;

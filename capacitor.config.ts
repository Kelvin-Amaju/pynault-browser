import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = { appId:'com.pynault.browser',appName:'Pynault',webDir:'dist',plugins:{SplashScreen:{launchShowDuration:0},CapacitorHttp:{enabled:true}},ios:{contentInset:'always'}};
export default config;

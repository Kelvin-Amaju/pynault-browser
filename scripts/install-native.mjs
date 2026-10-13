import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const android=path.join(root,'android');
const ios=path.join(root,'ios/App/App');
const exists=fs.existsSync;

if(exists(android)){
 const dir=path.join(android,'app/src/main/java/com/pynault/browser');
 fs.mkdirSync(dir,{recursive:true});
 for(const name of ['MainActivity.java','NativePagesPlugin.java'])fs.copyFileSync(path.join(root,'apps/mobile/native/android',name),path.join(dir,name));
 const vars=path.join(android,'variables.gradle');
 if(exists(vars))fs.writeFileSync(vars,fs.readFileSync(vars,'utf8').replace(/minSdkVersion\s*=\s*\d+/,'minSdkVersion = 26'));
 const manifest=path.join(android,'app/src/main/AndroidManifest.xml');
 if(exists(manifest)){
  let xml=fs.readFileSync(manifest,'utf8');
  for(const permission of ['CAMERA','RECORD_AUDIO','ACCESS_COARSE_LOCATION','INTERNET']){
   if(!xml.includes('android.permission.'+permission))xml=xml.replace('<application',`<uses-permission android:name="android.permission.${permission}" />\n    <application`);
  }
  if(!xml.includes('android:usesCleartextTraffic'))xml=xml.replace('<application','<application android:usesCleartextTraffic="true"');
  fs.writeFileSync(manifest,xml);
 }
 console.log('Android: native browser plugin, permissions, QR minimum SDK and Wi-Fi relay settings synchronized.');
}
if(exists(ios)){
 for(const name of ['NativePagesPlugin.swift','MyViewController.swift'])fs.copyFileSync(path.join(root,'apps/mobile/native/ios',name),path.join(ios,name));
 const storyboard=path.join(ios,'Base.lproj/Main.storyboard');
 if(exists(storyboard))fs.writeFileSync(storyboard,fs.readFileSync(storyboard,'utf8').replace(/customClass="CAPBridgeViewController"(?: customModule="Capacitor")?/g,'customClass="MyViewController" customModule="App"'));
 const plist=path.join(ios,'Info.plist');
 if(exists(plist)){
  let xml=fs.readFileSync(plist,'utf8');
  const keys=[
   ['NSCameraUsageDescription','<string>Scan QR codes and let trusted sites use the camera with consent.</string>'],
   ['NSMicrophoneUsageDescription','<string>Let trusted websites access your microphone with permission.</string>'],
   ['NSLocalNetworkUsageDescription','<string>Exchange encrypted links with your desktop on local Wi-Fi.</string>'],
   ['NSAppTransportSecurity','<dict><key>NSAllowsLocalNetworking</key><true/></dict>'],
   ['UIFileSharingEnabled','<true/>'],
   ['LSSupportsOpeningDocumentsInPlace','<true/>']
  ];
  let insertion='';for(const [key,value] of keys)if(!xml.includes(`<key>${key}</key>`))insertion+=`\n  <key>${key}</key>\n  ${value}`;
  const close=xml.lastIndexOf('</dict>');
  if(close<0)throw Error('Invalid iOS Info.plist: no root dictionary');
  xml=xml.slice(0,close)+insertion+'\n'+xml.slice(close);
  fs.writeFileSync(plist,xml);
 }
 console.log('iOS: native browser code, camera/microphone/local-network and Files entitlements synchronized. Confirm both Swift sources are in App target.');
}
if(!exists(android)&&!exists(ios))console.log('Add a native platform with npx cap add android / ios, then run npm run mobile:sync.');

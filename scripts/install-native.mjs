import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();
const androidRoot=path.join(root,'android/app/src/main/java/com/pynault/browser');
if(fs.existsSync(path.join(root,'android'))){fs.mkdirSync(androidRoot,{recursive:true});for(const x of ['NativePagesPlugin.java','MainActivity.java'])fs.copyFileSync(path.join(root,'apps/mobile/native/android',x),path.join(androidRoot,x));console.log('Android native renderer registered.');}
const iosRoot=path.join(root,'ios/App/App');
if(fs.existsSync(iosRoot)){
  for(const x of ['NativePagesPlugin.swift','MyViewController.swift'])fs.copyFileSync(path.join(root,'apps/mobile/native/ios',x),path.join(iosRoot,x));
  const storyboard=path.join(iosRoot,'Base.lproj/Main.storyboard');
  if(fs.existsSync(storyboard)){
    let s=fs.readFileSync(storyboard,'utf8');
    s=s.replace(/customClass="CAPBridgeViewController"(?: customModule="Capacitor")?/g,'customClass="MyViewController" customModule="App"');
    fs.writeFileSync(storyboard,s);
  }
  console.log('Copied iOS native renderer. Add both Swift files to the Xcode App target if not automatically included, and confirm the storyboard references MyViewController.');
}
if(!fs.existsSync(path.join(root,'android'))&&!fs.existsSync(path.join(root,'ios')))console.log('No native project yet. Run npx cap add android / ios, then re-run this script.');

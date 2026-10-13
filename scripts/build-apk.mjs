import {spawnSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const windows = process.platform === 'win32';
const result = spawnSync(windows ? 'cmd.exe' : './gradlew', windows ? ['/d', '/c', 'gradlew.bat assembleDebug --console=plain'] : ['assembleDebug', '--console=plain'], {
  cwd: path.join(root, 'android'), stdio: 'inherit', env: process.env
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const {version} = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
mkdirSync(path.join(root, 'release'), {recursive: true});
const output = path.join(root, 'release', `Pynault-${version}-android-debug.apk`);
copyFileSync(path.join(root, 'android/app/build/outputs/apk/debug/app-debug.apk'), output);
console.log(`Development-signed APK: ${output}`);

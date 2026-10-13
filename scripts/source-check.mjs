import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const files=['apps/desktop/main.cjs','apps/desktop/preload.cjs','src/navigation.js','src/browser-state.js','src/storage.js','scripts/install-native.mjs'];
for(const file of files){
  const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(r.status!==0){console.error(file,r.stderr);process.exit(1)}
  console.log('OK syntax:',file);
}
const main=readFileSync('apps/desktop/main.cjs','utf8');
const preload=readFileSync('apps/desktop/preload.cjs','utf8');
for(const fragment of ['sandbox:true','nodeIntegration:false','contextIsolation:true','setWindowOpenHandler','setPermissionRequestHandler','will-navigate']){
 if(!main.includes(fragment)){console.error('Missing Electron security guard:',fragment);process.exit(1)}
}
if(!preload.includes("new Set(['create'")){console.error('Missing IPC allowlist');process.exit(1)}
console.log('OK Electron security invariants (source check; not a runtime audit)');
console.log('Native Android/iOS sources require Gradle/Xcode validation.');

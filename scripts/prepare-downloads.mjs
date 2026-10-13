import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd();
const {version}=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const metadata=JSON.parse(fs.readFileSync(path.join(root,'android/app/build/outputs/apk/debug/output-metadata.json'),'utf8'));
if(metadata.elements[0]?.versionName!==version)throw new Error('Rebuild the APK: its embedded version does not match package.json');
const files=[
 [`Pynault Setup ${version}.exe`,`Pynault-Setup-${version}.exe`],
 [`Pynault ${version}.exe`,`Pynault-${version}-portable.exe`],
 [`Pynault-${version}-android-debug.apk`,`Pynault-${version}-android-debug.apk`]
];
for(const [name] of files){const file=path.join(root,'release',name);if(!fs.existsSync(file)||fs.statSync(file).size===0)throw new Error(`Build the missing release file: ${name}`)}
const target=path.join(root,'pynault-browser/downloads');fs.mkdirSync(target,{recursive:true});
const releaseSums=[],websiteSums=[];
for(const [source,destination] of files){
 const sourcePath=path.join(root,'release',source);
 const hash=createHash('sha256');for await(const chunk of fs.createReadStream(sourcePath))hash.update(chunk);
 const digest=hash.digest('hex');
 fs.copyFileSync(sourcePath,path.join(target,destination));
 releaseSums.push(`${digest}  ${source}`);websiteSums.push(`${digest}  ${destination}`);
}
fs.writeFileSync(path.join(root,`release/SHA256SUMS-${version}.txt`),releaseSums.join('\n')+'\n');
fs.writeFileSync(path.join(target,'SHA256SUMS.txt'),websiteSums.join('\n')+'\n');
const configPath=path.join(root,'pynault-browser/assets/js/config.js');
let config=fs.readFileSync(configPath,'utf8');
config=config.replace(/Windows:.*$/m,`Windows: 'downloads/Pynault-Setup-${version}.exe', // unsigned development installer`);
config=config.replace(/Android:.*$/m,`Android: 'downloads/Pynault-${version}-android-debug.apk', // development-signed APK`);
fs.writeFileSync(configPath,config);
console.log(`Prepared Windows and Android ${version} downloads with SHA-256 checksums. Upload downloads/ together with the website; generated binaries are ignored by Git.`);
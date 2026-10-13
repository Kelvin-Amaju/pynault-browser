;(()=>{
/**
 * Publish actual builds at URLs below. Use HTTPS or verified relative paths.
 * Null means NO RELEASE IS AVAILABLE, and the UI displays an accurate notice.
 * Do not put the source ZIP in any installer slot.
 */
const DOWNLOADS = Object.freeze({
  Windows: 'downloads/Pynault-Setup-0.3.0.exe', // unsigned development installer
  macOS: null,     // e.g. 'downloads/Pynault-0.3.0.dmg'
  Linux: null,     // e.g. 'downloads/Pynault-0.3.0.AppImage'
  Android: 'downloads/Pynault-0.3.0-android-debug.apk', // development-signed APK
  iOS: null        // e.g. verified Apple App Store / TestFlight link
});
const SOURCE_ARCHIVE='downloads/pynault-browser-v0.3-source.zip';
function resolveDownload(family,os){
  if(family==='android')return DOWNLOADS.Android;
  if(family==='ios')return DOWNLOADS.iOS;
  if(family==='desktop') return DOWNLOADS[os]||null;
  return null;
}

window.PynaultDownloads={DOWNLOADS,SOURCE_ARCHIVE,resolveDownload};

})();

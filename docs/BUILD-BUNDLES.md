# Building installable bundles

The Windows packages use Electron; the Android package uses Capacitor and the native `NativePages` browser plugin.

## Windows

```powershell
npm run desktop:dist
```

Outputs: `release/Pynault Setup 0.2.0.exe` (installer) and `release/Pynault 0.2.0.exe` (portable, x64). These builds have no Authenticode signing certificate.

## Android

Requires JDK 21 and Android SDK 36. The generated Android project is included. Set `JAVA_HOME` and `ANDROID_HOME` to your local installations, then run:

```powershell
npm run mobile:apk
```

This builds the web assets, installs the native plugin sources, synchronizes Capacitor, runs Gradle `assembleDebug`, and copies the installable APK to `release/Pynault-0.2.0-android-debug.apk`.

The APK is signed with the local Android development key and requires Android 7.0 (API 24) or newer. Enable installation from the app used to open the APK, or install through `adb install -r release/Pynault-0.2.0-android-debug.apk`.

If a managed Windows network causes Java certificate errors, use the Windows certificate store for the build process:

```powershell
$env:JAVA_TOOL_OPTIONS='-Djavax.net.ssl.trustStoreType=Windows-ROOT -Djavax.net.ssl.trustStore=NUL'
npm run mobile:apk
```

Release signing for Android requires a separate keystore configuration. These are development bundles; device and desktop runtime testing remains necessary.

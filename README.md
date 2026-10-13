# PYNAULT — Browse Beyond. (v0.2.0 developer source)

Graphite & lime web-browser prototype with first-party plugins. Source package contains a React UI, Electron desktop renderer and native Capacitor Android/iOS WebView adapters. **This is an early development build, not a hardened everyday browser.**

## Current implementation

- Custom dark UI with expandable sidebar, optional top tabs, new-tab start page, shortcuts, mobile tab grid and bottom actions.
- Desktop: actual Chromium web pages in isolated `WebContentsView` instances, back/forward/reload, tab switching and opening new windows in new tabs.
- Desktop: site permission prompt, basic tracker-host blocklist, private tab partition, downloads with status, screenshot, reader mode.
- Android/iOS: native WebView/WKWebView implementation sources and sync adapter; mobile integration is **unverified**, not a finished APK/IPA. The bundled preview itself opens pages in your current browser.
- Persistent on-device bookmarks, history, notes, tab URLs, search engine selection and settings; localStorage persistence, *not cloud sync*.
- Search engines: Google, DuckDuckGo, Brave Search, Bing; recently closed regular tab recovery.
- Trusted built-in plugin manifests and basic validation; third-party plugin execution is disabled.
- No third-party extensions, password manager, account sync, automatic updates or security guarantees.

## Install / Desktop (Windows recommended)

Requires Node.js 22+ and npm. Electron downloads Chromium while installing dependencies.

```powershell
npm install
npm run desktop:dev
```

For the Windows installer (on a Windows system):

```powershell
npm run desktop:dist
```

Output under `release/`. If you want to inspect the UI in a normal web browser without Electron, run `npm run dev` and visit http://127.0.0.1:5173; the web preview cannot embed arbitrary sites and opens them externally.

## Android setup

Requires Android Studio, Android SDK and JDK 21 supported by Capacitor 8.

```powershell
npm install
npm run build
npx cap add android
node scripts/install-native.mjs
npx cap sync android
npx cap open android
```

Build/install from Android Studio. The included Android adapter is a source-level prototype and requires device validation. Android private tabs are explicitly disabled until proper cookie/storage isolation is implemented. Download support varies by Android version and permissions.

## iOS setup

Requires a Mac with Xcode.

```bash
npm install
npm run build
npx cap add ios
node scripts/install-native.mjs
npx cap sync ios
npx cap open ios
```

Check both `NativePagesPlugin.swift` and `MyViewController.swift` are in the App target; verify `Main.storyboard` initial bridge view controller uses `MyViewController` (module `App`). WKWebView private tabs use nonpersistent site data. **iOS native integration and downloads have not been verified**.

## Controls

- Ctrl/Cmd+L — Focus address bar
- Ctrl/Cmd+T — New tab
- Ctrl/Cmd+W — Close current tab
- Ctrl/Cmd+Shift+T — Reopen last closed regular tab
- Alt+Left — Go back
- F5 — Refresh
- Right sidebar sheet — bookmarks, history, downloads, plugins, notes, settings

## Architecture

- `src/App.jsx`, `src/styles.css` — shared UI / per-device responsive layouts
- `src/navigation.js`, `src/storage.js` — URL normalization and simple local persistence
- `apps/desktop/main.cjs` — privileged Electron lifecycle; isolated Chromium `WebContentsView` tabs
- `apps/desktop/preload.cjs` — allowlisted API bridge; remote pages cannot access it
- `apps/mobile/native/android/` — isolated Android WebViews behind a Capacitor plugin interface
- `apps/mobile/native/ios/` — WKWebViews behind equivalent plugin
- `scripts/install-native.mjs` — copies native implementations into generated Capacitor projects
- `tests/` — source-level URL handling tests

## Important security limitations

This project is a *prototype*, not a security-audited browser. Electron native views provide separation from React chrome, but browser hardening is much larger: certificate UI, safe-browsing/phishing detection, privacy partitioning, authenticated updates, password security, request blocking updates, OS integration, browser registration, accessibility, crash recovery, per-site permission persistence and resource throttling are future tasks.

Never handle sensitive accounts or passwords in an unreviewed fork. Do not distribute as a privacy-hardened browser. `pynault://newtab` is an application-owned sentinel only; remote schemes besides HTTP(S) are rejected.

## Tests

```bash
npm run verify
```

Expected: 34 passing tests. See `docs/WORK-DONE.md` and `docs/PLUGIN-API.md`.

Note: native builds and React compiler/Vite production builds require `npm install`. The CI-like source verification is not a substitute for a compiled build. This source package does not include an EXE, APK, or IPA.

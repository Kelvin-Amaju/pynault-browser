# PYNAULT BROWSER — v0.3.0

**Browse Beyond.** Desktop: React/Vite + Electron/Chromium. Mobile: React/Capacitor + Android WebView / iOS WKWebView. Same graphite-and-lime product design, separate native website renderers. This repository is source code, not a compiled Windows installer / APK / IPA.

## Run desktop (Node.js 22 or later)
```sh
npm install
npm run verify
npm run desktop:dev
```
Windows distributable:
```sh
npm run desktop:dist
```
Building production installers needs OS-specific build resources and signing. Running `npm install` requires access to npm; it could not be executed in the source-creation environment.

## Run mobile
```sh
npm install
npm run mobile:add:android      # once, if android/ absent
npm run mobile:android          # sync assets + native plugin + open Android Studio
```
Then build/run from Android Studio, after Gradle sync. Android uses minSdk 26 for the QR scanner. You need the Android SDK. The build includes a native website WebView (`NativePagesPlugin.java`) and the official Capacitor barcode scanner. Android camera, microphone, approximate location and internet permissions are installed by `scripts/install-native.mjs`.

On **macOS with Xcode**:
```sh
npm install
npm run mobile:add:ios          # once, if ios/ absent
npm run mobile:ios              # sync assets + native code + open Xcode
```
Add `NativePagesPlugin.swift` and `MyViewController.swift` to the App target if they are not auto included. Confirm the storyboard uses `MyViewController`. The installer adds camera/microphone local-network and Files settings to Info.plist. iOS still needs Apple developer signing to install on a real device.

## Everyday functionality
* Desktop: browser tabs, horizontal tabs and collapsible sidebar, direct URL/search, history, downloads, bookmarks, private partition, notes, reader mode, screenshots, focus mode, settings, keyboard shortcuts.
* Mobile: separate native page-rendering overlays, tab grid, bottom nav, WebView/WKWebView navigation, QR scanning and page handoff, bookmarks, history, bundled privacy tools. iOS private tabs use non-persistent WKWebsiteDataStore. **Android private mode remains disabled**, rather than falsely claiming isolation; normal WebViews share the cookie store.
* Ad & tracker blocker: bundled domain rules and cosmetic hiding in Electron/Android/iOS; on by default. **This is not equivalent to uBlock Origin**, and first-party/in-stream ads can remain. Some site functions can depend on third-party assets: turn off blocking temporarily if a site breaks.
* Location Guard: website geolocation is denied by default. Toggle under Settings → Privacy. Turning it off allows per-site permission prompts, subject to OS permissions. No GPS data is sent to Pynault.
* Built-in plugins: Ad & Tracker Blocker, Location Guard, Share Page QR, Device Link, Reader Mode, Page Notes, Focus Mode, Screenshot (desktop).

## QR codes — send the site you're viewing to a phone
1. Open a website on Pynault Desktop.
2. Click the QR icon beside the address bar (or Share in the sidebar).
3. Scan with **Pynault Mobile → Menu → Share / QR → Scan**, or any QR scanner.
4. Pynault Mobile opens the scanned HTTP(S) site. The QR code is generated entirely on your device.

## Pair the desktop and phone to send links both directions
1. Connect both devices to the **same trusted Wi-Fi** and permit desktop incoming TCP connections on **port 18765** if prompted by your firewall.
2. Desktop → **Devices** → **Enable nearby sharing & create pairing QR**. The desktop starts a tiny local link relay and shows a QR containing a random room ID and 256-bit encryption key.
3. Mobile → **Devices** → **Scan desktop pairing code**. Point camera at the desktop QR. The phone saves the encrypted pairing information locally.
4. Open a website on either device → **Share → Send to paired device**.
5. On the receiving device, open **Devices → Received links** and tap to open. Incoming links are also polled while the app is open.

The relay receives AES-GCM encrypted link messages, not the plaintext URLs or the encryption key. Link messages expire after 24 hours. The QR itself is secret; never post pairing QR codes online. The desktop IP may change with your network, in which case generate a fresh pairing code. Mobile and desktop must be running and able to reach each other on local Wi-Fi. If using mobile cellular or different networks, self-host the relay behind HTTPS and enter its URL on the desktop Devices screen before generating the pairing QR.

## Optional cross-network relay (self-hosted, no database)
```sh
HOST=127.0.0.1 PORT=8787 npm run relay
```
Expose through your own secure **HTTPS** reverse proxy. Set rate limits, TLS and a suitable retention policy before any public deployment. Desktop Devices has an optional custom HTTPS relay input. Do not expose the unauthenticated local Node server directly to the public internet without abuse protection. No account-based cloud sync is supplied.

## Source checks
```sh
npm run verify
```
This runs pure Node tests (navigation, browser tab state, plugin registry, adblock rules, pair/crypto and relay), plus source invariant checks. Native Swift/Java code needs Xcode/Gradle to compile and run; these cannot be replaced by static checks.

## Security notes & honest limitations
- Ad blocking reduces common advertising/tracking hosts but is not exhaustive. The app does not spoof user agents or remove bot challenges from websites.
- Native website views are separated from the privileged React UI. The desktop is sandboxed; the browser shell communicates through an IPC allowlist. Mobile pages are separate WebViews.
- Local device pairing is designed for trusted LANs. It encrypts message **contents** but exposes IP/connection metadata on LAN and has not undergone an external security audit. Device keys are stored in local app storage; OS secure storage would be advisable before general public release.
- No arbitrary external Chrome/Firefox extension support (not technically equivalent). These are vetted bundled first-party plugins.
- Android WebView private tabs are intentionally disabled until isolated WebView data processes are added. iOS uses a nonpersistent store.
- The custom iOS downloading, WebKit content filtering, mobile permissions and QR scanner require actual real-device checks before release.
- This project is **not yet a production-hardened replacement for Chrome, Edge or Firefox**. Real site compatibility, code signing, updates and accessibility/QA require physical environment testing.

See `docs/WORK-DONE.md`, `docs/AUDIT.md` and `docs/PLUGIN-API.md` for implementation status.

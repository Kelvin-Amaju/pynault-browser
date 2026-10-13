# Pynault Browser v0.2.0 — Work completed

## Implemented in this source update

- Preserved the user-approved Pynault branding, desktop design and mobile UI.
- Improved desktop `WebContentsView` mounting to avoid detaching/re-attaching a page on every viewport update.
- Added Chromium page keyboard handling: Ctrl/Cmd+L, Ctrl/Cmd+T, Ctrl/Cmd+W, Ctrl/Cmd+Shift+T, reload, Alt+Left/Right, including while a remote page has focus.
- Added private session storage/cache cleanup when the last desktop private tab closes (nonpersistent partition).
- Improved main-frame navigation failure reporting, source URL validation, and React error-state visibility.
- Added configurable Google, DuckDuckGo, Brave and Bing search.
- Added recently-closed tab recovery (regular tabs only) and 40-tab/300-visit limits.
- Hardened restoration of previously stored tab data and introduced testable tab-state helpers.
- Added explicit desktop clear site-data action with confirmation; it clears browser cookies and caches (not local Pynault bookmarks or notes).
- Improved Android download folder opening, cookie download handling and load-error reporting.
- Improved iOS support for `target=_blank` navigation and subframe browsing; added WKWebView back/forward swipe support and error reporting.
- Added a validated, capability-described first-party tool registry; third-party plugin execution remains disabled.
- Expanded Node-based tests from 7 to 34; `npm run verify` passes in this container.
- Added source verification script and draft plugin API documentation.

## Checks completed

- `npm run verify` — PASSED, 34/34 tests.
- Electron main/preload source syntax — PASSED.
- React JSX source parser — PASSED with TypeScript transpilation diagnostics (0 errors). **This is not a Vite production build.**
- Source ZIP built and checked for expected files.

## Cannot be verified in this environment

- `npm install` timed out against registry access; Electron/Vite dependencies are unavailable here.
- Full `npm run build`, `npm run desktop:dev`, signed Windows installers, Android Gradle and iOS Xcode builds could not be performed.
- Native plugin registration and browser engine integrations require Windows/Android/macOS testing.
- Android private browsing remains disabled; iOS downloads, camera/mic access, native share and full browser security hardening remain outstanding.

**Deployment status:** Developer source release, not a production-safe daily browser or distribution-ready EXE/APK/IPA.

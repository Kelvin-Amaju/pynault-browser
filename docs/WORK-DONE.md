# Pynault — v0.3.0 completed source changes

- Reworked graphite/lime visual treatment of desktop sidebar and header, home search, shortcuts, widget rail and mobile views to be closer to approved PNG designs. Added aurora photographic background `public/aurora-pynault.png`. Existing approved concept boards retained in `design/`.
- Desktop: expanded ad blocker from 9 hosts to 105 curated ad/tracker domains, third-party request checks, lightweight cosmetic hiding, blocker stats and prompt-denied geolocation by default.
- Android: same bundled domain block list, cosmetic blocking, native location permission confirmation, website media prompts; registered OS camera/microphone/location permissions. QR scanner integration through the official Capacitor package.
- iOS: WebKit content rule list for ads/trackers, cosmetic filter, document-start location JavaScript guard, WKWebView native download delegate to Documents/Downloads, media capture prompt and iOS Info.plist additions. Device compiling remains mandatory.
- QR: first-party PNG QR generation in React (qrcode package), camera scanning via Capacitor scanner, open scanned valid HTTP(S) URLs.
- Device linking: random pairing QR (32-byte encryption key), WebCrypto AES-GCM link encryption and decryption, background foreground polling, inbox UI, source/device labels and link send action.
- Relay: optional embedded desktop LAN HTTP relay (opt-in on Devices), optional standalone Node relay for HTTPS reverse proxy; size, TTL, message-count limits and server tests.
- Existing navigation/session/bookmark/history/plugin behaviors preserved, desktop IPC allowlist extended rather than exposing remote webpages to Node.
- Source audit tests expanded to 46 with successful results as generated. Node syntax checks and Swift parser checks run; native compile and production Vite bundle require external dependencies and toolchains.

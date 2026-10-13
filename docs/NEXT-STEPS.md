# Release verification checklist (not claimed complete)
1. Install dependencies and run `npm run build`, `npm run desktop:dev` on Windows. Verify UI screenshot against `design/` references at 1440x900 and resized layouts.
2. Build signed release for Windows. Test ordinary and private site sessions, downloads, media permissions, errors, malicious URL blocking and browser memory.
3. Build Android with SDK 26+; verify plugin registration, QR camera, local relay over Wi-Fi, media OS permissions and WebView placement on devices.
4. Build iOS in Xcode; verify WKContentRuleList, Swift download delegate, WKWebView overlays, scanner, camera/mic and local-network permissions.
5. Threat model and penetration-test native bridge, relay, key storage, 3rd-party pages, and ad-blocking compatibility.

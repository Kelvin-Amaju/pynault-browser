# Pynault V0.2 → V0.3 source audit

| Previously observed issue | Action in V0.3 | Verification scope |
| --- | --- | --- |
| Concept screenshot had photographic aurora; home drew geometric shapes | Use full-resolution matching aurora mountain wallpaper, soften buttons/backgrounds and sidebar/tab treatments | CSS/source only; screenshot comparison from live app needs dependencies |
| Tracker blocker had 9 hostnames | Curated 105 ad + tracker domains, cosmetic hiding | Node domain tests; native runtime unverified |
| iOS shield silently did nothing | WKContentRuleListStore compilation and userContentController management | Swift syntax parsed; iOS compile/device QA pending |
| No persistent default location guard | Block geolocation requests by default, control in settings, site prompts when opted in | Source checks only |
| No page QR code or camera scanner | Offline QR generator and official native scanner | Source checks only |
| No desktop/mobile link handoff | Pairing QR + AES-GCM + local relay + received inbox + optional HTTPS relay | Node end-to-end relay and cipher tests passed |
| Android WebView couldn't request camera/mic properly | Native site and OS permission confirmation flows | Requires Android Studio/device |
| iOS download action was stubbed | Added WebKit downloads saved under Documents/Downloads | Requires iOS device |
| Pairing lost when desktop restarted | Auto-restart local relay while paired, prompt re-pair on desktop IP changes | Source checks only |
| Old v0.2 documentation described a future blocker | Updated docs and plugin registry | Package inspection |

## NOT VERIFIED / DO NOT MISREPRESENT
- `npm install` could not run in this environment (npm registry DNS unavailable); consequently **no production Vite bundle, Electron GUI execution or installer build has been performed here**.
- Android Java and iOS Swift need type checking and device integration tests. Swift parser validation checks syntax only, not WebKit API availability or signing.
- Android private mode remains off because the WebView cookies/sessions aren't isolated per tab/process.
- Full Chrome extension compatibility, phishing protection, a mature password manager, authenticated update distribution, and public-store signoffs are not in scope for this code audit.
- Privacy blocking isn't a guarantee of zero ads or that websites cannot infer coarse location from IP address. A geolocation guard doesn't hide your IP or timezone.
- Real use of local relay may require the OS firewall and iOS/Android network permissions; a production relay needs TLS and abuse-rate controls.

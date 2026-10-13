# Pynault first-party plugin system — v0.3

`src/plugins/registry.js` defines and validates installed first-party tools. External executable/Chrome extension code is intentionally never loaded into privileged browser chrome. Each native adapter implements the capabilities available on that platform.

| Plugin | Desktop | Android | iOS |
|---|---|---|---|
| Ad & Tracker Blocker | request interception + CSS | WebView interception + CSS | WebKit content rule lists + CSS |
| Location Guard | permission deny/allow prompts | WebChromeClient geolocation prompt | document-start JS guard plus no OS location entitlement |
| Website QR | offline generation | generation + camera scanner | generation + camera scanner |
| Device Link | encrypted pairing + LAN relay | encrypted pairing + relay client | encrypted pairing + relay client |
| Reader | CSS toggle | CSS toggle | CSS toggle |
| Page Notes | local browser data | local browser data | local browser data |
| Focus Mode | local UI | local UI | local UI |
| Screenshot | Chromium capture | not included | not included |

Privacy tools are best-effort; they are not equivalent to a dedicated, fully fledged Chrome-compatible extension ecosystem. This registry is a **trusted built-in action registry**, not a marketplace or arbitrary extension loader. Plugin manifest checks verify IDs, versions, capabilities, and platforms.

Potential future additions after a full security design include Cookie Controls, Privacy Dashboard, Tab Hibernation, Tracking Link Cleaner, Translator, and PDF Assistant. These are suggestions, not shipped plugin implementations.

**Critical guard:** Native pages never get direct access to `window.pynault` IPC or Capacitor application shell privileges. Never load downloaded executable extensions in Electron's main/preload/shell runtime.

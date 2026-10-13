# Pynault first-party plugin API — draft v0.2

**Current status:** The browser includes five trusted, built-in tools exposed by the UI registry. Third-party code installation/execution and the Plugin Marketplace **are not implemented**. Do not advertise Chrome Web Store compatibility.

## Trusted plugin manifest

`src/plugins/registry.js` owns manifests and exposes validation:

```js
{
  id: 'reader',
  name: 'Reader Mode',
  version: '0.2.0',
  description: 'Simplify the current article',
  permissions: ['browser.tabs.active', 'browser.page.reader'],
  platforms: ['desktop', 'android', 'ios']
}
```

There is no `eval`, arbitrary filesystem access, or direct native runtime exposure. The UI calls predefined, allowlisted browser actions. External websites are rendered in separate native/Chromium views without direct access to browser chrome IPC.

## Internal capabilities

| Capability | Purpose |
|---|---|
| `browser.tabs.active` | Act on selected page |
| `browser.page.reader` | Toggle reader styling |
| `browser.page.screenshot` | Capture a page (desktop only) |
| `browser.notes` | Local website notes |
| `browser.privacy` | Built-in tracker toggle (desktop/Android) |
| `browser.ui` | Change Pynault chrome layout |

## Future third-party plugin SDK (not yet implemented)

A trustworthy extension ecosystem requires signed manifests, a separate execution environment, site-specific permissions, review, versioned APIs, revocation/update signing, a capability broker and a browser-controlled network policy. iOS distribution and executable-code restrictions require specific platform review. Unknown plugin permissions must be rejected.

**Never run downloaded plugin JavaScript in Electron's privileged renderer or preload process.**

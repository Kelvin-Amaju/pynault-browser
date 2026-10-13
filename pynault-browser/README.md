# Pynault Browser — Official Landing Page

**Brand:** Pynault — Browse Beyond.

**Website stack:** HTML5 + Bootstrap 5.1 + custom responsive CSS + vanilla JavaScript.

**Optional animation libraries (CDN):** GSAP 3.12 / ScrollTrigger; CSS and IntersectionObserver provide fallbacks.

**Theme:** Graphite `#080d0f`, Lime `#cfff5d`, Off-white `#f6f6ee`.

**Designed for:** Wide-screen desktops, laptops, tablets, foldables, and mobile phones.

The landing page uses HTML, CSS and JavaScript with a PHP entry point. `index.php` redirects to `/home`; Apache serves `home.php` through the extensionless URL. No database or application build is required.

## 1. Run and deploy

1. Deploy this folder to a PHP-enabled Apache host (including cPanel), retaining `.htaccess`, `index.php`, `home.php`, `assets/` and `downloads/`.
2. Enable Apache `mod_rewrite` and allow the `.htaccess` directives. The site can also live under a subdirectory.
3. Visit the folder URL: it redirects to `home`. Requests to `home.php` redirect to `home`; query strings are preserved.
4. For PHP-only local preview use `php -S 127.0.0.1:8080` and open `http://127.0.0.1:8080/home.php`. PHP’s development server does not process `.htaccess`; use Apache to test clean URLs.
5. Static hosts require conversion back to HTML and host-specific redirects. Python’s static server cannot execute PHP.
6. Bootstrap and icons are bundled locally. GSAP and Google Fonts use CDNs with motion and font fallbacks.

**No tracking pixels or analytics libraries are included.** All platform detection takes place on the visitor's own device. This website does not ask for location permission or collect GPS coordinates.

## 2. Website pages / sections

The single-page site includes:

| Section | Visitor experience |
| --- | --- |
| Header | Fixed responsive pill navigation, mobile menu, download CTA, section links |
| Hero | Kinetic typographic intro, actual Pynault brand logo, aurora-inspired browser product mockup, floating feature badges |
| Ticker | Continuous graphic marquee, pauses naturally with reduced-motion setting |
| Brand story | Editorial two-column introduction with large type |
| Browser experience | Three designed showcase panels for workspaces/tabs, privacy and cross-device link sharing |
| Privacy comparison | Working interactive illustration toggling between a calm article and a cluttered example; **not a performance benchmark** |
| First-party tools | Six feature cards describing the eight current bundled browser tools |
| Connected devices | Desktop/phone mockups, illustrative QR code, three-step website handoff instructions |
| Download selector | Local platform recognition; best match highlighted; three platform cards always visible |
| FAQ | Bootstrap accordion with five accurate product/compatibility answers |
| Closing/footer | Final CTA, product identity, navigation and version language |
| Unpublished-release dialog | Clear explanation + working source ZIP download instead of broken installer link |

### Micro-interactions and motion

- Loading intro with progress sweep, removed after load.
- Scroll progress line, scrolling header, smooth anchors.
- GSAP/ScrollTrigger scroll reveals when the CDN is accessible; IntersectionObserver when it is not.
- CSS background orbits, breathing logo, aurora depth, moving marquee, product card lifts, hover treatments.
- Pointer-responsive desktop browser perspective effect.
- Interactive privacy comparison toggle.
- Real mobile navigation open/close, focus states and Escape handling for the fallback dialog.
- `prefers-reduced-motion` support for essential animations and scroll behavior.

## 3. Download detection: precisely how it works

Files: `assets/js/detect.js`, `assets/js/config.js`, `assets/js/main.js`.

The detection code uses `navigator.userAgentData.platform` where supported, then `navigator.platform` and `navigator.userAgent`. It also handles modern iPadOS reporting itself as `Mac` using `maxTouchPoints > 1`. Result classes:

| Browser/device | Site behavior |
| --- | --- |
| Windows | Highlight Desktop; label main CTA Windows |
| macOS | Highlight Desktop; label main CTA macOS |
| Linux | Highlight Desktop; label main CTA Linux |
| Android | Highlight Android |
| iOS or iPadOS | Highlight iOS |
| Unknown/blocked/unreliable | Highlight **none**; show Desktop, Android and iOS equally |

**All three download cards are always visible**, even for a recognized device. This is intentional, so someone on a desktop can request the Android build for another device. Automatic redirection is **not** performed just by visiting the page. On click, a configured release file is opened; otherwise the visitor gets a candid notice and the development source option. No fake `.exe`, `.apk`, or store URL is embedded.

### Configure production installer URLs

Edit only `assets/js/config.js`:

```js
const DOWNLOADS = Object.freeze({
  Windows: 'downloads/Pynault-Setup-1.0.exe',
  macOS: 'downloads/Pynault-1.0.dmg',
  Linux: 'downloads/Pynault-1.0.AppImage',
  Android: 'downloads/Pynault-1.0.apk',
  iOS: 'https://apps.apple.com/app/YOUR-REAL-APP-ID'
});
```

**Example paths above are examples only** — do not paste them unless those signed/verified artifacts actually exist. Upload each binary, confirm checksums/signing, then configure the URL. Windows, macOS and Linux all have independent addresses; the desktop card uses detected OS. A desktop visitor whose OS is unknown gets the source/development dialog instead of the wrong binary.

For Android you can also configure a legitimate Google Play listing. For iOS use a valid App Store or TestFlight destination (ordinary iOS visitors cannot simply install arbitrary unsigned IPAs from a webpage). Prefer HTTPS and provide published version, file size, hash and platform requirements on the actual release page.

**Included source download:** `downloads/pynault-browser-v0.3-source.zip` is the original browser v0.3 source package. This is linked separately and is **never passed off as an app installer**.

## 4. Pynault Browser itself — what it is and what it can do

The site describes the **existing Pynault v0.3 development source** provided with this project. It does not independently validate the native application. The corresponding repository/package contains:

| Area | In current browser source | Notes / qualification |
| --- | --- | --- |
| Desktop | React + Vite + Electron + Chromium | Source intended for Windows/macOS/Linux; no signed release included |
| Mobile | React + Capacitor + native Android WebView / iOS WKWebView bridges | Needs Gradle/Android Studio and Xcode/native device testing |
| Browsing | Tabs, sidebar, address/search, bookmarks, history, downloads, workspaces | Desktop implementation plus mobile native browser adapters |
| Personalization | Graphite/lime theme, collapsible sidebar, optional horizontal tabs, settings | UI differs by screen size |
| Private browsing | Desktop private partition, non-persistent iOS WKWebsiteDataStore | **Android private tabs are disabled** in v0.3 due to incomplete store isolation |
| Ad & Tracker Blocker | Bundled list of ~105 domains and cosmetic hiding | **Not comprehensive ad blocking**, not uBlock Origin equivalence |
| Location Guard | Denies website geolocation by default | Browser settings can change behavior, OS/site permissions still apply |
| QR Share | Desktop QR generation; mobile camera scanning integration | Normal HTTP(S) link handoff; website QR is generated locally |
| Device Link | Paired-device encrypted link relay over LAN | Same Wi-Fi and desktop relay needed; not cloud sync |
| Tools | Reader mode, notes, focus mode, desktop screenshots | Browser-specific first-party tools |
| Plugin architecture | First-party plugin registry + permission validation | Does **not** offer universal Chrome extension compatibility |
| AI | UI hooks/ideas for AI features | Do not claim an AI assistant is fully deployed or hosted; this landing does not connect to any provider |
| Accounts/sync | No general account-based browser syncing | Shared-link relay is not bookmarks/history/password sync |

### Capacity, limits and realistic expectations

- **Tabs/workspaces:** The browser source permits up to 40 open tabs. Actual resource use depends on device memory and the browser engine; no performance or battery-life benchmark has been established.
- **Download size:** Actual installation binary sizes are not available. The bundled browser **source** archive is approximately 7 MB; this is **not** an indicator of installed app size.
- **Network use:** Ordinary web browsing needs internet access; QR generation works locally; LAN link exchange needs both devices reachable over trusted local Wi-Fi.
- **Ad filtering:** A finite domain list cannot guarantee removal of every ad, first-party ad, sponsored search result, in-stream video ad or consent banner. Users may need to disable blocking per site if a website breaks.
- **Geolocation:** Denying website access is not the same as hiding an IP address, system timezone, network routing or browser fingerprint. Pynault is **not** a VPN or anonymity network.
- **Cross-platform:** Native mobile APIs, OS permissions and iOS distribution rules differ. Feature parity is a goal, not a validated claim.
- **Security:** The v0.3 device relay has not undergone an external security audit. Before public launch: review pairing secrets, secure storage, TLS, relay abuse protection, signing and automatic updates.
- **Availability:** The included ZIP is source code. A public beta requires actual compiled, tested and signed app distributions.

## 5. Product Q&A

**Does the page silently redirect or start a download?** No. Auto detection only highlights the recommended card and edits the button label. Downloads require explicit clicks.

**What if detection fails?** Every option appears normally without a recommendation. The person chooses Desktop, iOS or Android.

**Does the page use geolocation for detection?** No. It reads browser OS signals locally, without a permission request.

**Does the desktop download pick the correct OS?** Yes when recognized. Unknown desktop OS intentionally gets a non-release explanation rather than an arbitrary installer.

**Does QR sharing between browser apps require accounts?** Not for local QR-based transfer; encrypted paired device link exchange uses a reachable relay on the same network. There is no user-account sync service.

**Is the illustrative QR on the landing page an install link?** No. It's a genuine scannable QR for `https://example.com`, used purely to illustrate the handoff. Replace it with your actual release/site URL if desired. To generate a new QR: use any trusted QR generator or a local QR library and replace `assets/img/demo-qr.png`.

**Can I use the Pynault logo and background?** They came from the browser project's approved assets and are bundled in `assets/img/`. Other page graphics were created in HTML/CSS, not copied from third-party templates.

## 6. Files

```
Pynault-Landing/
├── home.php
├── README.md
├── CHANGELOG.md
├── assets/
│   ├── css/style.css            # Fully custom brand styling + responsive views
│   ├── js/detect.js             # Pure platform detection helpers
│   ├── js/config.js             # Release file URLs; null means not published
│   ├── js/main.js               # Behavior, animations, UI, downloads
│   └── img/
│       ├── pynault-mark.png     # Approved Pynault brand mark
│       ├── aurora-pynault.png   # Approved aurora original (Open Graph)
│       ├── aurora-pynault.webp  # Compressed production image
│       └── demo-qr.png          # Real illustrative QR -> example.com
├── downloads/
│   └── pynault-browser-v0.3-source.zip
├── assets/vendor/                 # Bundled Bootstrap 5 CSS + JS and Bootstrap Icons
└── tests/
    └── device-detection.test.cjs
```

## 7. Testing / launch checklist

- Run `node --test tests/device-detection.test.cjs` (requires Node 18+, but the site itself does not need Node).
- Open Chrome DevTools > Device toolbar and test 320px, 360px, 390px, 768px, 1024px, 1440px.
- Exercise all sections and the FAQ on mouse and touch, test privacy toggle, mobile nav and scroll anchors.
- Test actual devices: Windows, Mac, Android phone, iPhone and iPadOS desktop-mode user agent.
- Temporarily block CDN access and check the fallback menu, reveal animation and release dialog.
- Verify all configured release URLs, MIME types, checksums and signing **before** enabling binaries.
- Do not publish the download CTA with placeholder URLs. `null` is deliberately safe.
- For privacy/compliance, publish your own privacy notice and support channels before a public launch.

## 8. Reference direction (inspiration, not copied source)

- Brave: clear visitor-facing feature hierarchy and platform-aware download story.
- Chrome: large editorial typography, device imagery and accessible feature education.
- Adon startup-agency: expressive typography, generous whitespace, motion, and art direction.

Site artwork is locally packaged. Third-party assets aren't hotlinked except for standard CSS/JS/font CDNs. No Brave, Chrome or Adon proprietary page structure, text or logo is included.

# Pynault Browser — Remaining verification and production work

The code fixes and source tests for v0.2.0 are complete; the following items require installed dependencies, a device or substantial additional engineering:

1. On Windows, run `npm install`, `npm run build`, `npm run desktop:dev` and verify real Chromium tab rendering, website permissions, keyboard shortcuts, downloads, bookmarks and private sessions.
2. Generate Android and iOS projects using the README commands; run device tests of viewport alignment, auth forms, cookies, downloads, media permissions and background/foreground lifecycles.
3. Isolate Android private browsing data before enabling private mode on Android.
4. Implement iOS file downloads, camera/mic permission UX, native sharing and video fullscreen.
5. Migrate high-volume history/bookmarks/session data from localStorage to SQLite with backups/migrations.
6. Add phishing and certificate warning UX, granular site permissions, modern tracking lists, engine update discipline and a security review.
7. Build a permission-brokered sandbox and signed package format before accepting third-party extensions.
8. Accessibility and tablet/foldable polish; translations and RTL testing.
9. Integration tests against real sites on all platforms, crash recovery and trusted update delivery.
10. Code-sign and package Windows installers, Android release APK/AAB and iOS release builds once QA and security hardening are passed.

**Do not ship as a privacy-hardened browser until these tasks are verified.**

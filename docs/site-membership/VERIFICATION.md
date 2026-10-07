# Shared site membership — October 7, 2026

Production code: `f2e5c3b`, Cloudflare Pages deployment `48c7d1e5`.

The main-page Membership panel supports Google sign-in and email/password registration/login using the existing Lounge member database and 90-day sessions. Profile setup offers six starter avatars and custom avatar/banner uploads up to 5 MB.

Passed:
- Full existing automated test suite, with a production PBKDF2-limit regression check.
- Google callback account reuse, main-page return routing, handoff/state replay rejection, and prevention of automatic linking to unverified password identities (mocked Google provider).
- Live email registration, returning login, shared Lounge identity, private email, preset saving/restoring, incorrect-password rejection, and logout. The temporary private test member and its associated sessions/write-limit row were removed afterward.
- Live Chromium checks: dialog open/close, registration/login tab behavior, Google age-confirmation gating, desktop and 390px mobile panel bounds, and successful loading of all six starter avatar assets.

The local runtime accepted 120,000 PBKDF2 iterations while production rejected values above 100,000. Production logs confirmed the difference; the implementation and regression coverage now respect the production limit.

Email ownership verification and self-service password-reset emails are not configured. Existing Lounge users should use their original Google sign-in. Interactive Google consent was not exercised in this verification run.

Screenshots: `membership-desktop.png`, `membership-mobile.png`, and `starter-avatars.png`.

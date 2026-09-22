# Jackson Rewards

Jackson Rewards is a Next.js application packaged for Android with Capacitor. It includes game and survey offers, rewarded ads, daily rewards, a wallet, withdrawals, and VIP subscriptions.

This repository contains the web client and Android app. Authentication, reward validation, payouts, and other business operations depend on a separately deployed backend. There is no backend server or database setup in this repository.

## Stack

- Next.js 15, React 18, JavaScript/JSX, and Tailwind CSS
- Redux Toolkit and Redux Persist for application data; Zustand for onboarding
- Capacitor 7 and Java for Android integrations
- Firebase authentication, Verisoul, Play Integrity, AppLovin MAX, Adjust, Stripe, and Google Play billing

## Local development

Use Node.js 22 or newer and npm. The lockfile is committed; install with:

```sh
npm ci
cp .env.example .env.local
```

Replace the example values with the appropriate development configuration, then run:

```sh
npm run dev
```

Open http://localhost:3000. `npm run dev:https` also exposes an HTTPS development proxy on port 3001.

Firebase configuration is required when authentication modules initialize, including during a production build. Every `NEXT_PUBLIC_*` value is embedded in the client bundle. Never use this prefix for server API keys, service-account credentials, or signing secrets. Environment changes require a new build.

`.npmrc` enables legacy peer resolution because some native plugins declare Capacitor 8 peers while the app uses Capacitor 7. Installation success does not verify native compatibility.

## Build and verification

```sh
npm run lint
npm run check:handoff
npm run build
```

The production build exports static files to `out/`. Deploy this directory to a static host that serves directory indexes. There is no Node production server script for this static export. Console calls are stripped from production web bundles; use development builds for diagnostics.

The handoff check inspects tracked files, unignored new files, and common credential signatures. It does not inspect Git history or certify the absence of secrets. See [the handoff review](docs/CLIENT_HANDOFF_REVIEW.md) for current findings and validation limits.

## Android

Install Android Studio, the Android SDK for API 35, and the JDK required by the installed Capacitor/Android Gradle toolchain. The project uses Gradle 8.13, targets API 35, and supports API 23 and later.

Obtain the client-owned `google-services.json` for `com.jackson.app` and place it in `android/app/`. This configuration is intentionally not tracked. Release signing keys and passwords must also remain outside Git.

```sh
npm run build
npx cap sync android
npx cap open android
```

Build and test on a physical Android device. Phone authentication, biometrics, integrity checks, ads, attribution, and purchases cannot be validated fully in a browser. Configure release signing before distributing a release build; this repository does not provide signing credentials.

## Code layout

| Path | Purpose |
| --- | --- |
| `app/` | Routes and feature-specific UI |
| `components/` | Shared UI and native integration components |
| `contexts/AuthContext.js` | Authentication, session restoration, redirects, and initial data loading |
| `lib/api.js` | Backend requests and endpoint functions |
| `lib/redux/` | Application state, asynchronous actions, and persisted caches |
| `stores/useOnboardingStore.js` | Onboarding questionnaire state |
| `hooks/` | Shared feature behavior |
| `android/` | Native Android app and custom Java plugins |
| `docs/` | Integration notes and handoff review |

## Service configuration

Before deployment, confirm ownership and environment selection for Firebase, Turnstile, Verisoul, Play Integrity, Stripe, Google Play billing, AppLovin, and Adjust. Some public SDK identifiers, API fallback URLs, and Android deep-link domains remain in source and must be checked against the client's accounts.

The browser ad implementation includes simulations. Do not use a simulated ad callback as proof of a reward entitlement; reward validation belongs on the backend.

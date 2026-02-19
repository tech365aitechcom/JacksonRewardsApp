# Google UMP (User Messaging Platform) – Ad consent

This app collects user consent for ads via Google’s UMP SDK so AdMob (and AppLovin MAX mediation) can serve ads in line with [AdMob privacy requirements](https://developers.google.com/admob/android/privacy).

## What’s implemented

### Android

- **UMP SDK** (`com.google.android.ump:user-messaging-platform:4.0.0`) in `android/app/build.gradle`.
- **Launch consent flow** in `MainActivity`: on every app launch we call `requestConsentInfoUpdate()` then `loadAndShowConsentFormIfRequired()`. If a consent form is required (e.g. EEA/UK), it is shown before the user uses the app.
- **Capacitor plugin** `UmpConsent`:
  - `canRequestAds()` – whether the app is allowed to request ads (consent obtained or not required).
  - `showPrivacyOptionsForm()` – shows the Google privacy options form (for “Manage ad choices” in settings).

### Web / JS

- **`lib/umpConsent.js`** – `canRequestAds()` and `showPrivacyOptionsForm()`; on non-Android they no-op or return “allowed” as appropriate.
- **`hooks/useAppLovinAds.js`** – Before initializing AppLovin MAX we wait up to ~5 seconds for `canRequestAds()` to be true, then initialize. The hook also returns `showPrivacyOptionsForm` for use in Settings.

## AdMob console setup

1. In [AdMob](https://admob.google.com) go to **Privacy & messaging**.
2. Create a **user message** (e.g. “Consent message” for EEA/UK) and link it to your app (App ID already in the app: `ca-app-pub-2800391972465887~5310386906` for Android).
3. If your message type requires an in-app “Privacy options” entry point, add a button in your app (e.g. in Settings) that calls `showPrivacyOptionsForm()` from the ad hook.

## Using “Privacy options” in the app

Where you use `useAppLovinAds()`, you get `showPrivacyOptionsForm`. Use it for a “Manage ad choices” or “Privacy options” button:

```js
const { showPrivacyOptionsForm } = useAppLovinAds();

// In your Settings / Privacy screen:
<button onClick={() => showPrivacyOptionsForm()}>Manage ad choices</button>
```

## iOS

UMP is not yet implemented on iOS. When you add an iOS target, integrate the [UMP SDK for iOS](https://developers.google.com/admob/ios/privacy) (e.g. in `AppDelegate` or scene delegate) and, if desired, a small native bridge for `canRequestAds` and `showPrivacyOptionsForm` so `lib/umpConsent.js` can call them on iOS too.

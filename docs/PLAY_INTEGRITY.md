# Google Play Integrity API – Frontend Integration

This app integrates **Google Play Integrity API** per [official documentation](https://developer.android.com/google/play/integrity/overview). Reward/claim and withdrawal flows send an integrity token; the **backend** verifies it with Google. The frontend (Android only) requests tokens via the SDK and sends them as `X-Integrity-Token`.

## Verification checklist (vs official docs)

| Requirement | Implementation |
|-------------|----------------|
| [Classic request](https://developer.android.com/google/play/integrity/classic): nonce + `requestIntegrityToken` | ✓ `lib/playIntegrity.js`: nonce from backend challenge or client-generated; `PlayIntegrity.requestIntegrityToken({ nonce, googleCloudProjectNumber })` |
| Token sent to backend for verification | ✓ `lib/api.js`: `X-Integrity-Token` header on reward/withdraw endpoints |
| [Decrypt and verify](https://developer.android.com/google/play/integrity/classic#decrypt-verify) on server only | ✓ Backend uses Google Play Integrity API + **service account** (never in app) |
| Plugin usage | ✓ [@capacitor-community/play-integrity](https://www.npmjs.com/package/@capacitor-community/play-integrity): `requestIntegrityToken(options)` → `{ token }` |

## Flow (aligned with Postman collection)

1. **Optional:** Backend `POST /api/integrity/challenge` returns a nonce; frontend can use it when requesting the integrity token for stronger binding.
2. **Android:** Frontend uses `@capacitor-community/play-integrity` to call `requestIntegrityToken(nonce)` and gets a token.
3. **API calls:** For endpoints that require integrity, the app automatically adds header `X-Integrity-Token: <token>` when a token is available (Android only).
4. **Backend:** Verifies the token with Google (using the Play Integrity API and **service account credentials on the server only**). Never put service account JSON in the app or in git.

## Frontend

- **`lib/playIntegrity.js`** – Requests integrity token on Android; no-op on web/iOS. Optionally uses `POST /api/integrity/challenge` for nonce.
- **`lib/api.js`** – For the endpoints listed in `ENDPOINTS_REQUIRING_INTEGRITY`, the app calls `getIntegrityToken()` and sets `X-Integrity-Token` when present.

### Endpoints that send `X-Integrity-Token`

| Security level (Postman) | App endpoint | When used |
|--------------------------|-------------|-----------|
| High                     | `POST /api/payout/create`   | Withdrawal (createWithdrawal) |
| High                     | `POST /api/payouts/create`  | Tremendous payout |
| Medium                   | `POST /api/game/earn`       | Transfer game earnings |
| Medium                   | `POST /api/daily-challenge/complete` | Complete daily challenge |
| Medium                   | `POST /api/daily-rewards/claim`       | Claim daily reward |
| Medium                   | `POST /api/daily-rewards/recover`    | Recover missed day |
| Medium                   | `POST /api/streak/claim-reward`      | Claim streak milestone |

### Exported API helpers (for status/debug)

- `getIntegrityChallengeFromBackend(token)` – `POST /api/integrity/challenge`
- `verifyIntegrityToken(integrityToken, token)` – `POST /api/integrity/verify`
- `getIntegrityStatus(token)` – `GET /api/integrity/status`

## Backend and credentials (required – backend only)

- **`GOOGLE_PLAY_INTEGRITY_SERVICE_ACCOUNT`** (service account JSON) is **required** for backend verification. It must be set only on the server (e.g. as an environment variable). **Never** put this JSON in the frontend app, in git, or in client-accessible config. The backend uses it to decrypt and verify the integrity token with Google ([official: Decrypt and verify the integrity verdict](https://developer.android.com/google/play/integrity/classic#decrypt-verify)).
- **Verification:** Backend decrypts/verifies the token with Google Play Integrity API and enforces policy (e.g. block withdrawals if verification fails). If this credential was ever exposed, rotate the key in Google Cloud and update the backend env only.

## Setup (Android)

1. Enable **Play Integrity API** in Google Cloud Console and link the project in Play Console (**Test and release > App integrity**).
2. `npm install @capacitor-community/play-integrity@7` (already in package.json).
3. `npx cap sync` so the native project includes the plugin.

## References

- [Play Integrity API overview](https://developer.android.com/google/play/integrity/overview)
- [Classic request (nonce)](https://developer.android.com/google/play/integrity/classic)
- [Capacitor plugin](https://www.npmjs.com/package/@capacitor-community/play-integrity)

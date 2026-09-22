# Client handoff review

Review date: 21 September 2026.

## Result

The source tree has been cleaned for review. This is not a production security sign-off: authentication storage, ad reward validation, Android settings, and native integrations still need the work described below. No client repository has been created or pushed, and Git history has not been rewritten.

## Completed cleanup

- Excluded 37 tracked local/configuration/reference artifacts: release binaries and metadata, JVM replay logs, Android Studio and local editor settings, local assistant settings, Firebase Android configuration, internal PDFs/CSV/Postman material, an editor screenshot, an unused onboarding draft, and standalone backend patch files. Local copies remain available.
- Removed one unused redirect-test component that referenced a missing resolver. Its original source was backed up outside the repository under `/tmp/jackson-handoff-backup`.
- Expanded `.gitignore` to cover environment files, signing material, local tools, logs, and build output. `.env.example` remains tracked.
- Removed over 900 direct debug/info console calls, associated empty diagnostic branches, and credential-bearing diagnostic payloads from authentication/payment code. Production web builds strip console calls. Native Android logging is separate and still needs release review.
- Simplified decorative and conversational comments, removed placeholder editing instructions, and corrected misleading API documentation. Technical comments, product copy, provider assets, and useful TODOs were retained.
- Removed the unused public Verisoul API-key setting. The browser SDK uses a public project identifier; server secrets do not belong in the frontend environment template.
- Removed the hardcoded Stripe test publishable key from Capacitor configuration. The payment component initializes Stripe from its existing environment variable.
- Added the missing Play Integrity project-number variable to `.env.example`; removed the backend-only JWT secret from that frontend template.
- Replaced the starter README with application-specific setup, build, architecture, and configuration instructions.
- Repaired the lint command, removed the incompatible `next start` script, and excluded generated/native/vendor files from the JavaScript lint scope.
- Added `npm run check:handoff` to detect unwanted tracked files and common credential signatures.
- Updated mobile build scripts to stop on failure and removed redundant asset-copy steps.

## Findings requiring follow-up

| Priority | Finding and evidence | Required follow-up |
| --- | --- | --- |
| High | `lib/biometricAuth.js` stores credentials in browser localStorage and native Preferences as a fallback; `contexts/AuthContext.js` stages credential data in localStorage. | Replace password/token backups with a reviewed secure credential flow, migrate existing stored values, and test enroll/login/logout/reinstall/account-switch behavior on devices. Removing logs does not fix credential storage. |
| High | `lib/applovinPlugin.js` can fall back to simulated ads when the native plugin is unavailable or initialization fails. `hooks/useAppLovinAds.js` can deliver a fallback reward callback when backend completion fails. | Disable reward simulation in release flows and require authoritative backend/provider validation before crediting rewards. Confirm actual server behavior; this repository cannot establish whether client callbacks can credit real balances. |
| High | Android manifest enables backups and cleartext traffic. `network_security_config.xml` permits cleartext globally and names an old HTTP server. | Define required backup and network behavior, restrict release configuration, and test authentication/provider redirects. The old HTTP navigation entry was removed from Capacitor, but native network settings remain unchanged. |
| High | `lib/api.js` continues requests without an integrity token if token generation fails. Some services also issue direct fetch requests. | Verify server-side enforcement for withdrawals, purchases, reward claims, and account operations; test missing, invalid, expired, and replayed integrity tokens. Client checks are not an authorization boundary. |
| Medium | Seven React hook dependency warnings remain in `contexts/AuthContext.js`, `hooks/useAppLovinAds.js`, and `hooks/useVipStatus.js`. | Review effect/callback ownership and stabilize dependencies before changing arrays. Test app resume, account switching, SDK initialization, and subscription refresh to avoid repeated requests or stale state. Warnings are not hidden. |
| Medium | Some installed plugins declare Capacitor 8 peers while the application uses Capacitor 7. `.npmrc` relaxes peer resolution. | Align supported versions or document device-tested compatibility. A passing web build does not establish native compatibility. |
| Medium | SDK IDs, Firebase domains, API fallback URLs, Android deep links, and attribution environment selection remain in source. | Confirm these point to client-owned services. Public identifiers are not automatically secrets, but copying this repository does not transfer service ownership. |
| Medium | Package, Android, and on-screen version labels differ (`1.8.0`, `2.2.9`, and older UI labels). | Establish one release-version process and update all labels together. |
| Medium | There is no frontend test suite; Android tests are starter examples. Authentication and reward logic are large and tightly coupled. | Add focused regression coverage for critical flows and perform physical-device acceptance testing. Split large modules incrementally after behavior is covered. |

## Validation

- Locked dependencies installed with `npm ci`.
- ESLint: zero errors, seven existing hook dependency warnings after cleanup.
- Production static build: passed with placeholder Firebase/API configuration; 48 pages generated. This verifies compilation and export, not real authentication or backend availability.
- Handoff inventory: checked tracked working-tree paths for excluded artifacts and common private-key, secret-token, and JWT patterns. No matches in the cleaned tracked inventory.
- History scan: 202 reachable commits across refs, 1,819 selected text blobs; no matches for the limited private-key/token/JWT patterns. Binary files, large blobs, arbitrary credential formats, and unreachable objects were not covered.
- Shell script syntax and Git whitespace checks passed. The handoff checker passed synthetic clean-file, secret-token, private-key, log-file, and missing-file cases without printing credential values.
- No physical-device, Android release-signing, live payment, payout, ad, or backend enforcement tests were performed.

## Git transfer

Ignoring or deleting a tracked file does not remove it from old commits. Existing history still includes the removed logs, artifacts, configuration, and internal reference material.

A new initial commit containing the reviewed source is the recommended handoff if prior history is not required. If history must be preserved, review and sanitize it separately before pushing. Neither option has been applied automatically.

Do not copy the entire working directory: excluded local files were deliberately preserved. Prepare the transfer from a reviewed commit or a Git-controlled export after staging and inspecting the final diff. New review/check files must be included. Supply environment values, Firebase configuration, and signing credentials separately through the agreed secure channel.

Before the client push, rerun:

```sh
npm run lint
npm run check:handoff
npm run build
```

Review the target repository, branch, history choice, service ownership, and outstanding findings. No claim is made about authorship based on code style; the cleanup improves clarity and removes noise rather than concealing functional limitations or provenance notices.

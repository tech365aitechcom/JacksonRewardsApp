# Adjust Retention API — Backend Implementation Guide

## Overview

The frontend tracks Adjust retention milestones (Day 1, Day 3, Day 7, etc.) using the backend as the source of truth.
This ensures correct tracking across:
- Multiple accounts on the same device
- App uninstall + reinstall
- Device changes (new phone)

---

## Why Backend-Driven?

| Scenario | localStorage (old) | Backend (new) |
|---|---|---|
| User logs into different account | ❌ Wrong date (shared per device) | ✅ Correct (per user) |
| App uninstalled + reinstalled | ❌ Date lost, Day 1 re-fires | ✅ Date preserved per user |
| User gets new phone | ❌ Date lost | ✅ Date preserved |
| User skips Day 7, opens Day 8 | ❌ Day 7 milestone missed | ✅ Fires on Day 8 (>= logic) |

---

## Endpoints Required

### 1. `GET /v2/adjust/retention`

**Purpose:** Get (or create) the user's Adjust retention record.
On first call for a user, the backend creates the record with `firstOpenDate = now`.
Returns how many days since first open and which milestones have already been fired.

**Auth:** `Authorization: Bearer <token>` (required)

**Response — First ever call for this user:**
```json
{
  "success": true,
  "data": {
    "isFirstOpen": true,
    "firstOpenDate": "2026-03-24T10:00:00.000Z",
    "daysSinceFirstOpen": 0,
    "firedMilestones": []
  }
}
```

**Response — Subsequent calls:**
```json
{
  "success": true,
  "data": {
    "isFirstOpen": false,
    "firstOpenDate": "2026-03-17T10:00:00.000Z",
    "daysSinceFirstOpen": 7,
    "firedMilestones": [1, 3]
  }
}
```

**Field Descriptions:**

| Field | Type | Description |
|---|---|---|
| `isFirstOpen` | boolean | `true` only on the very first call for this user. Used to fire the Adjust install event. |
| `firstOpenDate` | ISO string | Timestamp of user's first ever app open. Set once, never updated. |
| `daysSinceFirstOpen` | number | `Math.floor((now - firstOpenDate) / 86400000)` — calculated server-side |
| `firedMilestones` | number[] | Array of day numbers already recorded (e.g. `[1, 3, 7]`). Frontend won't re-fire these. |

**Backend Logic:**
```
1. Get userId from JWT token
2. Find AdjustRetention record for this userId
3. If NOT found:
   - Create record: { userId, firstOpenDate: now, firedMilestones: [] }
   - Return { isFirstOpen: true, daysSinceFirstOpen: 0, firedMilestones: [] }
4. If found:
   - Calculate daysSinceFirstOpen = floor((now - firstOpenDate) / 86400000)
   - Return { isFirstOpen: false, firstOpenDate, daysSinceFirstOpen, firedMilestones }
```

---

### 2. `POST /v2/adjust/retention/milestone`

**Purpose:** Record that a specific retention day milestone has been fired for this user.
Frontend calls this immediately after firing the Adjust event for that day.

**Auth:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "day": 7
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `day` | number | ✅ | The retention day milestone. Must be one of: `1, 3, 7, 14, 21, 31, 40, 60, 90` |

**Response:**
```json
{
  "success": true,
  "data": {
    "day": 7,
    "recorded": true
  }
}
```

**Response if already recorded (idempotent — no error):**
```json
{
  "success": true,
  "data": {
    "day": 7,
    "recorded": false,
    "message": "Milestone already recorded"
  }
}
```

**Backend Logic:**
```
1. Get userId from JWT token
2. Validate: day must be in [1, 3, 7, 14, 21, 31, 40, 60, 90]
3. Find AdjustRetention record for this userId
4. If day NOT already in firedMilestones:
   - Add day to firedMilestones array
   - Save record
   - Return { recorded: true }
5. If day already in firedMilestones:
   - Return { recorded: false, message: "Milestone already recorded" }
```

---

## Database Schema

### Table/Collection: `adjust_retentions`

```
userId          String   (unique, FK to users)
firstOpenDate   DateTime (set once on first GET /retention call, never updated)
firedMilestones Int[]    (array of day numbers, e.g. [1, 3, 7])
createdAt       DateTime
updatedAt       DateTime
```

**SQL (PostgreSQL):**
```sql
CREATE TABLE adjust_retentions (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL UNIQUE REFERENCES users(id),
  first_open_date  TIMESTAMP NOT NULL DEFAULT NOW(),
  fired_milestones INTEGER[] NOT NULL DEFAULT '{}',
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**MongoDB:**
```javascript
{
  userId:          ObjectId,   // unique index
  firstOpenDate:   Date,       // set once, never updated
  firedMilestones: [Number],   // e.g. [1, 3, 7]
  createdAt:       Date,
  updatedAt:       Date
}
```

---

## Full Flow Diagram

```
User opens app
      │
      ▼
AdjustInitializer.jsx
      │
      ├─ GET /v2/adjust/events     → fetch dynamic event tokens (existing)
      │
      └─ GET /v2/adjust/retention  → get user's retention record
            │
            ├─ isFirstOpen: true   → fire "App install" event (once ever)
            │
            ├─ Always              → fire "App session start" event
            │
            └─ For each day in [1,3,7,14,21,31,40,60,90]:
                  if daysSinceFirstOpen >= day
                  AND day NOT in firedMilestones:
                     → fire "App open on Day X" event
                     → POST /v2/adjust/retention/milestone { day: X }
                          → backend records it (won't fire again)
```

---

## Error Handling

- If `GET /v2/adjust/retention` fails (network error, 5xx) → frontend falls back to localStorage-based tracking automatically. No user impact.
- If `POST /v2/adjust/retention/milestone` fails → milestone may re-fire next app open. This is acceptable (Adjust deduplicates by event token + device).
- Both endpoints must return errors in the standard format: `{ "success": false, "message": "..." }`

---

## Valid Milestone Days

Frontend only sends these values for the `day` field. Backend should validate against this list:

```
[1, 3, 7, 14, 21, 31, 40, 60, 90]
```

---

## Notes for Backend Developer

1. `firstOpenDate` is set **once** on the first call to `GET /v2/adjust/retention`. Never update it, even on reinstall. This is the permanent "install date" for this user.
2. The `isFirstOpen` flag must be `true` **only on the very first call** — use a boolean flag or check if `firedMilestones` is empty AND the record was just created in the same request.
3. `daysSinceFirstOpen` must be calculated **server-side** (not sent by client) to prevent spoofing.
4. Both endpoints require a valid JWT. Return `401` if token is missing or expired.
5. `POST /v2/adjust/retention/milestone` must be **idempotent** — calling it twice with the same day should not error, just return `recorded: false`.

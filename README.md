# Baby Shower Digital Invitation

A complete digital baby shower invitation built with Next.js, Framer Motion, and Google Sheets as the backend.

## Google Sheets Setup

Create a Google Spreadsheet with **three tabs** using this exact schema:

### Tab: `Sheet1` (Event Metadata)

| A2 | B2 | C2 | D2 | E2 | F2 |
|---|---|---|---|---|---|
| ParentA_Name | ParentB_Name | Baby_Name | Event_Date (YYYY-MM-DD) | Event_Time (HH:MM) | Maps_URL |

Example row:
```
María | Carlos | Sofía | 2024-08-12 | 14:00 | https://maps.google.com/?q=...
```

### Tab: `Gifts`

Columns (row 1 = headers, data starts row 2):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| ID | Title | Description | Status | ClaimedBy_Name | ClaimedBy_Phone | ClaimedBy_Email | Timestamp |

- **ID**: unique string, e.g. `gift-001`
- **Status**: `Available` or `Claimed`
- Columns E–H are filled automatically when a guest claims a gift.

### Tab: `RSVPs`

Columns (row 1 = headers, data starts row 2):

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Name | Phone | Email | Attendance | GiftID | Timestamp | RowIndex |

- **Attendance**: `Attending` or `Not Attending`
- Filled automatically on RSVP submission.

---

## Google Cloud Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Sheets API** under *APIs & Services → Library*
4. Go to *APIs & Services → Credentials → Create Credentials → Service Account*
5. Give it any name, click **Done**
6. Click the service account email → **Keys** tab → **Add Key → JSON**
7. Download the JSON key file
8. Share your Google Spreadsheet with the service account email (give **Editor** access)

---

## Environment Variables

Fill in `.env.local`:

```
GOOGLE_SHEET_ID=          # The ID from the spreadsheet URL: /d/<ID>/edit
GOOGLE_SERVICE_ACCOUNT_EMAIL=    # service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Copy the `private_key` field from the downloaded JSON exactly — keep the `\n` escape sequences as-is.

---

## Audio & Photo Assets

Replace the placeholder files:

| File | Description |
|---|---|
| `public/audio/track1.mp3` | Background music during browsing |
| `public/audio/track2.mp3` | Celebration music after RSVP confirmation |
| `public/images/parents.jpg` | Photo of the parents (square crop recommended) |

---

## Running Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set the three environment variables in the Vercel dashboard under *Settings → Environment Variables* before deploying to production.

For production deployment:
```bash
vercel --prod
```

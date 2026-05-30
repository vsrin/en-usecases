# Access Control — ElevateNow Insights

This document covers how gated pages work, how to grant or revoke access, and how to add new gated content.

---

## How It Works

Certain pages on `insights.elevatenow.tech` are access-controlled — Evidence Lab studies and select demoboards. The rest of the site is public.

Each gated page embeds an email-verification gate:
1. Visitor sees a lock screen with an email input
2. They enter their email → the gate calls the ElevateNow backend API
3. If the email has an active grant in MongoDB, the page unlocks
4. The email is saved to `localStorage` — subsequent visits on the same browser unlock automatically

**No token URLs, no login accounts, no passwords.** Just an email grant in the database.

---

## Granting or Revoking Access

Use the CLI script. Run with **no arguments** for interactive prompts:

```bash
cd /Users/vsrin/appdev/elevatenow-usecases
python scripts/manage_access.py
```

The script will ask:
1. Command → `grant`, `revoke`, `list`, or `seed`
2. Then prompts for each required field one by one

### Direct commands (if you prefer)

```bash
# Grant
python scripts/manage_access.py grant <email> <artifact> [first] [last] [org]

# Revoke
python scripts/manage_access.py revoke <email> <artifact>

# List all grants
python scripts/manage_access.py list

# List grants for one artifact
python scripts/manage_access.py list semantic-hub
```

### Valid artifacts

| Artifact | Page |
|----------|------|
| `ocr-benchmark` | Evidence Lab → OCR & Extraction Benchmark Framework |
| `six-tier-stack` | Evidence Lab → Six-Tier Extraction Stack Architecture |
| `extraction-benchmark` | Evidence Lab → The Extraction Intelligence Benchmark |
| `semantic-hub` | Demoboards → AI-Ready Insurance Intelligence |

### After granting

No deploy needed. The grant is live in MongoDB instantly.

Tell the contact: *"Go to the page and enter your email address."*

---

## What Lives Where

| Component | Location |
|-----------|----------|
| CLI admin script | `scripts/manage_access.py` |
| Gate logic (HTML) | Top `<script>` block in each gated page |
| Grant storage | MongoDB `insights_access.access_grants` (Artifi cluster) |
| Validate API | `GET https://en-workspace-backend.enowclear360.com/api/access/validate` |
| Backend route | `elevatenow-workbench-backend/src/routes/access.ts` |

---

## Current Grantees

| Email | Artifacts |
|-------|-----------|
| vinod.srinivasan@elevatenow.tech | ocr-benchmark, six-tier-stack, extraction-benchmark |
| naveena.spitz@afgroup.com | semantic-hub |
| kumar@elevatenow.tech | semantic-hub |

---

## Adding a New Gated Page

1. Copy the gate `<script>` block from any existing gated page into the new page's `<head>`
2. Change `var PAPER='<new-artifact-slug>'` to your new slug
3. Copy the `#el-gate` lock screen HTML into the page body (before `#el-protected`)
4. Add the new slug to `ARTIFACTS` list in `scripts/manage_access.py`
5. Push the new HTML to deploy
6. Grant yourself: `python scripts/manage_access.py grant <your-email> <new-slug>`
7. Test in an incognito window, then grant others

The gate CSS blocks are in each HTML file — search for `#el-gate` to find and adjust styling if needed.

---

## Technical Notes

- **LocalStorage key:** `el_email_<artifact>` (e.g., `el_email_ocr-benchmark`)
- **Fail behavior:** If the backend API is unreachable, users with a cached email (stored in localStorage) are **let through** — don't block already-validated users due to network errors
- **Re-validation:** Every page load re-checks the stored email against the API — revoking access takes effect on the user's next page load
- **CORS:** The validate endpoint explicitly allows `https://insights.elevatenow.tech`

---

## Revoking All Access (Nuclear Option)

```bash
# Revoke one person from everything
python scripts/manage_access.py revoke <email> ocr-benchmark
python scripts/manage_access.py revoke <email> six-tier-stack
python scripts/manage_access.py revoke <email> extraction-benchmark
python scripts/manage_access.py revoke <email> semantic-hub
```

Or update MongoDB directly to set `active: false` for all records matching the email.

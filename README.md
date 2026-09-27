# PH Phone Launch Tracker

Daily crawler that checks Philippine mobile sites + Indonesia/Malaysia variant news,
detects new phone launches, and emails you a digest via Gmail.

## How it works

```
GitHub Actions (daily 8AM PHT)  OR  Vercel Cron (daily)
        |
        v
src/index.js
  1. Fetch RSS from ~14 PH/MY/ID tech sites
  2. HTML fallback scrape for brand newsrooms
  3. Keyword filter: launch / unveiled / price in PH / new variant / etc.
  4. Compare against state/last_seen.json (dedupe)
  5. Send HTML email via Gmail SMTP
  6. Update state file (commit back in Actions)
```

## Quick start (GitHub Actions — recommended, 100% free)

### 1. Push this repo to GitHub

### 2. Create a Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
   (requires 2-Step Verification ON)
2. Create app → name `phone-tracker` → copy the 16-char password
   (looks like `abcd efgh ijkl mnop` — enter without spaces)

### 3. Add GitHub Secrets
Repo → Settings → Secrets and variables → Actions → New secret:

| Secret | Value |
|--------|-------|
| `GMAIL_USER` | your gmail, e.g. `you@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-char app password |
| `NOTIFY_EMAIL` | where to send digest (can be same gmail) |

### 4. Done
Workflow `.github/workflows/daily.yml` runs daily at `00:00 UTC = 08:00 PHT`.
Run manually anytime: Actions tab → `Daily phone launch crawl` → Run workflow.
To test email immediately, set secret `SEND_EMPTY_EMAIL=true` once, or trigger with input `send_empty: true`.

## Vercel alternative

1. `vercel import` this repo
2. Add same 3 env vars in Vercel dashboard
3. `vercel.json` already defines a daily cron hitting `/api/cron`
4. NOTE: Vercel serverless has no persistent disk — state uses:
   - `state/last_seen.json` in repo (read-only on Vercel), plus
   - optional Vercel KV if you set `KV_REST_API_URL` / `KV_REST_API_TOKEN`.
   - Without KV, Vercel mode sends everything matching last 48h (may repeat). GitHub Actions is recommended for exact dedupe.

## Add / remove sites

Edit `src/config.js` → `SOURCES` array. Each entry:

```js
{ name: "YugaTech", country: "PH", type: "rss", url: "https://www.yugatech.com/feed/" },
{ name: "Samsung PH Newsroom", country: "PH", type: "html", url: "https://.../", linkSelector: "a" },
```

## Keyword tuning

Edit `src/config.js` → `LAUNCH_KEYWORDS`, `VARIANT_KEYWORDS`, `BRANDS`, `EXCLUDE_KEYWORDS`.

## Local run

```bash
npm install
cp .env.example .env   # fill in gmail creds
npm start
# dry run (no email, just console):
DRY_RUN=true npm start
```

## Files

- `src/config.js` — sites + keywords
- `src/crawler.js` — RSS + HTML fetch
- `src/filter.js` — launch/variant classifier
- `src/state.js` — dedupe state load/save
- `src/mailer.js` — Gmail sender
- `src/index.js` — orchestrator
- `api/cron.js` — Vercel cron handler
- `state/last_seen.json` — seen URLs (auto-updated)

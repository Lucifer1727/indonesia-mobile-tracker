import { crawlAll } from "./crawler.js";
import { filterLaunches } from "./filter.js";
import { loadState, saveState } from "./state.js";
import { sendDigest } from "./mailer.js";
import { DEFAULT_MAX_AGE_HOURS } from "./config.js";

export async function runDaily(options = {}) {
  const maxAgeHours = Number(process.env.MAX_AGE_HOURS || DEFAULT_MAX_AGE_HOURS);
  console.log(`Crawling feeds (max age ${maxAgeHours}h)...`);

  const { articles, errors } = await crawlAll();
  console.log(`Fetched ${articles.length} articles, ${errors.length} feed errors.`);
  if (errors.length) console.log("Feed errors:", errors.join(" | "));

  const { seenUrls } = await loadState();
  const fresh = filterLaunches(articles, seenUrls, maxAgeHours);
  console.log(`Detected ${fresh.length} new launch/variant items.`);

  // Mark ALL fetched URLs as seen so next run only reports truly new ones.
  // Saved BEFORE sending email so a mail failure doesn't cause repeat alerts.
  for (const a of articles) if (a.link) seenUrls.add(a.link);

  if (process.env.DRY_RUN === "true") {
    console.log("[DRY_RUN] state NOT saved (re-run without DRY_RUN for real).");
  } else {
    await saveState(seenUrls);
  }

  const shouldSend =
    fresh.length > 0 || process.env.SEND_EMPTY_EMAIL === "true" || options.sendEmpty === true;

  let mailInfo = null;
  if (shouldSend) {
    mailInfo = await sendDigest({
      items: fresh,
      errors,
      meta: { sourcesChecked: new Set(articles.map((a) => a.source)).size, totalFetched: articles.length },
    });
    console.log("Email result:", mailInfo && mailInfo.messageId ? mailInfo.messageId : mailInfo);
  } else {
    console.log("No new items — skipping email (set SEND_EMPTY_EMAIL=true to force).");
  }

  return { totalFetched: articles.length, fresh, errors, mailInfo };
}

// Run directly: `node src/index.js`
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("index.js")) {
  runDaily()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error("FATAL:", e);
      process.exit(1);
    });
}

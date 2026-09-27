import { LAUNCH_KEYWORDS, VARIANT_KEYWORDS, BRANDS, EXCLUDE_KEYWORDS, DEFAULT_MAX_AGE_HOURS } from "./config.js";

const lc = (s) => (s || "").toLowerCase();

function containsAny(haystack, words) {
  return words.filter((w) => haystack.includes(lc(w)));
}

function articleAgeHours(pubDate) {
  if (!pubDate) return 0; // unknown age → treat as fresh (RSS usually recent anyway)
  const t = new Date(pubDate).getTime();
  if (Number.isNaN(t)) return 0;
  return (Date.now() - t) / 36e5;
}

/**
 * Classify one article. Returns null if not relevant, else { kind, matched }.
 * kind: "NEW_LAUNCH" | "VARIANT" | "LAUNCH_NEWS"
 */
export function classify(article, maxAgeHours = DEFAULT_MAX_AGE_HOURS) {
  const text = `${article.title} ${article.snippet}`;
  const hay = lc(text);

  if (containsAny(hay, EXCLUDE_KEYWORDS).length > 0) return null;
  if (containsAny(hay, BRANDS).length === 0) return null;

  const age = articleAgeHours(article.pubDate);
  if (age > maxAgeHours) return null;

  const launchHits = containsAny(hay, LAUNCH_KEYWORDS);
  const variantHits = containsAny(hay, VARIANT_KEYWORDS);
  if (launchHits.length === 0) return null;

  const isVariant = variantHits.length > 0;
  const isIDMY = /indonesia|malaysia|\bmy\b|\bid\b|kuala lumpur|jakarta/.test(hay);
  const kind = isVariant ? "VARIANT" : isIDMY ? "LAUNCH_NEWS" : "NEW_LAUNCH";
  return { kind, matched: [...launchHits, ...variantHits].slice(0, 5), ageHours: Math.round(age) };
}

export function filterLaunches(articles, seenUrls, maxAgeHours) {
  const out = [];
  for (const a of articles) {
    if (!a.link || seenUrls.has(a.link)) continue;
    const c = classify(a, maxAgeHours);
    if (c) out.push({ ...a, ...c });
  }
  // newest first
  out.sort((x, y) => new Date(y.pubDate || 0) - new Date(x.pubDate || 0));
  return out;
}

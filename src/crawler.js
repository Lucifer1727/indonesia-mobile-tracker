import { SOURCES } from "./config.js";
import Parser from "rss-parser";
import * as cheerio from "cheerio";

const parser = new Parser({
  timeout: 20000,
  headers: { "User-Agent": "PH-PhoneLaunch-Tracker/1.0 (+github-actions)" },
});

async function fetchRss(source) {
  const feed = await parser.parseURL(source.url);
  return (feed.items || []).map((it) => ({
    source: source.name,
    country: source.country,
    title: (it.title || "").trim(),
    link: (it.link || "").trim(),
    pubDate: it.isoDate || it.pubDate || null,
    snippet: ((it.contentSnippet || it.content || it.summary || "") + "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500),
  }));
}

async function fetchHtml(source) {
  const res = await fetch(source.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const out = [];
  const selector = source.linkSelector || "article a, h2 a, h3 a";
  $(selector).each((_, el) => {
    const a = $(el);
    const title = a.text().replace(/\s+/g, " ").trim();
    let href = a.attr("href") || "";
    if (!title || !href) return;
    if (href.startsWith("/")) href = new URL(href, source.url).href;
    if (!href.startsWith("http")) return;
    if (title.length < 15) return;
    out.push({
      source: source.name,
      country: source.country,
      title,
      link: href,
      pubDate: null,
      snippet: "",
    });
  });
  // dedupe by link
  const seen = new Set();
  return out.filter((x) => (seen.has(x.link) ? false : (seen.add(x.link), true))).slice(0, 40);
}

export async function crawlAll() {
  const results = await Promise.allSettled(
    SOURCES.map((s) => (s.type === "rss" ? fetchRss(s) : fetchHtml(s)))
  );
  const articles = [];
  const errors = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") articles.push(...r.value);
    else errors.push(`${SOURCES[i].name}: ${(r.reason && r.reason.message) || r.reason}`);
  });
  return { articles, errors };
}

import { runDaily } from "../src/index.js";

export default async function handler(req, res) {
  // Optional protection: set CRON_SECRET env and call /api/cron?secret=xxx
  if (process.env.CRON_SECRET) {
    const url = new URL(req.url || "/", "http://x");
    if (url.searchParams.get("secret") !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }
  try {
    const result = await runDaily();
    return res.status(200).json({
      ok: true,
      totalFetched: result.totalFetched,
      newItems: result.fresh.length,
      errors: result.errors,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e && e.message || e) });
  }
}

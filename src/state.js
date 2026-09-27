import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const STATE_PATH = path.join(process.cwd(), "state", "last_seen.json");

export async function loadState() {
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    const j = JSON.parse(raw);
    return {
      seenUrls: new Set(j.seenUrls || []),
      lastRun: j.lastRun || null,
    };
  } catch {
    return { seenUrls: new Set(), lastRun: null };
  }
}

export async function saveState(seenUrls, extra = {}) {
  // Keep state file bounded (last 2000 URLs)
  const arr = [...seenUrls].slice(-2000);
  await mkdir(path.dirname(STATE_PATH), { recursive: true });
  await writeFile(
    STATE_PATH,
    JSON.stringify({ lastRun: new Date().toISOString(), seenUrls: arr, ...extra }, null, 2)
  );
  return STATE_PATH;
}

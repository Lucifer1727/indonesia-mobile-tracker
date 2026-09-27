import nodemailer from "nodemailer";

function transporter() {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER / GMAIL_APP_PASSWORD env vars. See README + .env.example.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const KIND_LABEL = {
  NEW_LAUNCH: "🚀 New launch (PH)",
  VARIANT: "🎨 New variant",
  LAUNCH_NEWS: "🌏 ID/MY launch news",
};

function esc(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildHtml(items, errors, meta) {
  const rows = items
    .map(
      (a) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee">
        <div style="font-size:12px;color:#888">${esc(a.source)} · ${esc(a.country)} · ${(KIND_LABEL[a.kind] || a.kind)}</div>
        <div style="font-size:15px;font-weight:bold;margin:4px 0">
          <a href="${esc(a.link)}">${esc(a.title)}</a>
        </div>
        <div style="font-size:13px;color:#444">${esc(a.snippet || "")}</div>
        <div style="font-size:12px;color:#888;margin-top:4px">Matched: ${esc((a.matched || []).join(", "))} · ${esc(a.pubDate || "date unknown")}</div>
      </td>
    </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;max-width:640px">
    <h2>📱 Daily Phone Launch Digest — ${esc(meta.date)}</h2>
    <p>${items.length} new item(s) from ${meta.sourcesChecked} sources. ${meta.totalFetched} articles scanned.</p>
    ${items.length === 0 ? "<p><b>No new launches detected today.</b></p>" : `<table style="width:100%;border-collapse:collapse">${rows}</table>`}
    ${errors.length ? `<p style="color:#999;font-size:12px">Some feeds failed: ${esc(errors.join(" | "))}</p>` : ""}
  </div>`;
}

export async function sendDigest({ items, errors, meta }) {
  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  const date = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });
  const subject =
    items.length === 0
      ? `📱 No new phone launches — ${date}`
      : `📱 ${items.length} new phone launch${items.length > 1 ? "es" : ""} — ${date}`;

  if (process.env.DRY_RUN === "true") {
    console.log("[DRY_RUN] would send to", to, "subject:", subject);
    console.log(JSON.stringify(items, null, 2));
    return { dryRun: true };
  }

  const html = buildHtml(items, errors, { ...meta, date });
  const t = transporter();
  const info = await t.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
    text: items.map((a) => `• [${a.kind}] ${a.title} — ${a.link}`).join("\n") || "No new launches.",
  });
  return info;
}

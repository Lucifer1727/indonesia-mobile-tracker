// Central config: sources + keyword lists.
// Edit this file to add/remove sites or tune detection.

export const SOURCES = [
  // ---------- Philippines ----------
  { name: "YugaTech", country: "PH", type: "rss", url: "https://www.yugatech.com/feed/" },
  { name: "Unbox.ph", country: "PH", type: "rss", url: "https://unbox.ph/feed/" },
  { name: "JamOnline.ph", country: "PH", type: "rss", url: "https://jamonline.ph/feed/" },
  { name: "Gizguide", country: "PH", type: "rss", url: "https://www.gizguide.com/feeds/posts/default" },
  { name: "PinoyMetroGeek", country: "PH", type: "html", url: "https://pinoymetrogeek.com/" },
  { name: "ManilaShaker", country: "PH", type: "rss", url: "https://manilashaker.com/feed/" },
  { name: "NoypiGeeks", country: "PH", type: "rss", url: "https://www.noypigeeks.com/feed/" },
  { name: "TechPinas", country: "PH", type: "rss", url: "https://www.techpinas.com/feeds/posts/default" },
  { name: "Revu Philippines", country: "PH", type: "rss", url: "https://revu.com.ph/feed/" },
  { name: "GSMArena", country: "GLOBAL", type: "html", url: "https://www.gsmarena.com/news.php3", linkSelector: "div.news-item a, h3 a, .news-item a" },

  // ---------- Malaysia ----------
  { name: "SoyaCincau", country: "MY", type: "rss", url: "https://soyacincau.com/feed" },
  { name: "Lowyat.NET", country: "MY", type: "rss", url: "https://www.lowyat.net/feed/" },
  { name: "SoyaCincau BM (MY)", country: "MY", type: "rss", url: "https://bm.soyacincau.com/feed" },

  // ---------- Indonesia ----------
  { name: "JagatReview", country: "ID", type: "rss", url: "https://www.jagatreview.com/feed/" },
  { name: "DroidLime (ID)", country: "ID", type: "rss", url: "https://droidlime.com/feed/" },
  { name: "Selular.id (ID)", country: "ID", type: "rss", url: "https://selular.id/feed/" },

  // ---------- Official brand PH sites (HTML scrape, best-effort) ----------
  { name: "Samsung PH Newsroom", country: "PH", type: "html", url: "https://news.samsung.com/ph/" },
  { name: "OPPO PH", country: "PH", type: "html", url: "https://www.oppo.com/ph/" },
  { name: "vivo PH", country: "PH", type: "html", url: "https://www.vivo.com/ph/" },
  { name: "realme PH", country: "PH", type: "html", url: "https://www.realme.com/ph/" },
  { name: "HONOR PH", country: "PH", type: "html", url: "https://www.honor.com/ph/" },
  { name: "Xiaomi PH", country: "PH", type: "html", url: "https://www.mi.com/ph/" },
  { name: "TECNO PH", country: "PH", type: "html", url: "https://www.tecno-mobile.com/ph/" },
  { name: "Infinix PH", country: "PH", type: "html", url: "https://ph.infinixmobility.com/" },
  { name: "OnePlus PH", country: "PH", type: "html", url: "https://www.oneplus.com/ph" },
  { name: "Apple PH", country: "PH", type: "html", url: "https://www.apple.com/ph/" },
];

// Words that strongly suggest a NEW launch / announcement.
export const LAUNCH_KEYWORDS = [
  "launched", "launch", "launches", "unveiled", "unveils", "debut", "debuts",
  "introduces", "announced", "announces", "now official", "officially",
  "arrives in the philippines", "now in the philippines", "available in the philippines",
  "price in the philippines", "philippines price", "local pricing", "now available",
  "goes on sale", "open for pre-order", "pre-order", "preorder",
  "diluncurkan", "resmi diluncurkan", "hadir di indonesia",   // ID
  "dilancarkan", "kini di malaysia",                          // MY
];

// Words that suggest a new VARIANT (color / storage / 5G / Pro / Ultra etc.)
export const VARIANT_KEYWORDS = [
  "variant", "new color", "new colour", "storage variant", "ram variant",
  "12gb", "16gb", "512gb", "1tb", "pro+", "ultra", "plus 5g",
  "special edition", "limited edition", "varian baru", "warna baru",
];

// Known phone brands — article must mention at least one (title+snippet)
// to avoid random "launch" news (e.g. satellite launch).
export const BRANDS = [
  "samsung", "galaxy", "apple", "iphone", "xiaomi", "redmi", "poco",
  "realme", "oppo", "vivo", "iqoo", "honor", "infinix", "tecno", "itel",
  "oneplus", "nothing phone", "motorola", "moto ", "nokia", "hmd",
  "huawei", "zte", "nubia", "asus", "rog phone", "sony", "xperia",
  "google pixel", "pixel ", "lenovo", "meizu", "lava", "itel",
];

// Exclude obvious non-phone news even if keyword matches.
export const EXCLUDE_KEYWORDS = [
  "satellite", "spacex", "rocket", "shuttle", "app launch", "play store launch",
  "windows launch", "game launch", "laptop launch",
  "smartwatch launch", "earbuds launch", "tv launch", "tablet launch",
  // standalone product-type words (catch "unveiled" laptop/controller stories)
  "laptop", "notebook", "chromebook", "googlebook", "xbook",
  "controller", "station dock", "gamepad", "console",
  "accessor", "charger", "power bank", "speaker", "headphone", "earbuds",
  "smartwatch", "watch gt", "watch d", "sound gear",
  "tablet", "matepad", "ipad", "dehumidifier", "electric vehicle", "ev3",
  "mpv", "suv coupe", "pickleball",
];

// Only consider articles newer than this (hours). Overridden by MAX_AGE_HOURS env.
export const DEFAULT_MAX_AGE_HOURS = 48;

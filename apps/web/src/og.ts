// The pictures X and others show under a link to the site (og:image): one 1200×630 PNG per page and language,
// written when the site is built (pages/og/[...slug].png.ts). The SVG is put together here and made a PNG with resvg,
// from the fonts on the machine that builds it, as the ranking's card is (ranking-server/src/card.ts in the ranking server's source).
import { Resvg } from "@resvg/resvg-js";
// The wordmark as the banner draws it (docs/images/banner.png), cut out with the dark ground made transparent, glow and all
import wordmarkPng from "./assets/og-wordmark.png?inline";
import type { Guide } from "./i18n/guide";
import { guide } from "./i18n/guide";
import { guideConfig } from "./i18n/guide-config";
import { guideEnvironment } from "./i18n/guide-environment";
import { guideMore } from "./i18n/guide-more";
import { guidePlugins } from "./i18n/guide-plugins";
import { guideRankingServer } from "./i18n/guide-ranking-server";
import { guideSkills } from "./i18n/guide-skills";
import { guidePrompts } from "./i18n/guide-prompts";
import { philosophy } from "./i18n/philosophy";
import { installs, strings, type Lang } from "./i18n/strings";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** What one page's card says */
export type OgCard = {
  /** Small line above the heading, e.g. "Guide" */
  kicker: string;
  heading: string;
  lede: string;
  /** The site's tagline: set small under the wordmark, in the banner's monospace, not as a page heading */
  tagline?: boolean;
  /** A command set in a terminal-like box under the heading (the top page's curl install line) */
  command?: string;
};

/** A page's card, by its slug under og/: "en/index", "ja/guide/config", … */
export const ogCards: Record<string, OgCard> = {};

const guides: [string, Record<Lang, Guide>][] = [
  ["guide/environment", guideEnvironment],
  ["guide", guide],
  ["guide/more", guideMore],
  ["guide/config", guideConfig],
  ["guide/plugins", guidePlugins],
  ["guide/skills", guideSkills],
  ["guide/prompts", guidePrompts],
  ["guide/ranking-server", guideRankingServer],
];
const curlLine = installs.find((i) => i.id === "curl")!.lines[0];
for (const lang of ["en", "ja"] as const) {
  const t = strings[lang];
  ogCards[`${lang}/index`] = { kicker: "", heading: t.title.replace(/^beatcode\s*—\s*/, ""), lede: t.description, tagline: true, command: curlLine };
  for (const [path, g] of guides) {
    ogCards[`${lang}/${path}`] = { kicker: lang === "ja" ? "ガイド" : "Guide", heading: g[lang].heading, lede: g[lang].description };
  }
  ogCards[`${lang}/philosophy`] = { kicker: "", heading: philosophy[lang].heading, lede: philosophy[lang].description };
}

/** The og/ slug of a page, from its language and its path under the language root ("" or "guide/config/") */
export function ogSlug(lang: string, path: string): string {
  return `${lang}/${path.replace(/\/$/, "") || "index"}`;
}

// The site's tokens (styles/tokens.css) in sRGB: resvg doesn't read oklch
const C = {
  paper: "#060b18",
  rule: "#2b3342",
  ink: "#e9eff6",
  ink2: "#bdc5cf",
  muted: "#9199a5",
  accent: "#40e2f3",
  lanes: ["#f79a3d", "#4fd8f0", "#f2559e", "#58e06c"],
  eq: ["#64eff7", "#53cdff", "#53a0ff", "#7370fa", "#b671f9", "#e04dea"],
};
// Unquoted, as card.ts does: resvg on Linux passed over Noto Sans CJK for Noto Serif CJK with the names in quotes
const FONT = "Hiragino Sans, Noto Sans CJK JP, Noto Sans JP, Yu Gothic, sans-serif";
const MONO = "JetBrains Mono, SF Mono, Menlo, DejaVu Sans Mono, monospace";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const WIDE = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦\u{20000}-\u{3fffd}]/u;

/** About how wide text is, in ems, erring wide: wide (CJK, fullwidth) characters 1, capitals 0.72, the rest 0.6 */
function emsOf(s: string): number {
  let w = 0;
  for (const ch of s) w += WIDE.test(ch) ? 1 : /[A-Z]/.test(ch) ? 0.72 : 0.6;
  return w;
}

/** text broken into at most max lines of width at size: at spaces, or anywhere in CJK; the last line cut with … */
export function wrap(text: string, size: number, width: number, max: number): string[] {
  const words = text.replaceAll(" ", " ").match(/[^\s⺀-꓏＀-｠]+\s*|[⺀-꓏＀-｠]\s*|\s+/gu) ?? [];
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    // 、。・ and closing brackets stay at the end of the line before, even if it runs a little long
    const tail = /^[、。・，．」』）)\]！？!?:：;；]/u.test(w);
    if (line && !tail && emsOf((line + w).trimEnd()) * size > width) {
      lines.push(line.trimEnd());
      line = w.trimStart();
    } else {
      line += w;
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  let last = kept[max - 1]!;
  while (last && emsOf(last + "…") * size > width) last = [...last].slice(0, -1).join("");
  kept[max - 1] = last.replace(/[\s、。,.]+$/u, "") + "…";
  return kept;
}

/** The four lanes: tokens falling to the judgement line, the last ones lit as they're hit */
function highway(x: number, w: number, top: number, bottom: number): string {
  const lane = w / 4;
  const judge = bottom - 62;
  // KW / ID / OP / LIT, top to bottom; the last of each sits on the line
  const notes = [
    ["fn", "let", "match"],
    ["x", "score", "data"],
    ["=>", "{", "->"],
    ["42", "\"hi\"", "true"],
  ];
  // The falling notes share what's above the line: two rows, the odd lanes a little lower
  const gap = (judge - 24 - (top + 30) - 48 - 36) / 2;
  const parts: string[] = [];
  parts.push(`<rect x="${x}" y="${top}" width="${w}" height="${bottom - top}" rx="14" fill="#0a1222" stroke="${C.rule}" stroke-width="2"/>`);
  // The judgement line goes under the notes, so the ones sitting on it hide it
  const line = `<rect x="${x + 6}" y="${judge - 1}" width="${w - 12}" height="3" fill="${C.ink}"/>`;
  notes.forEach((col, i) => {
    const color = C.lanes[i]!;
    const lx = x + lane * i;
    if (i > 0) parts.push(`<rect x="${lx}" y="${top + 2}" width="1" height="${bottom - top - 4}" fill="${C.rule}"/>`);
    parts.push(
      `<rect x="${lx + 1}" y="${top + 2}" width="${lane - 2}" height="${judge - top}" fill="url(#lane${i})"/>`,
      `<rect x="${lx + 16}" y="${bottom - 34}" width="${lane - 32}" height="14" rx="3" fill="none" stroke="${color}" stroke-width="2"/>`,
    );
    col.forEach((tok, j) => {
      const hit = j === col.length - 1;
      const ny = hit ? judge - 24 : top + 30 + j * gap + (i % 2) * 36;
      const nw = Math.min(lane - 16, Math.max(64, [...tok].length * 13.2 + 24));
      const nx = lx + (lane - nw) / 2;
      if (hit) parts.push(`<circle cx="${lx + lane / 2}" cy="${judge}" r="${lane * 0.42}" fill="url(#burst${i})"/>`);
      if (hit && i === 0) parts.push(line);
      parts.push(
        `<rect x="${nx}" y="${ny}" width="${nw}" height="48" rx="8" fill="#0a1222" stroke="${color}" stroke-width="${hit ? 3 : 2}"/>`,
        `<text x="${nx + nw / 2}" y="${ny + 31}" font-family="${MONO}" font-size="22" font-weight="700" text-anchor="middle" fill="${color}">${esc(tok)}</text>`,
      );
    });
  });
  return parts.join("");
}

/** Faint notes drifting down either side, so the wide card isn't empty where a square crop cuts it off */
function drift(x: number, w: number, side: 0 | 1): string {
  const toks = side === 0 ? [["if", 0], ["for", 1], ["return", 0], ["self", 1], ["+=", 3], ["0", 3]] : [["impl", 0], ["}", 2], ["None", 3], ["vec", 1], ["::", 2], ["'a'", 3]];
  const parts: string[] = [];
  toks.forEach(([tok, lane], k) => {
    const t = tok as string;
    const color = C.lanes[lane as number]!;
    const nw = Math.max(64, [...t].length * 13.2 + 24);
    const col = k % 2;
    const nx = x + (col === 0 ? 24 : w - nw - 24) + (side === 0 ? 0 : 0);
    const ny = 70 + k * 86 + col * 22;
    const o = (0.16 + 0.1 * ((k + side) % 3)).toFixed(2);
    parts.push(
      `<g opacity="${o}"><rect x="${nx}" y="${ny}" width="${nw}" height="48" rx="8" fill="none" stroke="${color}" stroke-width="2"/>` +
        `<text x="${nx + nw / 2}" y="${ny + 31}" font-family="${MONO}" font-size="22" font-weight="700" text-anchor="middle" fill="${color}">${esc(t)}</text></g>`,
    );
  });
  return parts.join("");
}

/** The card's SVG. Everything that matters sits in the middle 630×630 (wordmark, heading, the note highway), since Slack and
 * others show only a square cut from the middle; the sides carry faint drifting notes for the wide previews (X, Discord) */
export function ogSvg(card: OgCard): string {
  const W = OG_WIDTH;
  const H = OG_HEIGHT;
  const side = (W - H) / 2;
  const inner = H - 2 * 40;
  const cx = W / 2;
  const parts: string[] = [];

  const defs = [
    `<radialGradient id="bloom" cx="0.5" cy="0.1" r="0.6"><stop offset="0" stop-color="${C.accent}" stop-opacity="0.14"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>`,
    ...C.lanes.map(
      (c, i) =>
        `<linearGradient id="lane${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity="0.18"/></linearGradient>` +
        `<radialGradient id="burst${i}"><stop offset="0" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`,
    ),
  ];
  parts.push(`<defs>${defs.join("")}</defs>`);
  parts.push(`<rect width="${W}" height="${H}" fill="${C.paper}"/><rect width="${W}" height="${H}" fill="url(#bloom)"/>`);
  parts.push(drift(0, side, 0), drift(W - side, side, 1));

  // The wordmark, centred
  const wmW = 480;
  const wmH = Math.round((wmW * 198) / 935);
  parts.push(`<image x="${cx - wmW / 2}" y="26" width="${wmW}" height="${wmH}" href="${wordmarkPng}"/>`);
  let y = 26 + wmH + 8;

  // Under it: the site's tagline in the banner's monospace with its cursor, or a page's kicker and heading
  if (card.tagline) {
    const mono = /^[\x20-\x7e]*$/.test(card.heading);
    const size = 24;
    const text = mono ? `${card.heading}.` : card.heading;
    const [line] = wrap(text, size, inner, 1);
    y += size;
    parts.push(`<text x="${cx}" y="${y}"${mono ? ` font-family="${MONO}"` : ""} font-size="${size}" font-weight="500" text-anchor="middle" fill="${C.ink}">${esc(line!)}<tspan fill="${C.accent}">\u00a0_</tspan></text>`);
    y += 22;
  } else {
    const head = card.kicker ? `${card.kicker} · ${card.heading}` : card.heading;
    const size = emsOf(head) * 34 <= inner ? 34 : 28;
    const lines = wrap(head, size, inner, 2);
    for (const line of lines) {
      y += size;
      const k = card.kicker && line.startsWith(card.kicker) ? card.kicker : "";
      const body = k ? `<tspan fill="${C.accent}">${esc(k)}</tspan>${esc(line.slice(k.length))}` : esc(line);
      parts.push(`<text x="${cx}" y="${y}" font-size="${size}" font-weight="700" text-anchor="middle" fill="${C.ink}">${body}</text>`);
      y += 8;
    }
    y += 16;
  }

  // The command in a box like a terminal line, as on the GitHub social preview (scripts/social-preview.mjs)
  if (card.command) {
    const size = 17;
    const text = `$\u00a0${card.command}`;
    const boxW = [...text].length * size * 0.6 + 40;
    parts.push(
      `<rect x="${cx - boxW / 2}" y="${y}" width="${boxW}" height="46" rx="10" fill="#0a1222" stroke="${C.rule}" stroke-width="2"/>`,
      `<text x="${cx - boxW / 2 + 20}" y="${y + 29}" font-family="${MONO}" font-size="${size}" fill="${C.ink}"><tspan fill="${C.accent}">$</tspan>${esc(text.slice(1))}</text>`,
    );
    y += 46 + 18;
  }

  // The highway fills the rest of the middle square
  const hwW = 470;
  parts.push(highway(cx - hwW / 2, hwW, y, H - 24));

  // The equalizer's steps along the bottom edge, as on the site and the ranking's cards
  const step = W / C.eq.length;
  C.eq.forEach((c, i) => parts.push(`<rect x="${i * step}" y="${H - 10}" width="${step + 1}" height="10" fill="${c}"/>`));

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">` +
    parts.join("") +
    `</svg>`
  );
}

/** The SVG as a PNG, with the fonts of the machine that builds the site */
export function ogPng(svg: string): Uint8Array {
  return new Resvg(svg, { font: { loadSystemFonts: true }, fitTo: { mode: "original" } }).render().asPng();
}

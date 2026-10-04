// The pictures X and others show under a link to the site (og:image): one 1200×630 PNG per page and language,
// written when the site is built (pages/og/[...slug].png.ts). The SVG is put together here and made a PNG with resvg,
// from the fonts on the machine that builds it, as the ranking's card is (beatcode-private-tools' ranking-server/src/card.ts).
import { Resvg } from "@resvg/resvg-js";
import type { Guide } from "./i18n/guide";
import { guide } from "./i18n/guide";
import { guideConfig } from "./i18n/guide-config";
import { guideEnvironment } from "./i18n/guide-environment";
import { guideMore } from "./i18n/guide-more";
import { guidePlugins } from "./i18n/guide-plugins";
import { guideRankingServer } from "./i18n/guide-ranking-server";
import { philosophy } from "./i18n/philosophy";
import { strings, type Lang } from "./i18n/strings";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** What one page's card says */
export type OgCard = {
  /** Small line above the heading, e.g. "Guide" */
  kicker: string;
  heading: string;
  lede: string;
};

/** A page's card, by its slug under og/: "en/index", "ja/guide/config", … */
export const ogCards: Record<string, OgCard> = {};

const guides: [string, Record<Lang, Guide>][] = [
  ["guide/environment", guideEnvironment],
  ["guide", guide],
  ["guide/more", guideMore],
  ["guide/config", guideConfig],
  ["guide/plugins", guidePlugins],
  ["guide/ranking-server", guideRankingServer],
];
for (const lang of ["en", "ja"] as const) {
  const t = strings[lang];
  ogCards[`${lang}/index`] = { kicker: "", heading: t.title.replace(/^beatcode\s*—\s*/, ""), lede: t.description };
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
const PAD = 72;

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

// The beatcode wordmark on its pixel grid (components/Wordmark.astro): 11 rows, "#" a filled pixel
const glyphs: Record<string, string[]> = {
  b: ["##.....", "##.....", "##.....", "######.", "#######", "##...##", "##...##", "##...##", "##...##", "#######", "######."],
  e: [".......", ".......", ".......", ".#####.", "#######", "##...##", "#######", "#######", "##.....", "#######", ".######"],
  a: [".......", ".......", ".......", "######.", "#######", ".....##", ".######", "#######", "##...##", "#######", ".######"],
  t: ["......", ".##...", ".##...", "######", "######", ".##...", ".##...", ".##...", ".##...", ".#####", "..####"],
  c: [".......", ".......", ".......", ".######", "#######", "##.....", "##.....", "##.....", "##.....", "#######", ".######"],
  o: [".......", ".......", ".......", ".#####.", "#######", "##...##", "##...##", "##...##", "##...##", "#######", ".#####."],
  d: [".....##", ".....##", ".....##", ".######", "#######", "##...##", "##...##", "##...##", "##...##", "#######", ".######"],
};

/** The wordmark at (x, y), px per pixel; returns the markup and how wide it came out */
function wordmark(x: number, y: number, px: number): { svg: string; width: number } {
  let col = 0;
  const rects: string[] = [];
  for (const [word, fill] of [["beat", C.ink], ["code", C.accent]] as const) {
    for (const ch of word) {
      const rows = glyphs[ch]!;
      rows.forEach((row, ry) => {
        for (const m of row.matchAll(/#+/g)) {
          rects.push(`<rect x="${x + (col + m.index!) * px}" y="${y + ry * px}" width="${m[0].length * px}" height="${px}" fill="${fill}"/>`);
        }
      });
      col += rows[0]!.length + 1;
    }
  }
  return { svg: `<g shape-rendering="crispEdges">${rects.join("")}</g>`, width: (col - 1) * px };
}

/** The four lanes on the right: tokens falling to the judgement line, the last ones lit as they're hit */
function highway(x: number, w: number, top: number, bottom: number): string {
  const lane = w / 4;
  const judge = bottom - 70;
  // KW / ID / OP / LIT, top to bottom; the last of each sits on the line
  const notes = [
    ["fn", "let", "match"],
    ["x", "score", "data"],
    ["=>", "{", "->"],
    ["42", "\"hi\"", "true"],
  ];
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
      `<rect x="${lx + 16}" y="${bottom - 40}" width="${lane - 32}" height="16" rx="3" fill="none" stroke="${color}" stroke-width="2"/>`,
    );
    col.forEach((tok, j) => {
      const hit = j === col.length - 1;
      const ny = hit ? judge - 24 : top + 46 + j * 96 + (i % 2) * 40;
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

/** The card's SVG: the wordmark, the page's heading and lede on the left, the note highway on the right */
export function ogSvg(card: OgCard): string {
  const W = OG_WIDTH;
  const H = OG_HEIGHT;
  const hwW = 440;
  const hwX = W - PAD - hwW + 24;
  const textW = hwX - PAD - 56;
  const parts: string[] = [];

  const defs = [
    `<radialGradient id="bloom" cx="0.15" cy="0.05" r="0.75"><stop offset="0" stop-color="${C.accent}" stop-opacity="0.14"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient>`,
    ...C.lanes.map(
      (c, i) =>
        `<linearGradient id="lane${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity="0.18"/></linearGradient>` +
        `<radialGradient id="burst${i}"><stop offset="0" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`,
    ),
  ];
  parts.push(`<defs>${defs.join("")}</defs>`);
  parts.push(`<rect width="${W}" height="${H}" fill="${C.paper}"/><rect width="${W}" height="${H}" fill="url(#bloom)"/>`);

  // The wordmark, then the kicker, the heading (up to 2 lines) and the lede (up to 4 lines)
  const mark = wordmark(PAD, PAD - 4, 6);
  parts.push(mark.svg);
  let y = PAD + 66 + 70;
  if (card.kicker) {
    parts.push(`<text x="${PAD}" y="${y}" font-size="28" font-weight="700" letter-spacing="2" fill="${C.accent}">${esc(card.kicker)}</text>`);
    y += 70;
  }
  const headSize = emsOf(card.heading) * 64 <= textW ? 64 : 52;
  for (const line of wrap(card.heading, headSize, textW, 2)) {
    parts.push(`<text x="${PAD}" y="${y}" font-size="${headSize}" font-weight="700" fill="${C.ink}">${esc(line)}</text>`);
    y += headSize + 14;
  }
  y += 18;
  const ledeLines = Math.max(1, Math.min(4, Math.floor((H - 70 - y) / 42)));
  for (const line of wrap(card.lede, 28, textW, ledeLines)) {
    parts.push(`<text x="${PAD}" y="${y}" font-size="28" fill="${C.muted}">${esc(line)}</text>`);
    y += 42;
  }

  parts.push(highway(hwX, hwW, PAD - 12, H - 52));

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

// The GitHub social preview of yukihirop/beatcode (repo Settings → Social preview; GitHub has no API to upload it).
// The link cards' look (og.ts: the wordmark, monospace, the four note lanes, the colour bar) with the curl install line.
// Everything that matters sits inside GitHub's repo card template's 80px border.
// Run: pnpm --filter @beatcode/web social-preview  →  docs/images/social-preview.png
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";

const here = new URL(".", import.meta.url);
const WM = "data:image/png;base64," + fs.readFileSync(new URL("../src/assets/og-wordmark.png", here)).toString("base64");
const OUT = new URL("../../../docs/images/social-preview.png", here);
const W = 1280, H = 640;
const C = { paper: "#060b18", rule: "#2b3342", ink: "#e9eff6", ink2: "#bdc5cf", muted: "#9199a5", accent: "#40e2f3",
  lanes: ["#f79a3d", "#4fd8f0", "#f2559e", "#58e06c"], eq: ["#64eff7", "#53cdff", "#53a0ff", "#7370fa", "#b671f9", "#e04dea"] };
const MONO = "JetBrains Mono, SF Mono, Menlo, monospace";
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

function highway(x, w, top, bottom) {
  const lane = w / 4, judge = bottom - 62;
  const notes = [["fn","let","match"],["x","id","data"],["=>","{","->"],["42","\"a\"","true"]];
  const gap = (judge - 24 - (top + 30) - 48 - 36) / 2;
  const p = [`<rect x="${x}" y="${top}" width="${w}" height="${bottom-top}" rx="14" fill="#0a1222" stroke="${C.rule}" stroke-width="2"/>`];
  const line = `<rect x="${x+6}" y="${judge-1}" width="${w-12}" height="3" fill="${C.ink}"/>`;
  notes.forEach((col, i) => {
    const color = C.lanes[i], lx = x + lane * i;
    if (i > 0) p.push(`<rect x="${lx}" y="${top+2}" width="1" height="${bottom-top-4}" fill="${C.rule}"/>`);
    p.push(`<rect x="${lx+1}" y="${top+2}" width="${lane-2}" height="${judge-top}" fill="url(#lane${i})"/>`,
      `<rect x="${lx+14}" y="${bottom-34}" width="${lane-28}" height="14" rx="3" fill="none" stroke="${color}" stroke-width="2"/>`);
    col.forEach((tok, j) => {
      const hit = j === col.length - 1;
      const ny = hit ? judge - 24 : top + 30 + j * gap + (i % 2) * 36;
      const nw = Math.min(lane - 12, Math.max(56, tok.length * 12 + 22));
      const nx = lx + (lane - nw) / 2;
      if (hit) p.push(`<circle cx="${lx+lane/2}" cy="${judge}" r="${lane*0.42}" fill="url(#burst${i})"/>`);
      if (hit && i === 0) p.push(line);
      p.push(`<rect x="${nx}" y="${ny}" width="${nw}" height="48" rx="8" fill="#0a1222" stroke="${color}" stroke-width="${hit?3:2}"/>`,
        `<text x="${nx+nw/2}" y="${ny+31}" font-family="${MONO}" font-size="20" font-weight="700" text-anchor="middle" fill="${color}">${esc(tok)}</text>`);
    });
  });
  return p.join("");
}

const defs = [`<radialGradient id="bloom" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stop-color="#0f2a3d" stop-opacity="0.6"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient>`];
C.lanes.forEach((c, i) => defs.push(
  `<linearGradient id="lane${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="${c}" stop-opacity="0.13"/></linearGradient>`,
  `<radialGradient id="burst${i}"><stop offset="0" stop-color="${c}" stop-opacity="0.35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`));

// Left: the wordmark, the tagline, the languages and the curl line. Right: the note lanes
const L = 112;
const TAGLINE = "Play your code as a rhythm game.";
// The wordmark is sized so the tagline (and its cursor) ends at the middle of the last "e": in og-wordmark.png (935×198)
// the "b" starts at x=21 and the last "e" spans 803–898. Monospace advances are 0.6em
const tagSize = 28;
const tagEnd = L + (TAGLINE.length + 2) * tagSize * 0.6;
const wmScale = (tagEnd - L) / ((803 + 898) / 2 - 21);
const wmW = 935 * wmScale, wmH = 198 * wmScale, wmX = L - 21 * wmScale, wmY = 100;
const cmd = "curl -fsSL https://beatcode.run/install.sh | sh";
const cmdSize = 20, cw = cmdSize * 0.6, boxW = 24 + (cmd.length + 2) * cw + 24;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${defs.join("")}</defs>
<rect width="${W}" height="${H}" fill="${C.paper}"/><rect width="${W}" height="${H}" fill="url(#bloom)"/>
<image x="${wmX}" y="${wmY}" width="${wmW}" height="${wmH}" href="${WM}"/>
<text x="${L}" y="${wmY + wmH + 42}" font-family="${MONO}" font-size="${tagSize}" fill="${C.ink}">${TAGLINE}<tspan fill="${C.accent}"> _</tspan></text>
<text x="${L}" y="${wmY + wmH + 82}" font-family="${MONO}" font-size="18" fill="${C.muted}">Rust · Python · Go · TypeScript · Ruby · PHP</text>
<rect x="${L}" y="388" width="${boxW}" height="64" rx="10" fill="#0a1222" stroke="${C.rule}" stroke-width="2"/>
<text x="${L + 24}" y="427" font-family="${MONO}" font-size="${cmdSize}" fill="${C.ink}"><tspan fill="${C.accent}">$</tspan> ${esc(cmd)}</text>
${highway(860, 324, 92, 548)}
${C.eq.map((c, i) => `<rect x="${i*W/6}" y="${H-10}" width="${W/6+1}" height="10" fill="${c}"/>`).join("")}
</svg>`;
fs.writeFileSync(OUT, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());

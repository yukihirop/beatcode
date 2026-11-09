// The header (banner) image of the beatcode account on X (1500×500, X's recommended size).
// The link cards' look (social-preview.mjs: the wordmark, monospace, the colour bar) stacked in the middle:
// the wordmark, the tagline under it, and the curl install line.
// X covers the bottom left with the profile photo and crops the top and bottom on narrow screens, so everything
// sits in the middle.
// Run: pnpm --filter @beatcode/web x-banner  →  docs/images/x-banner.png
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";

const here = new URL(".", import.meta.url);
const WM = "data:image/png;base64," + fs.readFileSync(new URL("../src/assets/og-wordmark.png", here)).toString("base64");
const OUT = new URL("../../../docs/images/x-banner.png", here);
const W = 1500, H = 500;
const C = { paper: "#060b18", rule: "#2b3342", ink: "#e9eff6", muted: "#9199a5", accent: "#40e2f3",
  eq: ["#64eff7", "#53cdff", "#53a0ff", "#7370fa", "#b671f9", "#e04dea"] };
const MONO = "JetBrains Mono, SF Mono, Menlo, monospace";
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const TAGLINE = "Play your code as a rhythm game.";
const cmd = "curl -fsSL https://beatcode.run/install.sh | sh";
// og-wordmark.png is 935×198; the letters run from x=21 to x=898
const wmW = 600, wmScale = wmW / 935, wmH = 198 * wmScale;
const wmX = W / 2 - ((21 + 898) / 2) * wmScale;
const tagSize = 24, cmdSize = 20, cw = cmdSize * 0.6;
const boxW = 24 + (cmd.length + 2) * cw + 24, boxH = 56;
// Vertical stack: wordmark, 34px, tagline, 40px, curl box, centred in the band above the colour bar
const tagGap = 34, boxGap = 40;
const stackH = wmH + tagGap + boxGap + boxH;
const top = (H - 10 - stackH) / 2;
const tagY = top + wmH + tagGap;
const boxY = tagY + boxGap - 6;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><radialGradient id="bloom" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#0f2a3d" stop-opacity="0.7"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="${C.paper}"/><rect width="${W}" height="${H}" fill="url(#bloom)"/>
<image x="${wmX}" y="${top}" width="${wmW}" height="${wmH}" href="${WM}"/>
<text x="${W / 2}" y="${tagY}" font-family="${MONO}" font-size="${tagSize}" text-anchor="middle" fill="${C.ink}">${TAGLINE}<tspan fill="${C.accent}">&#160;_</tspan></text>
<rect x="${(W - boxW) / 2}" y="${boxY}" width="${boxW}" height="${boxH}" rx="10" fill="#0a1222" stroke="${C.rule}" stroke-width="2"/>
<text x="${(W - boxW) / 2 + 24}" y="${boxY + boxH / 2 + 7}" font-family="${MONO}" font-size="${cmdSize}" fill="${C.ink}"><tspan fill="${C.accent}">$</tspan> ${esc(cmd)}</text>
${C.eq.map((c, i) => `<rect x="${i*W/6}" y="${H-10}" width="${W/6+1}" height="10" fill="${c}"/>`).join("")}
</svg>`;
fs.writeFileSync(OUT, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());

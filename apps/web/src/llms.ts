import type { Guide } from "./i18n/guide";
import { guide } from "./i18n/guide";
import { guideConfig } from "./i18n/guide-config";
import { guideMore } from "./i18n/guide-more";
import { guidePlugins } from "./i18n/guide-plugins";
import { guideRankingServer } from "./i18n/guide-ranking-server";
import { philosophy } from "./i18n/philosophy";
import { installs, strings, type Lang } from "./i18n/strings";

// /llms.txt and /llms-full.txt (https://llmstxt.org/), made from the same data as the pages, in English.
// llms.txt is the index; llms-full.txt is the top page, every guide and the philosophy written out in one file.

type Page = { path: string; g: Record<Lang, Guide> };

/** The guide pages in the header's order */
const pages: Page[] = [
  { path: "guide/", g: guide },
  { path: "guide/more/", g: guideMore },
  { path: "guide/config/", g: guideConfig },
  { path: "guide/plugins/", g: guidePlugins },
  { path: "guide/ranking-server/", g: guideRankingServer },
];

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
const t = strings.en;
const plain = (s: string) => s.replaceAll("\u00a0", " ");

function head(): string[] {
  return [`# beatcode`, "", `> ${t.description}`, "", t.footer.license.join(" "), ""];
}

function install(): string[] {
  const out = ["## Install", ""];
  for (const i of installs) out.push(`${i.label}:`, "", "```sh", ...i.lines, "```", "");
  out.push(t.hero.npmNote, t.hero.platforms, "");
  return out;
}

export function llmsTxt(): string {
  const out = head();
  out.push(...install());
  out.push("## Guides", "");
  for (const p of pages) out.push(`- [${p.g.en.heading}](${base}${p.path}): ${p.g.en.description}`);
  out.push(`- [${philosophy.en.heading}](${base}philosophy/): ${philosophy.en.description}`);
  out.push("", "## Optional", "");
  out.push(`- [Everything in one file](${base}llms-full.txt): the top page and every guide above, written out`);
  out.push(`- [日本語のトップページ](${base}ja/): ${strings.ja.description}`);
  for (const p of pages) out.push(`- [${p.g.ja.heading}(日本語)](${base}ja/${p.path}): ${p.g.ja.description}`);
  out.push(`- [${philosophy.ja.heading}(日本語)](${base}ja/philosophy/): ${philosophy.ja.description}`);
  for (const l of t.footer.links) out.push(`- [${l.label}](${l.href})`);
  return out.join("\n") + "\n";
}

function table(head: string[], rows: string[][]): string[] {
  const cell = (s: string) => s.replaceAll("|", "\\|").replaceAll("\n", " ");
  return [`| ${head.map(cell).join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)];
}

function guideText(p: Page): string[] {
  const g = p.g.en;
  const out = [`## ${g.heading}`, "", `Source: ${base}${p.path}`, "", g.lede, ""];
  for (const s of g.steps) {
    out.push(`### ${s.title}`, "");
    for (const b of s.body) out.push(b, "");
    if (s.cmd) out.push("```sh", ...(Array.isArray(s.cmd) ? s.cmd : [s.cmd]), "```", "");
    if (s.out) out.push("```", ...s.out, "```", "");
    if (s.file) out.push(`${s.file.name}:`, "", "```", ...s.file.lines, "```", "");
    if (s.keys) out.push(`${g.keysLabel}:`, "", ...table(["Key", "What it does"], s.keys), "");
    if (s.table) out.push(...table(s.table.head, s.table.rows), "");
  }
  return out;
}

export function llmsFullTxt(): string {
  const out = head();
  out.push(`## ${plain(t.hero.title)}`, "", t.hero.lede, "");
  out.push(...install());
  out.push(`## ${t.lanes.heading}`, "", t.lanes.body, "", `Lanes: ${t.lanes.names.join(", ")}. ${t.lanes.comments}`, "");
  out.push(`## ${t.plays.heading}`, "");
  for (const r of t.plays.rows) out.push(`- ${r.label}: ${r.body}`);
  out.push("", `## ${t.start.heading}`, "", ...table(["Command", "What it does"], t.start.commands.map((c) => [c.cmd, c.does])), "");
  out.push(`${t.start.keysHeading}: ${t.start.keys} ${t.start.ime}`, "");
  out.push(`## ${t.runs.heading}`, "");
  for (const r of t.runs.rows) out.push(`- ${r.label}: ${r.body}`);
  out.push("");
  for (const p of pages) out.push(...guideText(p));
  const ph = philosophy.en;
  out.push(`## ${ph.heading}`, "", `Source: ${base}philosophy/`, "", ph.lede, "");
  for (const s of ph.sections) out.push(`### ${s.heading}`, "", ...s.body.flatMap((b) => [b, ""]));
  out.push(`### ${ph.principlesHeading}`, "", ...ph.principles.map((x) => `- ${x.label} ${x.body}`), "");
  return out.join("\n").replace(/\n+$/, "") + "\n";
}

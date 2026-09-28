#!/usr/bin/env node
// Runs the beatcode binary. On first run, downloads the binary for this machine from GitHub Releases
// (the version matching this package), checks its SHA-256, and keeps it under
// ~/.cache/beatcode/npm/<version>/ (or $XDG_CACHE_HOME/beatcode/npm/<version>/).
// No postinstall script: the download happens here, so it works with --ignore-scripts and pnpm.
"use strict";

const { spawnSync, execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { version } = require("../package.json");
const REPO = "yukihirop/beatcode";

function fail(message) {
  process.stderr.write(`beatcode (npm): ${message}\n`);
  process.exit(1);
}

function target() {
  const os = { darwin: "apple-darwin", linux: "unknown-linux-gnu" }[process.platform];
  if (!os) fail(`only macOS and Linux are supported (got ${process.platform})`);
  if (process.arch === "arm64") return `aarch64-${os}`;
  if (process.arch === "x64") return `x86_64-${os}`;
  fail(`unsupported CPU: ${process.arch}`);
}

function cacheDir() {
  const base = process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
  return path.join(base, "beatcode", "npm", version);
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function install(dir, bin) {
  const t = target();
  const base = process.env.BEATCODE_DOWNLOAD_URL || `https://github.com/${REPO}/releases/download/v${version}`;
  const archive = `beatcode-${t}.tar.gz`;
  process.stderr.write(`beatcode (npm): downloading ${archive} (v${version})\n`);
  const [data, sum] = await Promise.all([download(`${base}/${archive}`), download(`${base}/${archive}.sha256`)]);
  const expected = sum.toString("utf8").trim().split(/\s+/)[0];
  const actual = crypto.createHash("sha256").update(data).digest("hex");
  if (expected !== actual) throw new Error(`checksum mismatch (expected ${expected}, got ${actual})`);

  // Unpack into a temporary directory next to the final one, then rename, so a half-finished
  // download never looks installed.
  fs.mkdirSync(path.dirname(dir), { recursive: true });
  const tmp = fs.mkdtempSync(`${dir}.tmp-`);
  try {
    fs.writeFileSync(path.join(tmp, archive), data);
    execFileSync("tar", ["-xzf", archive], { cwd: tmp });
    fs.rmSync(path.join(tmp, archive));
    fs.chmodSync(path.join(tmp, "beatcode"), 0o755);
    try {
      fs.renameSync(tmp, dir);
    } catch (e) {
      // Another run finished first.
      if (!fs.existsSync(bin)) throw e;
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  } catch (e) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw e;
  }
}

async function main() {
  const dir = cacheDir();
  const bin = path.join(dir, "beatcode");
  if (!fs.existsSync(bin)) {
    try {
      await install(dir, bin);
    } catch (e) {
      fail(`could not install the binary: ${e.message}`);
    }
  }
  const r = spawnSync(bin, process.argv.slice(2), { stdio: "inherit" });
  if (r.error) fail(r.error.message);
  if (r.signal) process.kill(process.pid, r.signal);
  process.exit(r.status ?? 1);
}

main();

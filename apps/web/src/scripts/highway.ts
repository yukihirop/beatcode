import { buildNotes, type Note } from "./chart";

type Judge = "PERFECT" | "GREAT" | "GOOD" | "MISS";
type Mode = "auto" | "you";
type Phase = "idle" | "playing" | "result";

const KEYS = ["d", "f", "j", "k"];
const FALL = 1.5; // seconds a note is on screen before the judgment line
const WINDOWS: [Judge, number][] = [
  ["PERFECT", 0.05],
  ["GREAT", 0.1],
  ["GOOD", 0.15],
];
const MISS_AFTER = 0.15;

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function mountHighway(root: HTMLElement): void {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const ctx = canvas.getContext("2d")!;
  const modeEl = root.querySelector<HTMLElement>("[data-mode]")!;
  const result = root.querySelector<HTMLElement>("[data-result]")!;
  const startBtn = root.querySelector<HTMLButtonElement>("[data-start]")!;
  const replayBtn = root.querySelector<HTMLButtonElement>("[data-replay]")!;
  const live = root.querySelector<HTMLElement>("[data-live]")!;
  const codeTokens = Array.from(root.querySelectorAll<HTMLElement>("[data-note]"));
  const labels = { auto: root.dataset.auto!, you: root.dataset.you! };

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const colors = {
    paper: token("--color-paper-2"),
    rule: token("--color-rule"),
    ink: token("--color-ink"),
    muted: token("--color-muted"),
    lanes: [token("--lane-keyword"), token("--lane-ident"), token("--lane-op"), token("--lane-literal")],
  };
  const fonts = { mono: token("--font-mono"), display: token("--font-display") };

  const notes = buildNotes();
  const songEnd = notes[notes.length - 1].time + 1.2;

  let phase: Phase = "idle";
  let mode: Mode = "auto";
  let now = 0;
  let last = 0;
  let visible = false;
  let raf = 0;
  let states: (Judge | null)[] = [];
  let combo = 0;
  let maxCombo = 0;
  let counts: Record<Judge, number> = { PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 };
  let flashes: { lane: number; at: number }[] = [];
  let lastJudge: { judge: Judge; at: number } | null = null;

  let width = 0;
  let height = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function reset() {
    states = notes.map(() => null);
    combo = 0;
    maxCombo = 0;
    counts = { PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 };
    flashes = [];
    lastJudge = null;
    now = 0;
    setMode("auto");
    for (const el of codeTokens) el.dataset.state = "pending";
  }

  function setMode(next: Mode) {
    mode = next;
    modeEl.textContent = labels[next];
    modeEl.dataset.mode = next;
  }

  function judge(note: Note, j: Judge) {
    states[note.index] = j;
    counts[j] += 1;
    codeTokens[note.index].dataset.state = j === "MISS" ? "miss" : "hit";
    if (j === "MISS") {
      combo = 0;
    } else {
      combo += 1;
      maxCombo = Math.max(maxCombo, combo);
      flashes.push({ lane: note.lane, at: now });
    }
    lastJudge = { judge: j, at: now };
  }

  function start() {
    reset();
    phase = "playing";
    root.dataset.phase = phase;
    last = performance.now();
    loop();
  }

  function finish() {
    phase = "result";
    root.dataset.phase = phase;
    const total = notes.length;
    result.querySelector("[data-perfect]")!.textContent = String(counts.PERFECT);
    result.querySelector("[data-great]")!.textContent = String(counts.GREAT);
    result.querySelector("[data-good]")!.textContent = String(counts.GOOD);
    result.querySelector("[data-miss]")!.textContent = String(counts.MISS);
    result.querySelector("[data-max]")!.textContent = `${maxCombo} / ${total}`;
    result.querySelector("[data-who]")!.textContent = labels[mode];
    live.textContent = `${labels[mode]}: PERFECT ${counts.PERFECT}, GREAT ${counts.GREAT}, GOOD ${counts.GOOD}, MISS ${counts.MISS}`;
    draw();
  }

  function tick(t: number) {
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    if (visible) now += dt;

    for (const note of notes) {
      if (states[note.index]) continue;
      if (mode === "auto" && note.time <= now) judge(note, "PERFECT");
      else if (mode === "you" && now - note.time > MISS_AFTER) judge(note, "MISS");
    }
    if (now >= songEnd) {
      finish();
      return;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function loop() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function hit(lane: number) {
    if (phase !== "playing") return;
    if (mode === "auto") {
      // The visitor takes over: from here on, only their hits count.
      setMode("you");
      combo = 0;
      maxCombo = 0;
      counts = { PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 };
    }
    let best: Note | null = null;
    for (const note of notes) {
      if (states[note.index] || note.lane !== lane) continue;
      const delta = Math.abs(note.time - now);
      if (delta <= MISS_AFTER && (!best || delta < Math.abs(best.time - now))) best = note;
    }
    if (!best) return;
    const delta = Math.abs(best.time - now);
    const j = WINDOWS.find(([, w]) => delta <= w)?.[0] ?? "GOOD";
    judge(best, j);
  }

  function draw() {
    if (!width) return;
    const laneW = width / 4;
    const judgeY = height - 64;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, width, height);

    // Lanes: a faint wash of each lane's colour, hairline between them.
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = colors.lanes[i];
      ctx.fillRect(i * laneW, 0, laneW, judgeY);
      ctx.globalAlpha = 1;
      if (i > 0) {
        ctx.fillStyle = colors.rule;
        ctx.fillRect(Math.round(i * laneW), 0, 1, height);
      }
    }

    // Hit flashes rise out of the judgment line and fade.
    for (const f of flashes) {
      const age = now - f.at;
      if (age > 0.18) continue;
      ctx.globalAlpha = (1 - age / 0.18) * 0.55;
      ctx.fillStyle = colors.lanes[f.lane];
      const h = 90 * (1 - age / 0.18 / 2);
      ctx.fillRect(f.lane * laneW + 1, judgeY - h, laneW - 2, h);
    }
    ctx.globalAlpha = 1;
    flashes = flashes.filter((f) => now - f.at <= 0.18);

    // Judgment line and the key under each lane.
    ctx.fillStyle = colors.ink;
    ctx.fillRect(0, judgeY - 1, width, 2);
    ctx.font = `600 13px ${fonts.mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colors.lanes[i];
      ctx.fillRect(i * laneW + 10, judgeY + 10, laneW - 20, 4);
      ctx.fillStyle = colors.muted;
      ctx.fillText(KEYS[i].toUpperCase(), i * laneW + laneW / 2, judgeY + 36);
    }

    // Notes.
    const boxH = 28;
    for (const note of notes) {
      if (states[note.index]) continue;
      const ahead = note.time - now;
      if (ahead > FALL || ahead < -MISS_AFTER) continue;
      const y = judgeY - (ahead / FALL) * judgeY;
      const x = note.lane * laneW + 6;
      const w = laneW - 12;
      ctx.fillStyle = colors.paper;
      ctx.strokeStyle = colors.lanes[note.lane];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y - boxH / 2, w, boxH, 4);
      ctx.fill();
      ctx.stroke();
      let size = 14;
      ctx.font = `600 ${size}px ${fonts.mono}`;
      while (size > 9 && ctx.measureText(note.text).width > w - 10) {
        size -= 1;
        ctx.font = `600 ${size}px ${fonts.mono}`;
      }
      ctx.fillStyle = colors.lanes[note.lane];
      // Canvas text has no font-variant-ligatures, so "->" would turn into an arrow.
      // Draw multi-character text one glyph at a time instead.
      const glyphs = [...note.text];
      if (glyphs.length === 1) {
        ctx.fillText(note.text, x + w / 2, y + 1);
      } else {
        const widths = glyphs.map((g) => ctx.measureText(g).width);
        let gx = x + w / 2 - widths.reduce((a, b) => a + b, 0) / 2;
        ctx.textAlign = "left";
        glyphs.forEach((g, i) => {
          ctx.fillText(g, gx, y + 1);
          gx += widths[i];
        });
        ctx.textAlign = "center";
      }
    }

    // Judgement and combo, centred above the line.
    if (lastJudge && now - lastJudge.at < 0.5 && phase === "playing") {
      ctx.globalAlpha = 1 - (now - lastJudge.at) / 0.5;
      ctx.fillStyle = lastJudge.judge === "MISS" ? colors.muted : colors.ink;
      ctx.font = `700 ${Math.min(34, width / 9)}px ${fonts.display}`;
      ctx.fillText(lastJudge.judge, width / 2, judgeY * 0.42);
      ctx.globalAlpha = 1;
    }
    if (combo >= 2 && phase === "playing") {
      ctx.fillStyle = colors.ink;
      ctx.font = `700 ${Math.min(30, width / 10)}px ${fonts.display}`;
      ctx.fillText(`${combo} COMBO`, width / 2, judgeY * 0.42 + 40);
    }
  }

  // Input: D F J K while the demo is on screen, or a tap on a lane.
  document.addEventListener("keydown", (e) => {
    if (!visible || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, [contenteditable]")) return;
    const lane = KEYS.indexOf(e.key.toLowerCase());
    if (lane < 0 || phase !== "playing") return;
    e.preventDefault();
    hit(lane);
  });
  canvas.addEventListener("pointerdown", (e) => {
    const rect = canvas.getBoundingClientRect();
    hit(Math.min(3, Math.floor(((e.clientX - rect.left) / rect.width) * 4)));
  });

  startBtn.addEventListener("click", start);
  replayBtn.addEventListener("click", start);

  new ResizeObserver(resize).observe(canvas);

  let autoplayed = false;
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !autoplayed && !reduceMotion) {
        autoplayed = true;
        start();
      }
    },
    { threshold: 0.4 },
  ).observe(canvas);

  // Before anything plays: a still frame with notes mid-fall.
  reset();
  now = notes[3].time - 0.6;
  document.fonts.ready.then(resize);
}

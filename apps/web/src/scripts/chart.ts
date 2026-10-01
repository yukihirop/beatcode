// The demo song: one Rust function, written out as the notes that spell it.
// Lanes follow the game's four-lane split: 0 keyword · 1 identifier ·
// 2 operator · 3 literal. Strings are whitespace between notes.

export type Lane = 0 | 1 | 2 | 3;
export type Piece = string | [text: string, lane: Lane];

const K = 0, I = 1, O = 2, L = 3;

export const source: Piece[][] = [
  [["fn", K], " ", ["longest_run", I], ["(", O], ["hits", I], [":", O], " ", ["&", O], ["[", O], ["bool", I], ["]", O], [")", O], " ", ["->", O], " ", ["u32", I], " ", ["{", O]],
  ["    ", ["let", K], " ", ["mut", K], " ", ["best", I], " ", ["=", O], " ", ["0", L], [";", O]],
  ["    ", ["let", K], " ", ["mut", K], " ", ["run", I], " ", ["=", O], " ", ["0", L], [";", O]],
  ["    ", ["for", K], " ", ["&", O], ["hit", I], " ", ["in", K], " ", ["hits", I], " ", ["{", O]],
  ["        ", ["run", I], " ", ["=", O], " ", ["if", K], " ", ["hit", I], " ", ["{", O], " ", ["run", I], " ", ["+", O], " ", ["1", L], " ", ["}", O], " ", ["else", K], " ", ["{", O], " ", ["0", L], " ", ["}", O], [";", O]],
  ["        ", ["best", I], " ", ["=", O], " ", ["best", I], [".", O], ["max", I], ["(", O], ["run", I], [")", O], [";", O]],
  ["    ", ["}", O]],
  ["    ", ["best", I]],
  [["}", O]],
];

export type Note = {
  index: number;
  text: string;
  lane: Lane;
  time: number; // seconds from song start
};

const LEAD_IN = 1.8;
const STEP = 0.22; // an eighth note at ~136 BPM
const LINE_GAP = 0.22;

export function buildNotes(): Note[] {
  const notes: Note[] = [];
  let time = LEAD_IN;
  for (const line of source) {
    for (const piece of line) {
      if (typeof piece === "string") continue;
      notes.push({ index: notes.length, text: piece[0], lane: piece[1], time });
      time += STEP;
    }
    time += LINE_GAP;
  }
  return notes;
}

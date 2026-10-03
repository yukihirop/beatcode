import type { Lang } from "./strings";

// The philosophy page: how beatcode came about, and what it holds to.

export type Philosophy = {
  title: string;
  description: string;
  heading: string;
  lede: string;
  sections: { id: string; heading: string; body: string[] }[];
  principlesHeading: string;
  principles: { label: string; body: string }[];
};

export const philosophy: Record<Lang, Philosophy> = {
  en: {
    title: "Philosophy — beatcode",
    description: "Why beatcode exists: old code found while tidying a PC, and a habit of listening to Spotify in the terminal.",
    heading: "Philosophy",
    lede: "Giving sleeping code a beat again.",
    sections: [
      {
        id: "old-code",
        heading: "Code that had gone to sleep",
        body: [
          "Tidying the files on my PC, I kept finding code I had written long ago.",
          "Scripts I no longer ran, projects I had stopped halfway, functions I had once fought hard to get right. Reading them again, the way I thought back then and the habits I had were all still there. Too good to delete, yet with nowhere left to use them.",
          "Could this code be put to some use?",
        ],
      },
      {
        id: "terminal",
        heading: "Music in the terminal",
        body: [
          "The other half was an everyday habit.",
          "While I wrote code, Spotify played from a TUI in the terminal. The editor, git and the music all lived on the same black screen.",
          "Looking at that screen, the two came together.",
        ],
      },
      {
        id: "chart",
        heading: "Code as a chart",
        body: [
          "Keywords, identifiers, operators, literals: code already has a rhythm.",
          "Deep nesting turns into a flurry, a long string into a hold. Your old code falls toward the judgment line in time with a song you love, and you hit it. Clear a song, and you've written a function.",
          "That's how beatcode began.",
        ],
      },
    ],
    principlesHeading: "What it holds to",
    principles: [
      { label: "It stays in the terminal.", body: "You play without leaving the place you already work in." },
      { label: "Your own code is the chart.", body: "Not only the bundled songs: code from your local repos and gists can be played too." },
      {
        label: "Your code stays with you.",
        body: "Code in your local repos is turned into charts on your machine. Even when an AI writes a chart, none of your code is sent.",
      },
    ],
  },
  ja: {
    title: "フィロソフィー — beatcode",
    description: "beatcode が生まれたわけ。PC の整理で出てきた昔のコードと、ターミナルで Spotify を聴く毎日の習慣。",
    heading: "フィロソフィー",
    lede: "眠っているコードに、もう一度音を。",
    sections: [
      {
        id: "old-code",
        heading: "眠っているコード",
        body: [
          "PC のファイルを整理していて、昔の自分が書いたコードがたくさん出てきました。",
          "もう動かさないスクリプト、途中で止めたプロジェクト、そのときは必死に書いた関数。読み返すと、当時の考え方や癖がそのまま残っています。消すには惜しい。けれど、もう一度使う場面もない。",
          "このコードを、何かに生かせないか。",
        ],
      },
      {
        id: "terminal",
        heading: "ターミナルで、音楽を聴いていた",
        body: [
          "もう一つは、毎日の習慣です。",
          "コードを書くあいだ、ターミナルの TUI で Spotify を流していました。エディタも、git も、音楽も、みんな同じ黒い画面の中にある。",
          "その画面を眺めていて、二つがつながりました。",
        ],
      },
      {
        id: "chart",
        heading: "コードを、譜面にする",
        body: [
          "キーワード、識別子、演算子、リテラル。コードは、もともとリズムを持っています。",
          "深いネストは乱打になり、長い文字列は長押しになる。好きな曲に合わせて、昔の自分のコードが上から流れてきて、判定ラインで叩く。1 曲叩き切ると、関数が 1 つ書き上がる。",
          "beatcode は、そうして生まれました。",
        ],
      },
    ],
    principlesHeading: "大事にしていること",
    principles: [
      { label: "ターミナルの中で完結する。", body: "いつもの作業の場所から離れずに遊べる。" },
      { label: "自分のコードが譜面になる。", body: "同梱の曲だけでなく、手元の repo や gist のコードも叩ける。" },
      { label: "コードは外に出さない。", body: "手元の repo のコードは手元で譜面にする。AI に書いてもらうときも、手元のコードは送らない。" },
    ],
  },
};

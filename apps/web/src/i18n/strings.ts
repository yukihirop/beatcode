export type Lang = "en" | "ja";

type Row = { label: string; body: string };
type Command = { cmd: string; does: string };

export type Strings = {
  htmlLang: string;
  title: string;
  description: string;
  otherLang: { label: string; href: string };
  nav: { environment: string; guide: string; config: string; plugins: string; rankingServer: string; philosophy: string };
  github: string;
  /** The llms.txt menu at the end of the nav: each file can be downloaded or copied whole, to hand to an AI */
  llms: { label: string; download: string; copy: string; copied: string; failed: string; files: { file: string; note: string }[] };
  hero: {
    title: string;
    lede: string;
    installHeading: string;
    copy: string;
    copied: string;
    npmNote: string;
    platforms: string;
  };
  highway: {
    label: string;
    hint: string;
    auto: string;
    you: string;
    replay: string;
    play: string;
    codeLabel: string;
    result: string;
    maxCombo: string;
  };
  demo: {
    heading: string;
    body: string;
    play: string;
    label: string;
    caption: string;
  };
  lanes: {
    heading: string;
    body: string;
    names: [string, string, string, string];
    comments: string;
  };
  plays: {
    heading: string;
    rows: Row[];
  };
  start: {
    heading: string;
    commands: Command[];
    keysHeading: string;
    keys: string;
    ime: string;
    guide: string;
  };
  runs: {
    heading: string;
    rows: Row[];
  };
  footer: {
    /** One line each */
    license: string[];
    links: { label: string; href: string }[];
    copyright: string;
  };
};

const repo = "https://github.com/yukihirop/beatcode";

export const installs = [
  {
    id: "brew",
    label: "Homebrew",
    lines: [
      "brew tap yukihirop/beatcode https://github.com/yukihirop/beatcode",
      "brew install beatcode",
    ],
  },
  { id: "npm", label: "npm", lines: ["npx beatcode"] },
  {
    id: "curl",
    label: "curl",
    lines: ["curl -fsSL https://raw.githubusercontent.com/yukihirop/beatcode/main/install.sh | sh"],
  },
] as const;

export const strings: Record<Lang, Strings> = {
  en: {
    htmlLang: "en",
    title: "beatcode — Play your code as a rhythm game",
    description:
      "A rhythm game for the terminal. The notes are the tokens of real source code, and clearing a song types out a function.",
    otherLang: { label: "日本語", href: "ja/" },
    nav: { environment: "Requirements", guide: "Guide", config: "Settings", plugins: "Plugins", rankingServer: "Ranking server", philosophy: "Philosophy" },
    github: "GitHub",
    llms: {
      label: "llms.txt",
      download: "Download",
      copy: "Copy",
      copied: "Copied",
      failed: "Couldn’t copy",
      files: [
        { file: "llms.txt", note: "A short map of the site, for an AI" },
        { file: "llms-full.txt", note: "Every page in one file" },
      ],
    },
    hero: {
      title: "Play your\u00a0code.",
      lede: "A rhythm game for the terminal. The notes are the tokens of real source code — keywords, names, operators, literals — falling down their own lanes. Clear the song and you’ve typed out a function.",
      installHeading: "Install",
      copy: "Copy",
      copied: "Copied",
      npmNote: "Runs without installing. Node.js 18 or later.",
      platforms: "macOS 11+ · Linux x86_64 / arm64 (glibc 2.35+)",
    },
    highway: {
      label: "A playable demo: tokens of a Rust function fall down four lanes toward the judgment line.",
      hint: "Take over with D F J K, or tap a lane.",
      auto: "AUTO",
      you: "YOU",
      replay: "Play again",
      play: "Play the demo",
      codeLabel: "What you’ve typed",
      result: "Clear",
      maxCombo: "max combo",
    },
    demo: {
      heading: "The real thing, with the song.",
      body: "Thirty seconds of the last chorus of Heroes Tonight by Janji (feat. Johnning), played on a TypeScript chart shared as a gist. The code on the right lights up token by token as it’s hit.",
      play: "Play with sound",
      label: "Thirty seconds of beatcode with Heroes Tonight playing: tokens fall down four lanes and are hit on the judgment line while the combo climbs and the code on the right lights up.",
      caption: "Recorded with beatcode record through Spotify, from 2:38 to 3:08; the sound is the song file laid over the recording in time. A small bot that reads the screen did the hitting, so the score isn’t a person’s. Song: Janji - Heroes Tonight (feat. Johnning) [NCS Release]. Music provided by NoCopyrightSounds. Free Download/Stream: http://ncs.io/ht Watch: http://youtu.be/3nQNiWdeH2Q",
    },
    lanes: {
      heading: "Every token has a lane.",
      body: "beatcode reads the file, sorts each token by what it is, and drops it down that kind’s lane. Hit them in order and the function writes itself back out.",
      names: ["Keyword", "Identifier", "Operator", "Literal"],
      comments: "Comments never become notes.",
    },
    plays: {
      heading: "What you can play",
      rows: [
        {
          label: "Charts",
          body: "The bundled songs, the git repos on your machine, your own GitHub repos, or a chart an AI writes for you on the spot. Long files are cut into one chart per function.",
        },
        {
          label: "Languages",
          body: "Rust, Python, Go, TypeScript / JavaScript, Ruby and PHP. Plain .md / .txt in English or Japanese. C, C#, CSS, HTML, JSON, Shell, TOML, YAML, Zig and Chinese prose come as plugins.",
        },
        {
          label: "Music",
          body: "Your Spotify liked songs play inside beatcode. Tempo and note timing come from analysing the audio on your machine; nothing is sent anywhere. YouTube Music works too, through Pear Desktop.",
        },
        {
          label: "Difficulty",
          body: "4, 6 or 8 lanes — more lanes split tokens into finer kinds. NORMAL, or HARD: the same code packed into 16th notes, with chords and hold notes.",
        },
        {
          label: "History",
          body: "Every finished play is kept. Pick one to play the same song and chart again.",
        },
      ],
    },
    start: {
      heading: "Get started",
      commands: [
        { cmd: "beatcode", does: "Song select" },
        { cmd: "beatcode path/to/file.rs", does: "Play one file" },
        { cmd: "beatcode setup", does: "Connect Spotify, YouTube Music and AI" },
        { cmd: "beatcode skills", does: "Then run /beatcode-setup in Claude Code or Codex" },
        { cmd: "beatcode --help", does: "Every command" },
      ],
      keysHeading: "Keys",
      keys: "D F J K play the four lanes.",
      ime: "Switch your input method to plain ASCII before you play. With a Japanese IME on, the keys never reach the game.",
      guide: "Read the guide",
    },
    runs: {
      heading: "Where it runs",
      rows: [
        { label: "macOS", body: "11 or later, Apple silicon or Intel." },
        {
          label: "Linux",
          body: "x86_64 / arm64 with glibc 2.35 or later (Ubuntu 22.04, Debian 12 or newer). Sound needs ALSA, HTTPS needs OpenSSL 3. The front camera panel is macOS only.",
        },
      ],
    },
    footer: {
      license:
        ["beatcode is proprietary software.", "See LICENSE for the complete terms."],
      links: [
        { label: "GitHub", href: repo },
        { label: "Releases", href: `${repo}/releases` },
        { label: "LICENSE", href: `${repo}/blob/main/LICENSE` },
      ],
      copyright: "© 2026 yukihirop",
    },
  },
  ja: {
    htmlLang: "ja",
    title: "beatcode — コードを、音ゲーとして叩く。",
    description:
      "ターミナルで遊ぶ音ゲー。落ちてくるノーツは本物のソースコードのトークンで、1 曲叩き切ると関数が 1 つ書き上がります。",
    otherLang: { label: "English", href: "" },
    nav: { environment: "推奨環境", guide: "使い方", config: "設定", plugins: "プラグイン", rankingServer: "ランキングサーバー", philosophy: "フィロソフィー" },
    github: "GitHub",
    llms: {
      label: "llms.txt",
      download: "ダウンロード",
      copy: "コピー",
      copied: "コピーしました",
      failed: "コピーできませんでした",
      files: [
        { file: "llms.txt", note: "AI 向けのサイトの案内(短い版)" },
        { file: "llms-full.txt", note: "全ページを 1 つにまとめたもの" },
      ],
    },
    hero: {
      title: "コードを、音ゲーとして叩く。",
      lede: "beatcode はターミナルで遊ぶ音ゲーです。落ちてくるノーツは本物のソースコードのトークン。キーワード・識別子・演算子・リテラルが、それぞれの列を流れてきます。1 曲叩き切ると、関数が 1 つ書き上がります。",
      installHeading: "入れる",
      copy: "コピー",
      copied: "コピーしました",
      npmNote: "入れずにそのまま動きます。Node.js 18 以降。",
      platforms: "macOS 11 以降 · Linux x86_64 / arm64(glibc 2.35 以降)",
    },
    highway: {
      label: "遊べるデモ。Rust の関数のトークンが 4 つの列を判定ラインへ落ちてきます。",
      hint: "D F J K を押すか、列をタップすると交代します。",
      auto: "AUTO",
      you: "YOU",
      replay: "もう一度",
      play: "デモを遊ぶ",
      codeLabel: "叩いて書いたコード",
      result: "Clear",
      maxCombo: "最大コンボ",
    },
    demo: {
      heading: "本物の画面を、曲といっしょに。",
      body: "魔王魂の「シャイニングスター」(♩=158)の途中 30 秒を、同梱の Rust の譜面で遊んだところです。叩いたトークンが、右のコードで順に光っていきます。",
      play: "音つきで再生",
      label: "シャイニングスターを流しながら beatcode を遊んだ 30 秒。トークンが 4 つの列を落ちてきて判定ラインで叩かれ、コンボが増え、右のコードが光っていく。",
      caption: "beatcode record で撮りました。曲は YouTube Music(Pear Desktop)で流し、2:30 から 3:00 まで。音は曲のファイルを録画の時刻に合わせて重ねました。叩いたのは画面を読む小さな bot なので、点数は人の腕前ではありません。音楽：魔王魂(maou.audio)。",
    },
    lanes: {
      heading: "トークンには、列がある。",
      body: "beatcode はファイルを読み、トークンを種類ごとに分けて、その種類の列に落とします。順に叩けば、関数がもう一度書き上がります。",
      names: ["キーワード", "識別子", "演算子", "リテラル"],
      comments: "コメントはノーツになりません。",
    },
    plays: {
      heading: "遊べるもの",
      rows: [
        {
          label: "譜面",
          body: "同梱の曲、手元の git repo、自分の GitHub の repo、その場で AI に書いてもらった譜面。長いファイルは関数ごとに 1 つの譜面に切ります。",
        },
        {
          label: "言語",
          body: "Rust・Python・Go・TypeScript / JavaScript・Ruby・PHP。日本語と英語の文章(.md / .txt)も遊べます。C・C#・CSS・HTML・JSON・Shell・TOML・YAML・Zig・中国語の文章はプラグインで足せます。",
        },
        {
          label: "曲",
          body: "Spotify のお気に入りの曲を beatcode の中で流します。テンポとノーツの位置は曲の音を手元で解析して決め、外へは何も送りません。YouTube Music(Pear Desktop を操る)でも遊べます。",
        },
        {
          label: "難しさ",
          body: "4 / 6 / 8 列。列を増やすとトークンの種類が細かく分かれます。NORMAL と HARD。HARD は同じコードを 16 分音符に詰め、同時押しと長押しが入ります。",
        },
        {
          label: "履歴",
          body: "最後まで遊んだ回は残ります。選べば同じ曲と譜面でもう一度遊べます。",
        },
      ],
    },
    start: {
      heading: "はじめ方",
      commands: [
        { cmd: "beatcode", does: "曲選びの画面" },
        { cmd: "beatcode path/to/file.rs", does: "ファイルを 1 つ遊ぶ" },
        { cmd: "beatcode setup", does: "Spotify・YouTube Music・AI とつなぐ" },
        { cmd: "beatcode skills", does: "そのあと Claude Code か Codex で /beatcode-setup" },
        { cmd: "beatcode --help", does: "コマンドの一覧" },
      ],
      keysHeading: "キー",
      keys: "4 列は D F J K で叩きます。",
      ime: "遊ぶ前に日本語入力を英数にしてください。日本語入力のままだと、キーがゲームに届きません。",
      guide: "使い方を見る",
    },
    runs: {
      heading: "動く環境",
      rows: [
        { label: "macOS", body: "11 以降。Apple シリコンと Intel。" },
        {
          label: "Linux",
          body: "x86_64 / arm64、glibc 2.35 以降(Ubuntu 22.04・Debian 12 以降)。音に ALSA、HTTPS に OpenSSL 3 が要ります。インカメは macOS だけです。",
        },
      ],
    },
    footer: {
      license:
        ["beatcode は著作権者がすべての権利を持つソフトウェアです。", "詳しい条件は LICENSE を確認してください。"],
      links: [
        { label: "GitHub", href: repo },
        { label: "Releases", href: `${repo}/releases` },
        { label: "LICENSE", href: `${repo}/blob/main/LICENSE` },
      ],
      copyright: "© 2026 yukihirop",
    },
  },
};

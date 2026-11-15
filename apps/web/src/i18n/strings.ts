export type Lang = "en" | "ja";

type Row = { label: string; body: string };
type Command = { cmd: string; does: string };

export type Strings = {
  htmlLang: string;
  title: string;
  description: string;
  otherLang: { label: string; href: string };
  nav: { environment: string; guide: string; config: string; plugins: string; skills: string; rankingServer: string; philosophy: string };
  github: string;
  /** The report menu at the end of the nav: each item opens one of the repo's issue forms (.github/ISSUE_TEMPLATE) */
  report: { label: string; items: { template: string; title: string; note: string }[] };
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
  // The 93-second intro video above the demo (2026-11-15). Same fields as demo
  intro: {
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
      "brew trust --formula yukihirop/beatcode/beatcode",
      "brew install beatcode",
    ],
  },
  { id: "npm", label: "npm", lines: ["npx beatcode"] },
  {
    id: "curl",
    label: "curl",
    lines: ["curl -fsSL https://beatcode.run/install.sh | sh"],
  },
] as const;

export const strings: Record<Lang, Strings> = {
  en: {
    htmlLang: "en",
    title: "beatcode — Play your code as a rhythm game",
    description:
      "A rhythm game for the terminal. The notes are the tokens of real source code, and clearing a song types out a function.",
    otherLang: { label: "日本語", href: "ja/" },
    nav: { environment: "Requirements", guide: "Guide", config: "Settings", plugins: "Plugins", skills: "Skills", rankingServer: "Ranking server", philosophy: "Philosophy" },
    github: "GitHub",
    report: {
      label: "Report a problem",
      items: [
        { template: "beatcode.yml", title: "The game", note: "A bug, an idea or a question about beatcode" },
        { template: "website.yml", title: "This page", note: "Something broken or wrong on this page" },
      ],
    },
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
      platforms: "macOS 11+ · Apple silicon / Intel",
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
    intro: {
      heading: "beatcode in 93 seconds.",
      body: "What it plays like, where the charts come from (your repos, GitHub, an AI), sharing a chart as a gist, your result on X, your own leaderboard, and a song while your AI agent works.",
      play: "Play with sound",
      label: "The 93-second beatcode intro: play scenes with Heroes Tonight, local repos and GitHub as charts, 28 languages, an AI writing a chart, the song X-ray, 8 lanes on HARD, replay from history, sharing as a gist, a result card for X, a leaderboard, and a notice from an AI agent while you play.",
      caption: "Edited from beatcode record recordings, with captions and zooms. A small bot that reads the screen did the hitting. Song: Elektronomia - Sky High [NCS Release]. Music provided by NoCopyrightSounds. Free Download/Stream: http://ncs.io/skyhigh Watch: http://youtu.be/TW9d8vYrVFQ. In the play scenes: Janji - Heroes Tonight (feat. Johnning) [NCS Release]. Music provided by NoCopyrightSounds. Free Download/Stream: http://ncs.io/ht Watch: http://youtu.be/3nQNiWdeH2Q",
    },
    demo: {
      heading: "The real thing, with the song.",
      body: "Thirty seconds of the last chorus of Heroes Tonight by Janji (feat. Johnning), played on the bundled Rust charts. The code on the right lights up token by token as it’s hit.",
      play: "Play with sound",
      label: "Thirty seconds of beatcode with Heroes Tonight playing: tokens fall down four lanes and are hit on the judgment line while the combo climbs and the code on the right lights up.",
      caption: "Recorded with beatcode record while Spotify played the song, from 2:38 to 3:08; the sound is what beatcode record captured as it played. A small bot that reads the screen did the hitting, so the score isn’t a person’s. Song: Janji - Heroes Tonight (feat. Johnning) [NCS Release]. Music provided by NoCopyrightSounds. Free Download/Stream: http://ncs.io/ht Watch: http://youtu.be/3nQNiWdeH2Q",
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
          body: "Rust, Python, Go, TypeScript, JavaScript, Ruby and PHP. Plain .md / .txt in English or Japanese. C, C#, CSS, HTML, JSON, Shell, TOML, YAML, Zig and Chinese prose come as plugins.",
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
          body: "Not supported yet.",
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
    nav: { environment: "推奨環境", guide: "使い方", config: "設定", plugins: "プラグイン", skills: "スキル", rankingServer: "ランキングサーバー", philosophy: "フィロソフィー" },
    github: "GitHub",
    report: {
      label: "不具合を報告する",
      items: [
        { template: "beatcode.yml", title: "ゲーム", note: "beatcode のバグ・要望・質問" },
        { template: "website.yml", title: "このページ", note: "このページの壊れている所や誤り" },
      ],
    },
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
      installHeading: "Install",
      copy: "コピー",
      copied: "コピーしました",
      npmNote: "入れずにそのまま動きます。Node.js 18 以降。",
      platforms: "macOS 11 以降 · Apple シリコン / Intel",
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
    intro: {
      heading: "93 秒で、beatcode。",
      body: "遊んでいるところ、譜面の出どころ(手元の repo・GitHub・AI)、gist で渡す、X に結果を出す、自分たちのランキング、AI エージェントを待つあいだの 1 曲まで。",
      play: "音つきで再生",
      label: "beatcode の 93 秒の紹介動画。シャイニングスターで遊ぶ場面、手元の repo と GitHub の譜面、28 の言語、AI が譜面を書くところ、曲のレントゲン、8 列の HARD、履歴から遊ぶ、gist で渡す、X 用の結果のカード、ランキング、遊んでいる間に流れる AI エージェントの知らせ。",
      caption: "beatcode record で撮った画面を編集し、字幕と寄りを足しました。叩いたのは画面を読む小さな bot です。遊ぶ場面の曲は魔王魂の「シャイニングスター」。音楽：魔王魂(maou.audio)。BGM: Song: Elektronomia - Sky High [NCS Release]. Music provided by NoCopyrightSounds. Free Download/Stream: http://ncs.io/skyhigh Watch: http://youtu.be/TW9d8vYrVFQ",
    },
    demo: {
      heading: "本物の画面を、曲といっしょに。",
      body: "魔王魂の「シャイニングスター」(♩=158)の途中 30 秒を、同梱の Rust の譜面で遊んだところです。叩いたトークンが、右のコードで順に光っていきます。",
      play: "音つきで再生",
      label: "シャイニングスターを流しながら beatcode を遊んだ 30 秒。トークンが 4 つの列を落ちてきて判定ラインで叩かれ、コンボが増え、右のコードが光っていく。",
      caption: "beatcode record で撮りました。曲は Spotify で流し、2:30 から 3:00 まで。音も beatcode record がそのとき録ったものです。叩いたのは画面を読む小さな bot なので、点数は人の腕前ではありません。音楽：魔王魂(maou.audio)。",
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
          body: "Rust・Python・Go・TypeScript・JavaScript・Ruby・PHP。日本語と英語の文章(.md / .txt)も遊べます。C・C#・CSS・HTML・JSON・Shell・TOML・YAML・Zig・中国語の文章はプラグインで足せます。",
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
          body: "まだ対応していません。",
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

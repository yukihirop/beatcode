import type { Guide } from "./guide";
import type { Lang } from "./strings";

// The whole site in one file, for the agent to read first
const llmsFull = `${(import.meta.env.SITE ?? "https://beatcode.run").replace(/\/?$/, "/")}llms-full.txt`;

// What to have before playing: the OS, where songs play, which terminal, fonts and the extras.
// What beatcode itself checks is in beatcode-private (src/logo.rs for images, the ready screen for key releases).
// Only the author's terminal (Ghostty inside cmux) has been used for real play; the rest of the terminal table says so.

export const guideEnvironment: Record<Lang, Guide> = {
  en: {
    title: "Requirements — beatcode",
    description: "What you need to play beatcode, and what makes it nicer: the OS, where songs play, which terminal, fonts and the extras.",
    heading: "Requirements",
    lede: "What you need before the first song, and what makes playing nicer. A coding agent can do it all for you; otherwise, only what you need and where songs play are must-haves, and the rest adds pictures, sound or speed.",
    menuLabel: "Topics",
    keysLabel: "Keys on this screen",
    next: { href: "guide/", label: "How to play: one song from start to finish →" },
    steps: [
      {
        id: "agent",
        menu: "Let an agent do it",
        title: "Let a coding agent set it up",
        body: [
          "The quickest way: copy this prompt into a coding agent (Claude Code, Codex and the like) on the machine you’ll play on. It reads this site, looks at your machine and terminal, and walks you through the rest of this page.",
          "It asks before installing anything, and leaves the logins that need a browser (Spotify, gh) for you to type. API keys are only checked for, never read.",
        ],
        file: {
          name: "Prompt for your coding agent",
          copy: true,
          lines: [
            "Set up beatcode, a rhythm game that runs in the terminal, on this machine so I can play it comfortably.",
            "",
            `1. Read ${llmsFull} first. It is the whole beatcode site, including the Requirements page.`,
            "2. Look at this machine without changing anything: the OS and CPU, whether beatcode is installed (beatcode --version), which terminal I'm in ($TERM_PROGRAM, and $TMUX for tmux), and whether ffmpeg and gh are installed.",
            "3. If beatcode isn't installed, show me the install command that fits (Homebrew, npm or curl, from the site) and ask before running it.",
            "4. Run beatcode skills, then read ~/.agents/skills/beatcode-setup/SKILL.md and follow it. It asks what to connect: Spotify or YouTube Music, AI charts, the combo voice, icons and shell completion.",
            "5. Anything that needs a browser or my typing (beatcode setup music, gh auth login): give me the command to run myself.",
            "6. Never read or print API keys or credentials. Only check whether they exist.",
            "7. At the end, tell me what is set up, what isn't, and what the Requirements page says about my terminal (pictures, key release, tmux), with what I could change.",
          ],
        },
        shots: [],
      },
      {
        id: "needs",
        menu: "What you need",
        title: "What you need",
        body: [
          "beatcode runs in a terminal on macOS 11 or later, or Linux on x86_64 or arm64 (glibc 2.35 or later). Windows isn’t built.",
          "Give it room. The screenshots on this site were taken at 120 columns by 34 rows; song select puts the songs and charts in 62 columns on the left and the code on the right, and 8 lanes take about 80 columns before the score panel. A smaller window still works, with narrower lanes and less code.",
          "A keyboard you can hit quickly. Four lanes use D F J K, six S D F J K L, eight A S D F J K L ; (all can be changed in config.toml).",
        ],
        table: {
          head: ["", "Needed"],
          rows: [
            ["OS", "macOS 11+ / Linux x86_64 or arm64 (glibc 2.35+)"],
            ["Terminal size", "120 × 34 or more is comfortable"],
            ["Keys", "D F J K (4 lanes), up to A S D F J K L ; (8 lanes)"],
          ],
        },
        shots: [],
      },
      {
        id: "music",
        menu: "Where songs play",
        title: "Where songs play",
        body: [
          "Pick one with beatcode setup. You can also play with no song at all: Silent keeps a fixed tempo and lights the judgment line on the beat.",
          "With Spotify, beatcode analyzes the song’s sound on your machine to place notes on its beats. With YouTube Music it can’t read the sound, so you tap the tempo once per song.",
        ],
        cmd: "beatcode setup",
        table: {
          head: ["Where", "What you need", "Notes"],
          rows: [
            ["Spotify", "A Premium account", "Plays inside beatcode. Beats come from analyzing the song"],
            ["YouTube Music", "The Pear Desktop app with its API Server plugin on", "beatcode drives the app. Tap the tempo with t"],
            ["Silent", "Nothing", "A fixed tempo (BPM 100 by default)"],
          ],
        },
        shots: [],
      },
      {
        id: "terminal",
        menu: "Terminal",
        title: "Which terminal",
        body: [
          "Any terminal plays the game. Two things depend on it: pictures (the logo, cover art, the camera) and whether beatcode hears a key being let go (needed to hold HARD’s long notes; without it a long note only needs the press).",
          "The author plays in Ghostty (inside cmux), so that’s the one we recommend. The others are listed by what beatcode does with them; we haven’t played on them, so treat their rows as expected, not checked.",
          "You can check your own: beatcode logo check prints whether the terminal answered and how pictures will be drawn, and the ready screen before a song says “key release: supported” or “not supported”.",
          "Inside herdr, pictures are off until you turn on its experimental kitty graphics: add the lines below to herdr’s config.toml and run herdr server reload-config. The terminal outside herdr also has to draw kitty graphics. Until then, beatcode logo check says “text logo” even though the terminal answered.",
        ],
        cmd: "beatcode logo check",
        file: { name: "~/.config/herdr/config.toml", lines: ["[experimental]", "kitty_graphics = true"], copy: true },
        table: {
          head: ["Terminal", "Pictures", "Key release", "Checked"],
          rows: [
            ["Ghostty", "Yes (kitty graphics)", "Expected (kitty keyboard protocol)", "Pictures: yes, in cmux. Key release: not yet"],
            ["kitty", "Yes (kitty graphics)", "Expected (kitty keyboard protocol)", "No"],
            ["WezTerm", "Expected", "Expected", "No"],
            ["iTerm2", "Expected (its own image format)", "Not known", "No"],
            ["Terminal.app", "No: a logo in letters, the camera in ▀ blocks", "Not known", "No"],
            ["Inside tmux", "No: beatcode doesn’t ask", "Not known", "No"],
            ["Inside herdr", "Yes, once kitty_graphics is on (see above)", "Not known", "Pictures: yes, with herdr 0.8.2"],
          ],
        },
        shots: [],
      },
      {
        id: "font",
        menu: "Font",
        title: "A font with icons",
        body: [
          "beatcode marks repos, files and ranks with Nerd Font icons. Without a Nerd Font they show as boxes; set icons = \"text\" in config.toml to use letters instead (or \"none\").",
          "BEATCODE_ICONS=text beatcode tries it for one run without editing the file.",
        ],
        file: { name: "~/.config/beatcode/config.toml", lines: ["[display]", 'icons = "text"'] },
        shots: [],
      },
      {
        id: "extras",
        menu: "Nice to have",
        title: "Nice to have",
        body: ["None of these are needed to play. Each one turns on something more."],
        table: {
          head: ["What", "For", "Set up"],
          rows: [
            ["An OpenRouter or OpenAI API key", "AI writing a chart for the song (a)", "beatcode setup, or OPENROUTER_API_KEY / OPENAI_API_KEY"],
            ["gh (GitHub CLI), signed in", "Sharing charts as gists and fetching them (g, G)", "gh auth login"],
            ["VOICEVOX or AivisSpeech engine", "A voice calling out the combo", "[voice] in config.toml"],
            ["ffmpeg", "The front camera in the lower right (macOS), and the beatcode record plugin", "brew install ffmpeg"],
            ["A GitHub account", "Sending plays to a ranking server", "beatcode setup rank"],
          ],
        },
        shots: [],
      },
      {
        id: "tips",
        menu: "Tips",
        title: "Tips for playing well",
        body: [
          "Turn your Japanese (or other) input method off before playing. With it on, the keys never reach the game.",
          "After a song of 30 notes or more, the results screen shows your average timing. Press o to shift judgment by that much; it’s kept for next time.",
          "↑ ↓ on the ready screen change the scroll speed (x0.5 to x4.0). Faster notes are farther apart and easier to read.",
          "Wired speakers or headphones are safer than Bluetooth, which tends to lag the sound (not measured here). If you hear the song late, o on the results screen makes up for it.",
          "Play outside tmux if you can: beatcode doesn’t draw pictures there.",
        ],
        shots: [],
      },
    ],
  },
  ja: {
    title: "推奨環境 — beatcode",
    description: "beatcode を遊ぶのに要るものと、あると快適なもの。OS・曲を流す先・端末・フォント・あると楽しいもの。",
    heading: "推奨環境",
    lede: "最初の 1 曲の前に要るものと、あると快適になるもの。コーディングエージェントに全部任せることもできます。自分でやるなら、要るのは「要るもの」と「曲を流す先」だけで、ほかは画像・音・遊びやすさを足すものです。",
    menuLabel: "項目",
    keysLabel: "この画面のキー",
    next: { href: "guide/", label: "使い方: 1 曲を最初から最後まで →" },
    steps: [
      {
        id: "agent",
        menu: "エージェントに任せる",
        title: "コーディングエージェントに任せる",
        body: [
          "いちばん早いのは、遊ぶマシンのコーディングエージェント(Claude Code・Codex など)にこのプロンプトを渡すことです。このサイトを読み、マシンと端末を見て、このページの残りを案内してくれます。",
          "何かを入れる前には聞きます。ブラウザでのログイン(Spotify・gh)は自分で打つよう案内します。API キーはあるかどうかを見るだけで、中身は読みません。",
        ],
        file: {
          name: "コーディングエージェントに渡すプロンプト",
          copy: true,
          lines: [
            "ターミナルで動く音ゲー beatcode を、このマシンで快適に遊べるようにセットアップしてください。",
            "",
            `1. まず ${llmsFull} を読んでください。推奨環境のページも含めた beatcode のサイト全部です。`,
            "2. 何も変えずに、このマシンを見てください: OS と CPU、beatcode が入っているか(beatcode --version)、今の端末($TERM_PROGRAM、tmux の中かは $TMUX)、ffmpeg と gh が入っているか。",
            "3. beatcode が入っていなければ、合う入れ方(サイトにある Homebrew・npm・curl)のコマンドを見せて、実行する前に聞いてください。",
            "4. beatcode skills を実行し、~/.agents/skills/beatcode-setup/SKILL.md を読んでその手順に従ってください。Spotify か YouTube Music・AI の譜面・コンボの声・アイコン・シェルの補完の、どれをつなぐかを聞いてくれます。",
            "5. ブラウザや私の入力が要るもの(beatcode setup music・gh auth login)は、私が打つコマンドを教えてください。",
            "6. API キーや資格情報の中身は読まない・出さないでください。あるかどうかだけを見てください。",
            "7. 最後に、済んだこと・済んでいないこと、推奨環境のページから見た私の端末のこと(画像・キーを離したこと・tmux)と、変えるならどうするかを教えてください。",
          ],
        },
        shots: [],
      },
      {
        id: "needs",
        menu: "要るもの",
        title: "要るもの",
        body: [
          "beatcode は端末で動きます。macOS 11 以降か、Linux の x86_64 / arm64(glibc 2.35 以降)。Windows 向けはありません。",
          "端末は広めに。このサイトの画面は 120 桁 × 34 行で撮りました。曲選びは左に曲と譜面(62 桁)、右にコード。8 列は点数の欄の手前までで 80 桁ほど使います。狭くても動きますが、列が細くなり、コードが短くなります。",
          "素早く叩けるキーボード。4 列は D F J K、6 列は S D F J K L、8 列は A S D F J K L ;(config.toml で替えられます)。",
        ],
        table: {
          head: ["", "要るもの"],
          rows: [
            ["OS", "macOS 11 以降 / Linux x86_64・arm64(glibc 2.35 以降)"],
            ["端末の大きさ", "120 × 34 以上だと快適"],
            ["キー", "D F J K(4 列)から A S D F J K L ;(8 列)まで"],
          ],
        },
        shots: [],
      },
      {
        id: "music",
        menu: "曲を流す先",
        title: "曲を流す先",
        body: [
          "beatcode setup で選びます。曲を流さずにも遊べます。無音は決まったテンポで、判定ラインが拍の頭で光ります。",
          "Spotify は、曲の音を手元で解析して拍にノーツを置きます。YouTube Music は音を読めないので、曲ごとに 1 回テンポをタップします。",
        ],
        cmd: "beatcode setup",
        table: {
          head: ["流す先", "要るもの", "メモ"],
          rows: [
            ["Spotify", "Premium のアカウント", "beatcode の中で鳴らす。拍は曲の解析から"],
            ["YouTube Music", "アプリ Pear Desktop(API Server のプラグインを有効に)", "beatcode がアプリを操る。テンポは t でタップ"],
            ["無音", "なし", "決まったテンポ(既定 BPM 100)"],
          ],
        },
        shots: [],
      },
      {
        id: "terminal",
        menu: "端末",
        title: "どの端末で遊ぶか",
        body: [
          "どの端末でも遊べます。端末で変わるのは 2 つ。画像(ロゴ・ジャケット・インカメ)と、キーを離したことが beatcode に届くか(HARD の長押しを押し続けるのに要ります。届かない端末では押すだけで取れます)。",
          "作者は Ghostty(cmux の中)で遊んでいるので、おすすめは Ghostty です。ほかは beatcode の作りから見込みを書いたもので、実際に遊んで確かめてはいません。",
          "自分の端末は確かめられます。beatcode logo check で端末が答えたか・画像をどう描くかが出ます。曲の前の待機画面には「キーを離したこと: 取れる / 取れない」が出ます。",
          "herdr の中では、herdr の試験的な kitty の画像を入れるまで画像が出ません。herdr の config.toml に下の 2 行を足して herdr server reload-config を打ちます。herdr の外側の端末も kitty の画像を描ける必要があります。入れるまでは、端末が答えていても beatcode logo check は「text logo」と出ます。",
        ],
        cmd: "beatcode logo check",
        file: { name: "~/.config/herdr/config.toml", lines: ["[experimental]", "kitty_graphics = true"], copy: true },
        table: {
          head: ["端末", "画像", "キーを離したこと", "確かめたか"],
          rows: [
            ["Ghostty", "出る(kitty の画像)", "取れる見込み(kitty keyboard protocol)", "画像は cmux の中で確かめた。キーを離したことはまだ"],
            ["kitty", "出る(kitty の画像)", "取れる見込み(kitty keyboard protocol)", "まだ"],
            ["WezTerm", "出る見込み", "取れる見込み", "まだ"],
            ["iTerm2", "出る見込み(iTerm2 の画像)", "分からない", "まだ"],
            ["Terminal.app", "出ない(ロゴは字、インカメは ▀ の字)", "分からない", "まだ"],
            ["tmux の中", "出ない(beatcode が聞かない)", "分からない", "まだ"],
            ["herdr の中", "kitty_graphics を入れれば出る(上を参照)", "分からない", "画像は herdr 0.8.2 で確かめた"],
          ],
        },
        shots: [],
      },
      {
        id: "font",
        menu: "フォント",
        title: "アイコンの入ったフォント",
        body: [
          "beatcode は repo・ファイル・順位に Nerd Font のアイコンを付けます。Nerd Font が無いと四角になるので、config.toml に icons = \"text\" と書けば字(\"none\" なら出さない)になります。",
          "BEATCODE_ICONS=text beatcode なら、ファイルを書き換えずにその 1 回だけ試せます。",
        ],
        file: { name: "~/.config/beatcode/config.toml", lines: ["[display]", 'icons = "text"'] },
        shots: [],
      },
      {
        id: "extras",
        menu: "あると楽しいもの",
        title: "あると楽しいもの",
        body: ["どれも無くても遊べます。あるとできることが増えます。"],
        table: {
          head: ["もの", "できること", "用意"],
          rows: [
            ["OpenRouter か OpenAI の API キー", "曲に合わせて AI に譜面を書いてもらう(a)", "beatcode setup か OPENROUTER_API_KEY / OPENAI_API_KEY"],
            ["gh(GitHub CLI)にログイン", "譜面を gist で渡す・取ってくる(g・G)", "gh auth login"],
            ["VOICEVOX か AivisSpeech のエンジン", "コンボ数を声で読み上げる", "config.toml の [voice]"],
            ["ffmpeg", "右下にインカメ(macOS)、プラグインの beatcode record", "brew install ffmpeg"],
            ["GitHub のアカウント", "ランキングサーバーへ記録を送る", "beatcode setup rank"],
          ],
        },
        shots: [],
      },
      {
        id: "tips",
        menu: "快適に遊ぶコツ",
        title: "快適に遊ぶコツ",
        body: [
          "日本語入力は切ってから遊びます。入れたままだと、キーがゲームに届きません。",
          "30 ノーツ以上の曲を遊ぶと、結果画面に平均の判定のずれが出ます。o でその分だけ判定をずらし、次からも使います。",
          "待機画面の ↑ ↓ で落ちる速さ(x0.5〜x4.0)を替えられます。速くするとノーツの間が空いて読みやすくなります。",
          "音は Bluetooth より有線のほうが安心です(Bluetooth は音が遅れやすい。ここでは測っていません)。曲が遅れて聞こえるなら、結果画面の o で合わせられます。",
          "できれば tmux の外で。tmux の中では画像を出しません。",
        ],
        shots: [],
      },
    ],
  },
};

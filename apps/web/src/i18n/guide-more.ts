import type { Guide } from "./guide";
import type { Lang } from "./strings";

// The second guide page: things worth knowing once you've played a song.
// The AI shots were recorded with a real request to OpenRouter; the gist dialog was closed with Esc, nothing published.
export const guideMore: Record<Lang, Guide> = {
  en: {
    title: "More — beatcode",
    description: "Have an AI write a chart, let Claude Code or Codex set beatcode up, pass charts around as gists, change config.toml and add languages.",
    heading: "More",
    lede: "Once you’ve played a song: AI charts, handing setup to Claude Code or Codex, sharing charts as gists, config.toml and more languages.",
    recorded:
      "Recorded with beatcode record. The AI chart is a real one, written by openai/gpt-6-luna through OpenRouter; the gist dialog was closed with Esc, so nothing was published.",
    menuLabel: "Topics",
    keysLabel: "Keys on this screen",
    next: { href: "guide/plugins/", label: "Plugins: more languages, AI providers and beatcode record →" },
    steps: [
      {
        id: "ai",
        menu: "AI charts",
        title: "Have an AI write a chart",
        body: [
          "On song select, press a, type a topic and press Enter. The AI writes code in the language you picked, and that code becomes the chart. You can keep picking and playing other charts while it writes.",
          "With a song picked, the topic starts as the song title and artist. ↑ ↓ picks a prompt (standard, song mood, symbol-heavy, rhythm-first, textbook), ← → a language.",
          "Only the prompt, the topic, the language and a rough length are sent — never code from your repos. The cost shows on screen; with the default model it came to $0.0004 to $0.0005 a chart in these recordings. beatcode ai clean removes the charts the AI wrote.",
          "First, paste an API key with beatcode setup ai. beatcode checks that it works, then saves it readable only by you. Switch where it asks with beatcode provider ai <id>.",
        ],
        cmd: "beatcode setup ai",
        keys: [
          ["a", "Ask the AI (on song select)"],
          ["↑ ↓", "Pick a prompt"],
          ["← →", "Pick a language"],
          ["Shift+↑↓", "Scroll what will be sent"],
          ["Enter", "Send"],
        ],
        table: {
          head: ["Provider", "Get a key at", "Environment variable"],
          rows: [
            ["openrouter (default)", "openrouter.ai/settings/keys", "OPENROUTER_API_KEY"],
            ["openai", "platform.openai.com/api-keys", "OPENAI_API_KEY"],
            ["google-ai-studio (plugin)", "aistudio.google.com/apikey", "GEMINI_API_KEY"],
          ],
        },
        shots: [
          {
            file: "ai-topic",
            alt: "Song select with the chart row turned into Ask the AI: topic Shooting star, prompt Standard 1/5, Rust, about 62 lines, openai/gpt-6-luna, and a note that only the prompt, topic, language and length are sent.",
            caption: "The topic is “Shooting star”. No song is picked here, so it plays Silent.",
          },
          {
            file: "ai-writing",
            alt: "Song select with the bundled charts listed, and a line at the bottom: the AI is writing a Rust chart, 2 seconds, you can keep picking and playing.",
            caption: "While it writes, the rest of the screen still works.",
          },
          {
            file: "ai-done",
            alt: "The chart source switched to AI with one Rust chart of 444 notes, its code on the right under a header naming the model and the cost, and a line at the bottom: AI wrote a 444-note chart ($0.0004 · 178 in / 813 out tokens · 7.4 s), g publish to a gist.",
            caption: "7.4 seconds and $0.0004 for 444 notes. The header at the top of the code keeps the model and the cost.",
          },
        ],
      },
      {
        id: "skills",
        menu: "Claude Code · Codex",
        title: "Let Claude Code or Codex set it up",
        body: [
          "beatcode skills puts the /beatcode-setup and /beatcode-teardown skills in ~/.agents/skills/, and links to them from ~/.claude/skills/ and ~/.codex/skills/ if those exist.",
          "Run /beatcode-setup in Claude Code or Codex. It looks at what’s connected — the Spotify login, AI keys, voice engines, config.toml, shell completions — and asks what to set up. Spotify and AI keys go through beatcode setup; the combo voice and icons go into config.toml; completions go into your shell rc. It never reads what’s inside a key.",
          "/beatcode-teardown is for leaving: it asks what to remove and shows the list before deleting anything.",
        ],
        cmd: "beatcode skills",
        out: [
          "Installed: ~/.agents/skills/beatcode-setup/SKILL.md",
          "Installed: ~/.agents/skills/beatcode-teardown/SKILL.md",
          "Run /beatcode-setup in Claude Code or Codex",
        ],
        shots: [],
      },
      {
        id: "gist",
        menu: "Share as a gist",
        title: "Pass a chart around as a gist",
        body: [
          "Bundled charts, charts the AI wrote and charts taken from a gist can go up as a gist for someone else to play. beatcode talks to gists through gh, so you need gh auth login with the gist scope.",
          "Pick the chart and press g. ← → picks secret (anyone with the URL; the default) or public (searchable), Enter publishes. The code and the notes (.bme) go into one gist, and the URL shows at the bottom.",
          "To play one, press G on song select, paste the gist URL or ID and press Enter. It lands in the Gist source with the author’s difficulty, lanes and song (d and w still change them), and starts playing. Typing it after / on the chart row fetches it too, without playing.",
          "Charts from a public GitHub repo can be published too, as long as the files match what’s pushed. beatcode doesn’t check the license, so make sure the code may be shared.",
        ],
        keys: [
          ["g", "Publish to a gist"],
          ["← →", "secret or public"],
          ["Enter", "Publish"],
          ["Esc", "Cancel"],
          ["G", "Paste a gist and play it"],
        ],
        shots: [
          {
            file: "gist",
            alt: "Song select with the AI chart picked and a line at the bottom: Publish to a gist: secret (anyone with the URL) highlighted, public (searchable), ← → pick, Enter publish, Esc cancel.",
            caption: "After pressing g. We closed this with Esc, so nothing was published.",
          },
        ],
      },
      {
        id: "config",
        menu: "config.toml",
        title: "Change things in config.toml",
        body: [
          "Settings live in ~/.config/beatcode/config.toml. Without it everything runs on defaults. An unknown key or a typo stops beatcode with the line and column, so mistakes don’t pass silently.",
          "The provider lines of [music], [ai] and [voice] can also be changed with beatcode provider, which rewrites just that one line.",
        ],
        cmd: ["beatcode provider", "beatcode provider music youtube-music"],
        table: {
          head: ["Section", "Keys", "What they do"],
          rows: [
            ["[music]", "provider", "Where songs play: \"spotify\" (default) or \"youtube-music\""],
            ["[ai]", "provider · model · effort", "Who writes charts, which model, how hard it thinks"],
            ["[voice]", "provider", "\"voicevox\" or \"aivisspeech\" calls out every 10 combo"],
            ["[keys]", "lanes · lanes6 · lanes8", "Keys per lane (default D F J K)"],
            ["[theme]", "name", "default · monokai · dracula · nord · gruvbox · solarized"],
            ["[effects]", "bomb · beam · crowd", "Hit flashes, lit lanes and the crowd of faces"],
            ["[sound]", "se · volume", "Sound effects for moving around the screens"],
            ["[display]", "language · icons · logo", "Screen language, icons and the logo"],
            ["[share]", "rank", "Put the ranking line in the X draft or not"],
            ["[repos]", "ignore", "Folders to skip when finding your repos"],
          ],
        },
        shots: [],
      },
      {
        id: "plugins",
        menu: "More languages",
        title: "Add a language",
        body: [
          "Built in: Rust, Python, Go, TypeScript, Ruby and PHP, plus Japanese and English prose. More can be added without rebuilding beatcode; they line up after the built-in tabs and work for your repos too.",
          "beatcode plugins install c adds one from the Releases; the Plugins page lists all of them.",
          "Describe a language in ~/.config/beatcode/langs/<id>.toml: keywords, comments and strings (beatcode plugins example prints one for Lua). beatcode plugins lists every language and why an external one failed to load.",
        ],
        cmd: "beatcode plugins",
        out: [
          "Rust         rust         .rs                      built-in",
          "Python       python       .py .pyi                 built-in",
          "Go           go           .go                      built-in",
          "TypeScript   typescript   .ts .tsx .mts .cts .js .jsx .mjs .cjs built-in",
          "Ruby         ruby         .rb .rake                built-in",
          "PHP          php          .php                     built-in",
          "日本語       ja           .md .txt                 built-in",
          "English      en           .md .txt                 built-in",
        ],
        shots: [],
      },
    ],
  },
  ja: {
    title: "詳しい使い方 — beatcode",
    description: "AI に譜面を書いてもらう、Claude Code・Codex に設定を頼む、gist で譜面を渡す、config.toml、言語を足す。",
    heading: "詳しい使い方",
    lede: "1 曲遊んだら次に。AI に譜面を書いてもらう、Claude Code・Codex に設定を頼む、gist で譜面を渡す、config.toml、言語を足す。",
    recorded:
      "画面は beatcode record で撮りました。AI の譜面は OpenRouter の openai/gpt-6-luna に実際に書いてもらったものです。gist の画面は Esc で閉じていて、公開はしていません。",
    menuLabel: "話題",
    keysLabel: "この画面のキー",
    next: { href: "guide/plugins/", label: "プラグイン: 言語・AI の頼む先・beatcode record を足す →" },
    steps: [
      {
        id: "ai",
        menu: "AI に書いてもらう",
        title: "AI に譜面を書いてもらう",
        body: [
          "曲選びで a を押し、お題を打って Enter。選んでいる言語のコードを AI が書き、それがそのまま譜面になります。書いている間も、ほかの譜面を選んだり遊んだりできます。",
          "曲を選んでいれば、お題には曲名とアーティストが入っています。↑↓ でプロンプト(標準・曲の雰囲気・記号だらけ・音ゲー特化・教科書風)を、←→ で言語を選べます。",
          "送るのはプロンプト・お題・言語・長さの目安だけで、手元の repo のコードは送りません。かかったお金は画面に出ます。既定のモデルで、この撮影では 1 回 $0.0004〜$0.0005 でした。書いてもらった譜面は beatcode ai clean で消せます。",
          "初めに beatcode setup ai で API キーを貼ります。使えるか確かめてから、自分だけが読める権限で保存します。頼む先は beatcode provider ai <id> で替えます。",
        ],
        cmd: "beatcode setup ai",
        keys: [
          ["a", "AI に書いてもらう(曲選びで)"],
          ["↑ ↓", "プロンプトを選ぶ"],
          ["← →", "言語を選ぶ"],
          ["Shift+↑↓", "送る中身を流して見る"],
          ["Enter", "書いてもらう"],
        ],
        table: {
          head: ["頼む先", "キーを作る所", "環境変数"],
          rows: [
            ["openrouter(既定)", "openrouter.ai/settings/keys", "OPENROUTER_API_KEY"],
            ["openai", "platform.openai.com/api-keys", "OPENAI_API_KEY"],
            ["google-ai-studio(プラグイン)", "aistudio.google.com/apikey", "GEMINI_API_KEY"],
          ],
        },
        shots: [
          {
            file: "ai-topic",
            alt: "曲選びの画面。譜面の欄が「AI に書いてもらう」に替わり、お題に流れ星、プロンプトは標準 1/5、Rust・約 62 行・openai/gpt-6-luna、送るのはプロンプト・お題・言語・長さだけという案内。",
            caption: "お題に「流れ星」と打ったところ。曲は選ばず、無音のままです。",
          },
          {
            file: "ai-writing",
            alt: "曲選びの画面。譜面の欄は同梱の譜面のまま、いちばん下に「AI が Rust の譜面を書いています… 2 秒(そのまま選んだり遊んだりできます)」。",
            caption: "書いている間も、ほかの所はそのまま使えます。",
          },
          {
            file: "ai-done",
            alt: "譜面の出どころが AI に替わり、Rust の譜面が 1 つ(516 ノーツ)。右にそのコードと、モデルと金額の入った頭の書き込み。いちばん下に「AI が 516 ノーツの譜面を書きました($0.0005・入力 180 / 出力 942 トークン・8.3 秒)」と g gist に公開。",
            caption: "8.3 秒・$0.0005 で 516 ノーツ。コードの頭に、モデルと金額が残ります。",
          },
        ],
      },
      {
        id: "skills",
        menu: "Claude Code・Codex",
        title: "Claude Code・Codex に設定を頼む",
        body: [
          "beatcode skills で、/beatcode-setup と /beatcode-teardown のスキルを ~/.agents/skills/ に置きます。~/.claude/skills/ と ~/.codex/skills/ があれば、そこからもリンクします。",
          "Claude Code か Codex で /beatcode-setup を呼ぶと、今の状態(Spotify のログイン・AI のキー・声のエンジン・config.toml・シェルの補完)を見て、何をつなぐかを聞いてくれます。Spotify と AI のキーは beatcode setup へ案内し、コンボの声とアイコンは config.toml に、シェルの補完は rc に書きます。キーの中身は読みません。",
          "/beatcode-teardown はやめるとき用です。何を消すかを聞き、消す前に一覧を見せて確かめます。",
        ],
        cmd: "beatcode skills",
        out: [
          "置きました: ~/.agents/skills/beatcode-setup/SKILL.md",
          "置きました: ~/.agents/skills/beatcode-teardown/SKILL.md",
          "Claude Code か Codex で /beatcode-setup を呼んでください",
        ],
        shots: [],
      },
      {
        id: "gist",
        menu: "gist で渡す",
        title: "譜面を gist で渡す",
        body: [
          "同梱・AI が書いた譜面・gist から取ってきた譜面は、gist に公開してほかの人に渡せます。gist とのやり取りは gh に任せるので、gh auth login 済みで gist の権限が要ります。",
          "譜面を選んで g。←→ で secret(URL を知っている人だけ。既定)か public(検索で見つかる)を選び、Enter で公開します。コードとノーツ(.bme)を 1 つの gist に入れ、URL が画面の下に出ます。",
          "受け取る側は、曲選びで G を押して gist の URL か ID を貼り、Enter。出どころ「Gist」に入り、難しさ・列の数・曲は作者のものになって(d / w で替えられます)、そのまま遊べます。譜面の段の / に打っても取ってこられます(遊ばずに選ぶだけ)。",
          "公開の GitHub repo の譜面も、push 済みの中身と同じなら公開できます。ライセンスは確かめないので、渡してよいコードかは自分で確かめてください。",
        ],
        keys: [
          ["g", "gist に公開"],
          ["← →", "secret か public"],
          ["Enter", "公開する"],
          ["Esc", "やめる"],
          ["G", "gist を貼って遊ぶ"],
        ],
        shots: [
          {
            file: "gist",
            alt: "AI の譜面を選んだ曲選びの画面。いちばん下に「gist に公開: secret(URL を知っている人だけ)」が選ばれ、public(検索で見つかる)、←→ 選ぶ、Enter 公開、Esc やめる。",
            caption: "g を押したところ。ここでは Esc で閉じたので、公開はしていません。",
          },
        ],
      },
      {
        id: "config",
        menu: "config.toml",
        title: "config.toml で変える",
        body: [
          "設定は ~/.config/beatcode/config.toml。無ければ全部既定で動きます。知らない項目や書き間違いがあると、行と列を出して止まります(黙って既定にすると気付けないため)。",
          "[music] [ai] [voice] の provider は、beatcode provider でも替えられます。書き換えるのはその 1 行だけです。",
        ],
        cmd: ["beatcode provider", "beatcode provider music youtube-music"],
        table: {
          head: ["段", "主な項目", "中身"],
          rows: [
            ["[music]", "provider", "曲を流す先。\"spotify\"(既定)か \"youtube-music\""],
            ["[ai]", "provider・model・effort", "頼む先・モデル・考える量"],
            ["[voice]", "provider", "\"voicevox\" か \"aivisspeech\" で、10 コンボごとに喋る"],
            ["[keys]", "lanes・lanes6・lanes8", "列のキー(既定は D F J K)"],
            ["[theme]", "name", "default・monokai・dracula・nord・gruvbox・solarized"],
            ["[effects]", "bomb・beam・crowd", "叩けたときの光・押した列の光・顔文字の行列"],
            ["[sound]", "se・volume", "画面の操作の効果音"],
            ["[display]", "language・icons・logo", "画面の言葉・アイコン・ロゴ"],
            ["[share]", "rank", "X の下書きにランキングの印を入れるか"],
            ["[repos]", "ignore", "手元の repo を探すときに降りないディレクトリ"],
          ],
        },
        shots: [],
      },
      {
        id: "plugins",
        menu: "言語を足す",
        title: "言語を足す",
        body: [
          "同梱の言語は Rust・Python・Go・TypeScript・Ruby・PHP と、日本語・英語の文章です。beatcode を作り直さずに言語を足せます。足した言語は言語のタブの後ろに並び、手元の repo の譜面にも使われます。",
          "beatcode plugins install c で Releases から入れられます。入れられるものは「プラグイン」のページに並べています。",
          "~/.config/beatcode/langs/<id>.toml に、キーワード・コメント・文字列の書き方を書きます(beatcode plugins example で Lua の見本)。beatcode plugins で、使える言語と、読めなかった外部の言語の理由が出ます。",
        ],
        cmd: "beatcode plugins",
        out: [
          "Rust         rust         .rs                      同梱",
          "Python       python       .py .pyi                 同梱",
          "Go           go           .go                      同梱",
          "TypeScript   typescript   .ts .tsx .mts .cts .js .jsx .mjs .cjs 同梱",
          "Ruby         ruby         .rb .rake                同梱",
          "PHP          php          .php                     同梱",
          "日本語       ja           .md .txt                 同梱",
          "English      en           .md .txt                 同梱",
        ],
        shots: [],
      },
    ],
  },
};

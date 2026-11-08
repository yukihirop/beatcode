import type { Guide } from "./guide";
import { codeLangs, proseLangs } from "./plugin-list";
import type { Lang } from "./strings";

// The third guide page: the plugins in the Releases, and how to add your own.
// The command output was taken with BEATCODE_DOWNLOAD_URL pointing at a local copy of a release, in an empty HOME.
export const guidePlugins: Record<Lang, Guide> = {
  en: {
    title: "Plugins — beatcode",
    description: `Add ${codeLangs.length} programming languages, ${proseLangs.en.length} written languages, two AI providers and beatcode record to beatcode with one command.`,
    heading: "Plugins",
    lede: `Plugins add what beatcode doesn’t ship with: ${codeLangs.length} programming languages, ${proseLangs.en.length} written languages, two more AI providers, a recorder and a gist previewer. Each is a small program that beatcode starts when it needs it.`,
    recorded:
      "The command output was taken against a local copy of the release, in an empty home folder. The screenshot was recorded with beatcode record after installing C.",
    menuLabel: "Topics",
    keysLabel: "Keys on this screen",
    next: { href: "guide/", label: "← How to play: one song from start to finish" },
    steps: [
      {
        id: "install",
        menu: "Install",
        title: "Install and remove",
        body: [
          "beatcode plugins install with no name lists every plugin in the Releases of the same version as your beatcode. Give names to install them: the short form (c, zh, ollama, record) is enough when it means one plugin.",
          "Each one is downloaded for your machine (Apple silicon or Intel), checked against its SHA-256 and put in ~/.local/share/beatcode/plugins/. beatcode looks there after PATH, so a plugin of the same name on PATH wins.",
          "A new language gets its own tab after the built-in ones, with two or three bundled charts, and is used for the files in your repos too. beatcode plugins uninstall zh removes one.",
        ],
        cmd: "beatcode plugins install c zh",
        out: [
          "Downloading beatcode-plugin-lang-c-aarch64-apple-darwin.tar.gz",
          "Installed: ~/.local/share/beatcode/plugins/beatcode-plugin-lang-c",
          "Downloading beatcode-plugin-nlang-zh-aarch64-apple-darwin.tar.gz",
          "Installed: ~/.local/share/beatcode/plugins/beatcode-plugin-nlang-zh",
          "Check with: beatcode plugins",
        ],
        shots: [
          {
            file: "plugin-c",
            alt: "The song select screen with a C tab after the built-in languages, showing fizzbuzz.c and stack.c and the code of fizzbuzz.c",
            caption: "After installing C: a C tab with two bundled charts, fizzbuzz.c and stack.c.",
          },
        ],
      },
      {
        id: "code",
        menu: "Programming languages",
        title: "Programming languages",
        body: [
          `${codeLangs.length} languages. Charts from code in them: the bundled ones, AI charts and the files in your repos. The name on the left is what you give beatcode plugins install.`,
        ],
        table: { head: ["Install", "Language", "Files"], rows: codeLangs },
        shots: [],
      },
      {
        id: "prose",
        menu: "Written languages",
        title: "Written languages",
        body: [
          `${proseLangs.en.length} languages, for charts from text instead of code. Like the bundled Japanese and English, they read .md and .txt files and look at the text to tell which language it is, so a German README becomes a German chart.`,
        ],
        table: { head: ["Install", "Language", "Name on the tab"], rows: proseLangs.en },
        shots: [],
      },
      {
        id: "ai",
        menu: "AI providers",
        title: "AI providers",
        body: [
          "OpenRouter and OpenAI are built in. These two add more places to send AI chart requests. beatcode setup ai also lists them and installs the one you pick.",
          "Switch with beatcode provider ai <id>, then paste the key in beatcode setup ai. Ollama runs on your own machine and doesn’t use a key, but beatcode won’t ask without one, so enter anything.",
        ],
        cmd: ["beatcode plugins install ollama", "beatcode provider ai ollama"],
        table: {
          head: ["Install", "Provider", "Key", "Default model"],
          rows: [
            ["google-ai-studio", "Google AI Studio (Gemini API)", "aistudio.google.com/apikey · GEMINI_API_KEY", "gemini-3.5-flash-lite"],
            ["ollama", "Ollama, on your machine (localhost:11434)", "Not used (enter anything)", "qwen3.8:27b-mlx"],
          ],
        },
        shots: [],
      },
      {
        id: "record",
        menu: "beatcode record",
        title: "beatcode record",
        body: [
          "A plugin can add a command. beatcode record starts beatcode, records the screen and the sound of beatcode and YouTube Music, and makes an .mp4 in the current folder when you quit. It needs ffmpeg. The videos on this site were made with it.",
          "The song is in the video, so don’t share what you record. On macOS 14.2 and later, the first run asks to allow beatcode record to capture system audio.",
        ],
        cmd: ["beatcode plugins install record", "beatcode record"],
        shots: [],
      },
      {
        id: "gist",
        menu: "beatcode gist preview",
        title: "beatcode gist preview",
        body: [
          "beatcode gist preview takes a beatmap gist’s URL or ID and opens a page in your browser, the same as a board on the ranking: the song’s card, and its notes playing themselves without sound. Play this song copies the gist’s URL to paste after G on the song select.",
          "It fetches the gist with gh, so it shows your secret gists too. -o <file.html> writes the page where you say; --no-open only writes it.",
        ],
        cmd: ["beatcode plugins install gist", "beatcode gist preview <gist URL or ID>"],
        shots: [],
      },
      {
        id: "own",
        menu: "Make your own",
        title: "Make your own",
        body: [
          "Without writing a program: describe a language in ~/.config/beatcode/langs/<id>.toml with its keywords, comments and strings. beatcode plugins example prints one for Lua.",
          "As a program: put an executable called beatcode-plugin-lang-<id> (beatcode-plugin-nlang-<id> for a written language) on PATH. beatcode talks to it in JSON lines. In Rust, implement LangPlugin from beatcode-plugin-api and call beatcode_plugin_api::protocol::serve.",
          "beatcode plugins lists every language, where it comes from and why one failed to load. To read no external languages at all, set [plugins] external = false in config.toml.",
        ],
        cmd: "beatcode plugins",
        out: [
          "Rust         rust         .rs                      built-in",
          "…",
          "English      en           .md .txt                 built-in",
          "C            c            .c .h                    ~/.local/share/beatcode/plugins/beatcode-plugin-lang-c",
          "中文         zh           .md .txt                 ~/.local/share/beatcode/plugins/beatcode-plugin-nlang-zh",
        ],
        shots: [],
      },
    ],
  },
  ja: {
    title: "プラグイン — beatcode",
    description: `コードの言語 ${codeLangs.length}・文章の言語 ${proseLangs.ja.length}・AI の頼む先 2 つ・beatcode record を、コマンド 1 つで beatcode に足せます。`,
    heading: "プラグイン",
    lede: `beatcode に入っていないものを足します。コードの言語 ${codeLangs.length}、文章の言語 ${proseLangs.ja.length}、AI の頼む先 2 つ、録画のコマンド、gist のプレビューのコマンド。どれも小さなプログラムで、beatcode が要るときに起動します。`,
    recorded:
      "コマンドの出力は、Release の写しを手元に置き、空のホームで取りました。画面は C を入れてから beatcode record で撮ったものです。",
    menuLabel: "項目",
    keysLabel: "この画面のキー",
    next: { href: "guide/", label: "← 使い方: 1 曲を通して遊ぶ流れ" },
    steps: [
      {
        id: "install",
        menu: "入れる・外す",
        title: "入れる・外す",
        body: [
          "beatcode plugins install を名前なしで打つと、beatcode と同じ版の Releases にあるプラグインが並びます。名前を付けると入ります。1 つに決まるなら短い名前(c・zh・ollama・record)で足ります。",
          "手元の機械に合うもの(Apple シリコンか Intel)を落とし、SHA-256 を確かめて ~/.local/share/beatcode/plugins/ に置きます。beatcode は PATH の後ろにここを探すので、PATH に同じ名前があればそちらが使われます。",
          "足した言語は同梱の言語のタブの後ろに並び、見本の譜面が 2〜3 つ付いてきます。手元の repo のファイルにも使われます。外すのは beatcode plugins uninstall zh。",
        ],
        cmd: "beatcode plugins install c zh",
        out: [
          "beatcode-plugin-lang-c-aarch64-apple-darwin.tar.gz を落としています",
          "入れました: ~/.local/share/beatcode/plugins/beatcode-plugin-lang-c",
          "beatcode-plugin-nlang-zh-aarch64-apple-darwin.tar.gz を落としています",
          "入れました: ~/.local/share/beatcode/plugins/beatcode-plugin-nlang-zh",
          "beatcode plugins で読めたか確かめられます",
        ],
        shots: [
          {
            file: "plugin-c",
            alt: "曲選びの画面。言語のタブの後ろに C が増え、fizzbuzz.c と stack.c が並び、右に fizzbuzz.c のコードが出ている",
            caption: "C を入れたところ。言語のタブに C が増え、見本の譜面 fizzbuzz.c と stack.c が並びます。",
          },
        ],
      },
      {
        id: "code",
        menu: "コードの言語",
        title: "コードの言語",
        body: [
          `${codeLangs.length} の言語。そのコードから譜面を作れます。同梱の譜面・AI の譜面・手元の repo のファイルのどれでも使えます。左の名前を beatcode plugins install に渡します。`,
        ],
        table: { head: ["入れる名前", "言語", "ファイル"], rows: codeLangs },
        shots: [],
      },
      {
        id: "prose",
        menu: "文章の言語",
        title: "文章の言語",
        body: [
          `${proseLangs.ja.length} の言語。コードの代わりに文章で遊びます。同梱の日本語・英語と同じく .md と .txt を読み、中身の字を見てどの言語かを決めるので、ドイツ語の README はドイツ語の譜面になります。`,
        ],
        table: { head: ["入れる名前", "言語", "タブの名前"], rows: proseLangs.ja },
        shots: [],
      },
      {
        id: "ai",
        menu: "AI の頼む先",
        title: "AI の頼む先",
        body: [
          "OpenRouter と OpenAI は同梱です。この 2 つで、AI の譜面を頼む先が増えます。beatcode setup ai にも並び、選ぶとその場で入ります。",
          "beatcode provider ai <id> で替えてから、beatcode setup ai でキーを貼ります。Ollama は手元で動くのでキーを使いませんが、beatcode はキーが無いと頼まないので、何か入れておきます。",
        ],
        cmd: ["beatcode plugins install ollama", "beatcode provider ai ollama"],
        table: {
          head: ["入れる名前", "頼む先", "キー", "既定のモデル"],
          rows: [
            ["google-ai-studio", "Google AI Studio(Gemini API)", "aistudio.google.com/apikey・GEMINI_API_KEY", "gemini-3.5-flash-lite"],
            ["ollama", "Ollama(手元の localhost:11434)", "使わない(何か入れておく)", "qwen3.8:27b-mlx"],
          ],
        },
        shots: [],
      },
      {
        id: "record",
        menu: "beatcode record",
        title: "beatcode record",
        body: [
          "プラグインでコマンドも足せます。beatcode record は beatcode を起動して、画面と、beatcode と YouTube Music の音を録り、閉じると今いるディレクトリに .mp4 を作ります。ffmpeg が要ります。このサイトの動画もこれで撮りました。",
          "曲が入るので、録ったものは配らないでください。macOS 14.2 以降では、初めてのときに「beatcode record」に音の収録を許すか聞かれます。",
        ],
        cmd: ["beatcode plugins install record", "beatcode record"],
        shots: [],
      },
      {
        id: "gist",
        menu: "beatcode gist preview",
        title: "beatcode gist preview",
        body: [
          "beatcode gist preview に譜面の gist の URL か ID を渡すと、ランキングのボードと同じ、曲のカードと、ノーツを音なしで自動で落とすページがブラウザで開きます。「この曲で遊ぶ」で gist の URL がコピーされるので、曲選びの G で貼って遊べます。",
          "gist は gh で取るので、自分の secret の gist も見られます。-o <ファイル.html> で書く場所を決められ、--no-open なら書くだけです。",
        ],
        cmd: ["beatcode plugins install gist", "beatcode gist preview <gist の URL か ID>"],
        shots: [],
      },
      {
        id: "own",
        menu: "自分で作る",
        title: "自分で作る",
        body: [
          "プログラムを書かずに足すなら、~/.config/beatcode/langs/<id>.toml にキーワード・コメント・文字列の書き方を書きます。beatcode plugins example で Lua の見本が出ます。",
          "プログラムで足すなら、beatcode-plugin-lang-<id>(文章なら beatcode-plugin-nlang-<id>)という名前の実行ファイルを PATH に置きます。beatcode とは JSON 行でやり取りします。Rust なら beatcode-plugin-api の LangPlugin を実装し、beatcode_plugin_api::protocol::serve を呼びます。",
          "beatcode plugins で、使える言語とその出どころ、読めなかった言語の理由が出ます。外部の言語を読まないときは config.toml の [plugins] external = false。",
        ],
        cmd: "beatcode plugins",
        out: [
          "Rust         rust         .rs                      同梱",
          "…",
          "English      en           .md .txt                 同梱",
          "C            c            .c .h                    ~/.local/share/beatcode/plugins/beatcode-plugin-lang-c",
          "中文         zh           .md .txt                 ~/.local/share/beatcode/plugins/beatcode-plugin-nlang-zh",
        ],
        shots: [],
      },
    ],
  },
};

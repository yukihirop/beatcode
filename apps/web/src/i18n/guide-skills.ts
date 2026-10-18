import type { Guide } from "./guide";
import type { Lang } from "./strings";

// The skills page: the agent skills beatcode skills installs, for Claude Code and Codex.
// The same as the source repository's skills/*/SKILL.md; the output was taken in an empty home folder with ~/.claude/skills.
export const guideSkills: Record<Lang, Guide> = {
  en: {
    title: "Skills — beatcode",
    description: "Three skills for Claude Code and Codex: set beatcode up, tidy it away, and hear when work you handed off is done while you play.",
    heading: "Skills",
    lede: "beatcode comes with three skills for coding agents. They set beatcode up for you, remove it when you’re done, and tell you in the crowd panel when work you handed to Claude Code is finished.",
    recorded:
      "The command output was taken in an empty home folder that had ~/.claude/skills. The notice screenshot is a frame of a recording rendered by beatcode record render, playing the bundled fizzbuzz.rs without music; the notice was left with beatcode notify, and the keys were pressed by a script, not a person.",
    menuLabel: "Topics",
    keysLabel: "Keys on this screen",
    next: { href: "guide/plugins/", label: "← Plugins: more languages, AI providers and beatcode record" },
    steps: [
      {
        id: "install",
        menu: "Install",
        title: "Install the skills",
        body: [
          "beatcode skills puts the three skills in ~/.agents/skills/. The skills are built into beatcode, so they match the version you have; run it again after updating beatcode to refresh them.",
          "If ~/.claude/skills/ or ~/.codex/skills/ exists, it also links each skill there, so Claude Code and Codex find them. A skill of the same name that’s already there is left alone.",
        ],
        cmd: "beatcode skills",
        out: [
          "Installed: ~/.agents/skills/beatcode-setup/SKILL.md",
          "Installed: ~/.agents/skills/beatcode-teardown/SKILL.md",
          "Installed: ~/.agents/skills/beatcode-work/SKILL.md",
          "Installed: ~/.claude/skills/beatcode-setup -> ~/.agents/skills/beatcode-setup",
          "Installed: ~/.claude/skills/beatcode-teardown -> ~/.agents/skills/beatcode-teardown",
          "Installed: ~/.claude/skills/beatcode-work -> ~/.agents/skills/beatcode-work",
          "Run /beatcode-setup in Claude Code or Codex",
        ],
        shots: [],
      },
      {
        id: "setup",
        menu: "/beatcode-setup",
        title: "/beatcode-setup",
        body: [
          "Gets beatcode ready to play for the first time. It looks at what’s already there (the Spotify login, the AI key, the voice engine, config.toml and shell completion) and asks what you want to connect.",
          "Spotify and the AI key go through beatcode setup, which the skill walks you to. The combo voice and how icons are drawn go in config.toml, and shell completion is one line in your rc file. It never reads or shows your keys; it only checks whether they exist.",
        ],
        cmd: "/beatcode-setup",
        shots: [],
      },
      {
        id: "teardown",
        menu: "/beatcode-teardown",
        title: "/beatcode-teardown",
        body: [
          "Removes what beatcode left on your machine: ~/.config/beatcode/ (settings, play history, the Spotify login, the AI key and AI charts), ~/.cache/beatcode/, the plugins in ~/.local/share/beatcode/, the two completion lines in your rc file, the skills and their links, and the binary.",
          "It asks what to remove, and shows the list before deleting anything.",
        ],
        cmd: "/beatcode-teardown",
        shots: [],
      },
      {
        id: "work",
        menu: "/beatcode-work",
        title: "/beatcode-work",
        body: [
          "Hand Claude Code some work and keep playing. /beatcode-work <task> does the work as usual, and when it’s done, a kaomoji walks “<folder>: <what was done>” across the crowd panel, in play and under the jacket or code on the song select. It says so when the work failed, too.",
          "If Claude Code stops partway, you see that as well: “has a question — <the first question>” before it asks you something, and “is waiting for permission — <Claude Code’s notification>” when it needs your OK. These only show while the work is going, so ordinary chats stay quiet.",
          "Where the crowd isn’t shown (the results screen, a terminal shorter than 30 rows, or [effects] crowd = false), notices wait and the song select shows how many in its title. To turn them off, set [effects] notices = false in config.toml.",
          "/beatcode-work is long to type every time, so we recommend giving it a short name: link it as bcw in ~/.claude/skills/ and Claude Code also calls it as /bcw. beatcode skills doesn’t make this link, so when you stop using beatcode, remove ~/.claude/skills/bcw yourself.",
        ],
        cmd: ["ln -s ~/.agents/skills/beatcode-work ~/.claude/skills/bcw", "/bcw fix the failing tests"],
        shots: [
          {
            file: "notice",
            alt: "The play screen, with the crowd panel at the bottom: a kaomoji walks the notice “api-server: fixed the failing tests” along the bottom row while the notes keep falling and the score shows PERFECT and GREAT.",
            caption: "A notice walking across the crowd panel in the middle of a song",
          },
        ],
      },
      {
        id: "notify",
        menu: "beatcode notify",
        title: "beatcode notify",
        body: [
          "/beatcode-work uses beatcode notify, which you can call from anything: a script, a build, another agent. Each call leaves one notice, and the crowd walks them in order.",
          "--begin and --end <text> mark the current folder’s work as started and finished; --end also leaves “<folder>: <text>”. --hook reads a Claude Code hook’s JSON and only leaves a notice while that folder’s work is marked.",
        ],
        cmd: ['beatcode notify "build finished"', "cargo build && beatcode notify \"build OK\" || beatcode notify \"build failed\""],
        shots: [],
      },
    ],
  },
  ja: {
    title: "スキル — beatcode",
    description: "Claude Code と Codex のスキルが 3 つ。beatcode を整える・片付ける、頼んだ仕事が終わったら遊んでいる間に知らせる。",
    heading: "スキル",
    lede: "beatcode にはコーディングエージェント向けのスキルが 3 つ付いています。beatcode を遊べるように整える、やめるときに片付ける、Claude Code に頼んだ仕事が終わったらわっしょいの枠で知らせる、の 3 つです。",
    recorded:
      "コマンドの出力は、~/.claude/skills だけがある空のホームで取りました。知らせの画面は、同梱の fizzbuzz.rs を音なしで遊んだ録画を beatcode record render で動画にして、そこから 1 コマ取ったものです。知らせは beatcode notify で置き、キーは人ではなくスクリプトが押しています。",
    menuLabel: "項目",
    keysLabel: "この画面のキー",
    next: { href: "guide/plugins/", label: "← プラグイン: 言語・AI の頼む先・beatcode record を足す" },
    steps: [
      {
        id: "install",
        menu: "入れる",
        title: "スキルを入れる",
        body: [
          "beatcode skills で、3 つのスキルを ~/.agents/skills/ に置きます。スキルは beatcode に入っているので、手元の beatcode の版に合ったものになります。beatcode を新しくしたら、もう一度打つと書き直されます。",
          "~/.claude/skills/ や ~/.codex/skills/ があれば、そこにもリンクを張るので、Claude Code と Codex から呼べます。同じ名前のものがもうあれば、そのままにします。",
        ],
        cmd: "beatcode skills",
        out: [
          "置きました: ~/.agents/skills/beatcode-setup/SKILL.md",
          "置きました: ~/.agents/skills/beatcode-teardown/SKILL.md",
          "置きました: ~/.agents/skills/beatcode-work/SKILL.md",
          "置きました: ~/.claude/skills/beatcode-setup -> ~/.agents/skills/beatcode-setup",
          "置きました: ~/.claude/skills/beatcode-teardown -> ~/.agents/skills/beatcode-teardown",
          "置きました: ~/.claude/skills/beatcode-work -> ~/.agents/skills/beatcode-work",
          "Claude Code か Codex で /beatcode-setup を呼んでください",
        ],
        shots: [],
      },
      {
        id: "setup",
        menu: "/beatcode-setup",
        title: "/beatcode-setup",
        body: [
          "beatcode を初めて遊べるように整えます。今の状態(Spotify のログイン・AI のキー・声のエンジン・config.toml・シェルの補完)を見て、何をつなぐかを聞きます。",
          "Spotify と AI のキーは beatcode setup へ案内し、コンボの声とアイコンの出し方は config.toml に書き、シェルの補完は rc に 1 行足します。キーの中身は読まず、あるかどうかだけを見ます。",
        ],
        cmd: "/beatcode-setup",
        shots: [],
      },
      {
        id: "teardown",
        menu: "/beatcode-teardown",
        title: "/beatcode-teardown",
        body: [
          "beatcode が置いたものを片付けます。~/.config/beatcode/(設定・遊んだ記録・Spotify のログイン・AI のキー・AI が書いた譜面)、~/.cache/beatcode/、~/.local/share/beatcode/ のプラグイン、rc の補完の 2 行、スキルとそのリンク、バイナリ。",
          "何を消すかを聞き、消す前に一覧を見せて確かめます。",
        ],
        cmd: "/beatcode-teardown",
        shots: [],
      },
      {
        id: "work",
        menu: "/beatcode-work",
        title: "/beatcode-work",
        body: [
          "Claude Code に仕事を頼んで、そのまま遊んでいられます。/beatcode-work <仕事> はいつもどおり仕事をこなし、終わると、顔文字が「<ディレクトリの名前>: <何が終わったか>」を引いてわっしょいの枠を流れます。プレイ中にも、曲選びのジャケットやコードの下にも出ます。うまくいかなかったときも、そう知らせます。",
          "途中で止まったときも分かります。何かを聞く前に「質問があります — <1 問目>」、許可が要るときに「許可を待っています — <Claude Code の知らせの文>」。どちらも仕事の間だけなので、普段のやり取りでは流れません。",
          "わっしょいが出ていない画面(結果の画面・高さ 30 行より低い端末・[effects] crowd = false)では溜めておき、曲選びの見出しの右に件数を出します。知らせを止めるときは config.toml の [effects] notices = false。",
          "/beatcode-work は毎回打つには長いので、短い名前を付けておくのがおすすめです。~/.claude/skills/ に bcw という名前でリンクを張ると、Claude Code から /bcw でも呼べます。このリンクは beatcode skills では張らないので、beatcode をやめるときは ~/.claude/skills/bcw を自分で消してください。",
        ],
        cmd: ["ln -s ~/.agents/skills/beatcode-work ~/.claude/skills/bcw", "/bcw 落ちているテストを直して"],
        shots: [
          {
            file: "notice",
            alt: "プレイ中の画面。下のわっしょいの枠の下の行を、顔文字が「api-server: 落ちていたテストを直しました」と引いて歩いている。ノーツは落ち続け、スコアに PERFECT と GREAT が出ている。",
            caption: "曲の途中、わっしょいの枠を流れる知らせ",
          },
        ],
      },
      {
        id: "notify",
        menu: "beatcode notify",
        title: "beatcode notify",
        body: [
          "/beatcode-work が使っている beatcode notify は、スクリプト・ビルド・ほかのエージェントなど、何からでも呼べます。1 回で 1 件置き、わっしょいが順に流します。",
          "--begin と --end <文> は、今のディレクトリの仕事の始まりと終わりの印です。--end は「<ディレクトリの名前>: <文>」も置きます。--hook は Claude Code の hook の JSON を読み、そのディレクトリに印があるときだけ知らせを置きます。",
        ],
        cmd: ['beatcode notify "ビルドが終わりました"', 'cargo build && beatcode notify "ビルド OK" || beatcode notify "ビルドが落ちました"'],
        shots: [],
      },
    ],
  },
};

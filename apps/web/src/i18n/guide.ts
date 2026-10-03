import type { Lang } from "./strings";

/** A screenshot in src/assets/guide/<lang>/<file>.png */
type Shot = { file: string; alt: string; caption: string; /** A portrait image (the X post), shown narrower. */ narrow?: boolean };

type Step = {
  id: string;
  /** Short name for the step menu. */
  menu: string;
  title: string;
  body: string[];
  /** Commands to type, shown above the keys. */
  cmd?: string | string[];
  /** What the command prints, shown under it. */
  out?: string[];
  /** A file to write (like compose.yaml), shown under its name without the prompt. */
  file?: { name: string; lines: string[] };
  keys?: [string, string][];
  /** A small reference table under the keys. */
  table?: { head: string[]; rows: string[][] };
  shots: Shot[];
  /** Show the recorded clip (public/guide/<lang>/play.mp4) in place of the first shot, which becomes its poster. */
  video?: { label: string };
};

export type Guide = {
  title: string;
  description: string;
  heading: string;
  lede: string;
  /** How the screenshots were taken; left out on a page without them. */
  recorded?: string;
  menuLabel: string;
  keysLabel: string;
  /** A link to the other guide page, after the last step. */
  next?: { href: string; label: string };
  steps: Step[];
};

export const guide: Record<Lang, Guide> = {
  en: {
    title: "Guide — beatcode",
    description: "How to play beatcode, screen by screen: song select, playing, results, lanes and difficulty, history and setup.",
    heading: "How to play",
    lede: "From song select to the results screen, then the settings worth knowing. Each step shows the screen you’ll see.",
    recorded:
      "Recorded with beatcode record, playing シャイニングスター (Shining Star, ♩=158, 4:36) by 魔王魂 through YouTube Music in the Pear Desktop app, with the bundled Rust charts. A small bot that reads the screen did the hitting, so the scores aren’t a person’s. Music: 魔王魂 (maou.audio).",
    menuLabel: "Steps",
    keysLabel: "Keys on this screen",
    next: { href: "guide/more/", label: "More: AI charts, gists, config.toml and languages →" },
    steps: [
      {
        id: "select",
        menu: "Pick a song",
        title: "Pick a song and a chart",
        body: [
          "Run beatcode with no arguments. Songs are top left, charts bottom left, and the code of the selected chart is on the right. Press / on songs to find one: typing filters by title and artist, and the last row searches all of YouTube Music (or Spotify).",
          "The bundled source has three songs in each of Rust, Python, Go, TypeScript, Ruby and PHP. Your local git repos and GitHub repos are other sources; switch with [ and ].",
        ],
        cmd: "beatcode",
        keys: [
          ["Tab", "Move between songs, charts and code"],
          ["↑ ↓", "Pick"],
          ["/", "Find a song (on songs)"],
          ["← →", "Language"],
          ["Space", "Play the selected pair now"],
          ["Enter", "On charts, choose what the lower right shows, then play"],
          ["Esc", "Back, or quit from the song list"],
        ],
        shots: [
          {
            file: "select",
            alt: "The song select screen: the songs are filtered by シャイニング, leaving one, シャイニングスター by 魔王魂 and 森田交一 (4:36). NORMAL and 4 lanes are highlighted, and the code of fizzbuzz.rs is on the right.",
            caption: "Songs filtered with / and シャイニング. The chart is fizzbuzz.rs, the first bundled Rust chart.",
          },
        ],
      },
      {
        id: "ready",
        menu: "Get ready",
        title: "Check your keys",
        body: [
          "The ready screen lists which key plays which kind of token. Press a lane’s key and it lights up, so you can check your keys arrive.",
          "Turn your Japanese input method off first. With it on, the keys never reach the game.",
        ],
        keys: [
          ["D F J K", "The four lanes: keyword, identifier, operator and bracket, literal"],
          ["↑ ↓", "Scroll speed, x0.5 to x4.0"],
          ["Space / Enter", "Start a four-beat count-in"],
          ["Esc", "Back to song select"],
        ],
        shots: [
          {
            file: "ready",
            alt: "The ready screen: シャイニングスター — 魔王魂, 森田交一 and 0:00 / 4:36 at the top, the glowing beatcode logo over the lanes, the key legend D keyword, F identifier, J operators and brackets, K literals, and Space / Enter to start. The panel shows NOTES 0/1240 and BPM 158.",
            caption: "The lanes are labelled KW, ID, OP and LIT across the top. The chart repeats until the song ends, so the 15-line fizzbuzz.rs comes to 1240 notes.",
          },
        ],
      },
      {
        id: "play",
        menu: "Play",
        title: "Hit each token on the line",
        body: [
          "Tokens fall down their lanes. Press the lane’s key as each one reaches the judgment line. The code on the right lights up as you play it, and the combo counts up in the middle of the lanes.",
          "PERFECT is within ±50 ms and scores 2, GREAT within ±110 ms scores 1, and anything later is a MISS. Esc pauses and asks whether to quit the song.",
        ],
        keys: [
          ["D F J K", "Hit"],
          ["Esc", "Pause"],
        ],
        video: { label: "A 12-second recording of the play screen with シャイニングスター playing: tokens fall and are hit on the judgment line while the combo climbs." },
        shots: [
          {
            file: "play",
            alt: "Twelve seconds into the song (0:12 / 4:36): a combo of 3 in the lanes, the score panel showing PERFECT 27 and MISS 8, and the played tokens highlighted in the code.",
            caption: "Twelve seconds of play, with the song: turn the sound on with the speaker button. The code on the right lights up as each token is hit. Music: 魔王魂.",
          },
        ],
      },
      {
        id: "result",
        menu: "Results",
        title: "Read the results",
        body: [
          "The rank runs from AAA down to F, from your share of the maximum score. The graph shows the score over the song, the strip below it each judgment in time, and the box on the left the best five plays of the same song and chart.",
          "After 30 notes or more, the bottom line shows your average timing. Press o to shift judgment by that much and keep it.",
        ],
        keys: [
          ["r", "Play it again"],
          ["f", "Favorite this combination"],
          ["x", "Share a result card on X"],
          ["q", "Back to song select"],
        ],
        shots: [
          {
            file: "result",
            alt: "The results screen for シャイニングスター: rank AA, score 2000 of 2458 (81.4%), PERFECT 1000, MISS 229, with the score graph and a strip of judgments on the right and the ranking at the lower left.",
            caption: "AA at 81.4%. Each slice of the strip stacks its judgments by share, MISS at the bottom, then GREAT, then PERFECT, so the red rises where the misses pile up.",
          },
        ],
      },
      {
        id: "share",
        menu: "Share on X",
        title: "Show it off on X",
        body: [
          "On the results screen, x draws a result card — a 1200×675 PNG with the rank, percentage, judgment counts, graph, difficulty, lanes and language — copies it to the clipboard and opens X’s post page with a draft. Paste the card with ⌘V, then post.",
          "The draft has the rank and score, the chart’s gist URL, the beatcode URL, a ranking line (bc1:…; [share] rank = false in config.toml leaves it out) and #beatcode. A bundled, AI or Gist chart that isn’t published yet asks secret or public and goes to a gist first. The card is also kept in ~/.cache/beatcode/share/.",
        ],
        keys: [
          ["x", "Make the card and open X (on the results screen)"],
          ["⌘ V", "Paste the card into the post"],
        ],
        shots: [
          {
            file: "share",
            narrow: true,
            alt: "A preview of the post from beatcode: Got AA (86.0% 2064/2398) on \"シャイニングスター\", the beatcode URL and #beatcode, with the result card attached showing the cover art, シャイニングスター by 魔王魂 and 森田交一, YouTube Music, NORMAL, 4 lanes, AA, 86.0%, PERFECT 1032, MISS 167, max combo 31 and the score graph.",
            caption: "The card is the one beatcode made for this play of シャイニングスター through YouTube Music; the post around it is a preview, not a screenshot of X. The chart came from a local repo, so there’s no chart link, and the ranking line is turned off. Music: 魔王魂 (maou.audio).",
          },
        ],
      },
      {
        id: "lanes",
        menu: "Lanes & HARD",
        title: "More lanes, harder charts",
        body: [
          "On song select, w switches between 4, 6 and 8 lanes, and d between NORMAL and HARD. More lanes split tokens into finer kinds.",
          "HARD packs the same tokens into 16th notes. Two tokens written with no space between them in different lanes come down together, and string literals of 12 characters or more become hold notes.",
        ],
        cmd: "beatcode src/main.rs --lanes 8 --hard",
        keys: [
          ["S D F J K L", "6 lanes: keyword, identifier and type, operator and punctuation, bracket, string, number and boolean"],
          ["A S D F J K L ;", "8 lanes: keyword, identifier, type, operator, bracket, string, number and boolean, punctuation"],
          ["w", "Lanes 4 / 6 / 8"],
          ["d", "NORMAL / HARD"],
        ],
        shots: [
          {
            file: "ready8",
            alt: "The ready screen on HARD with 8 lanes labelled KW, ID, TY, OP, brackets, STR, NUM and separators: A keyword, S identifier, D type, F operator, J bracket, K string, L numbers and booleans, ; separator. NOTES 0/2858.",
            caption: "HARD with 8 lanes: the same song now has 2858 notes instead of 1240.",
          },
          {
            file: "play8",
            alt: "Playing on 8 lanes labelled KW, ID, TY, OP, brackets, STR, NUM and punctuation, with the lanes of the keys being pressed lit up.",
            caption: "Eight lanes. The lit columns are the keys being pressed.",
          },
        ],
      },
      {
        id: "history",
        menu: "History",
        title: "Play one again from history",
        body: [
          "Press p on song select to list finished plays, newest first. A ★ marks your best for that song and chart.",
          "Enter asks what the lower right shows while you play, then starts the same song, chart, difficulty and lanes again. Plays of a file given on the command line aren’t kept.",
        ],
        keys: [
          ["p", "Open the history (on song select)"],
          ["Enter", "Play the same song and chart"],
          ["f", "Favorite; Tab shows favorites only"],
          ["Esc", "Back"],
        ],
        shots: [
          {
            file: "history",
            alt: "The history screen with one row: just now, AA 81.4%, N4, ★ ♫ シャイニング, Rust fizzbuzz.rs, with its code on the right.",
            caption: "One play so far.",
          },
          {
            file: "box",
            alt: "A dialog over the history: What should the lower right show while playing? Code is selected; the others are Cover art and Camera.",
            caption: "A song is playing, so Cover art can be picked too (with no song it’s dimmed).",
          },
        ],
      },
      {
        id: "setup",
        menu: "Setup",
        title: "Connect music and more",
        body: [
          "beatcode setup asks four things in turn: where songs play, which AI writes charts, the combo voice, and the display language. Pick with ↑ ↓ and Enter, or skip one with Esc.",
          "Spotify needs Premium. YouTube Music works through the Pear Desktop app. Not now keeps playing Silent.",
        ],
        cmd: "beatcode setup",
        keys: [
          ["↑ ↓", "Pick"],
          ["Enter", "Choose"],
          ["Esc", "Skip this one"],
        ],
        shots: [
          {
            file: "setup",
            alt: "beatcode setup asking where songs play: Spotify (needs Premium, not connected yet), YouTube Music (drives the Pear Desktop app), or Not now.",
            caption: "The first question. Run beatcode setup music to ask just this one again.",
          },
        ],
      },
    ],
  },
  ja: {
    title: "使い方 — beatcode",
    description: "beatcode の遊び方を画面つきで。曲選び・プレイ・結果・列と難しさ・履歴・setup。",
    heading: "使い方",
    lede: "曲選びから結果の画面まで。そのあと、知っておくと便利な設定。手順ごとに、実際の画面を載せています。",
    recorded:
      "画面は beatcode record で撮りました。曲は YouTube Music(アプリ Pear Desktop)で流した魔王魂の「シャイニングスター」(♩=158、4:36)、譜面は同梱の Rust です。叩いたのは画面を読む小さな bot なので、点数は人の腕前ではありません。音楽：魔王魂(maou.audio)。",
    menuLabel: "手順",
    keysLabel: "この画面のキー",
    next: { href: "guide/more/", label: "詳しい使い方: AI の譜面・gist・config.toml・言語 →" },
    steps: [
      {
        id: "select",
        menu: "曲を選ぶ",
        title: "曲と譜面を選ぶ",
        body: [
          "引数なしで beatcode を打ちます。左上が曲、左下が譜面、右が選んだ譜面のコードです。曲は / で探せます。字を打つと曲名・アーティストで絞り込み、最後の行で YouTube Music(Spotify)全体を探します。",
          "同梱の譜面は Rust・Python・Go・TypeScript・Ruby・PHP に 3 曲ずつ。手元の git repo や GitHub の repo も譜面になります。出どころは [ と ] で替えます。",
        ],
        cmd: "beatcode",
        keys: [
          ["Tab", "曲 → 譜面 → コードと移る"],
          ["↑ ↓", "選ぶ"],
          ["/", "曲を探す(曲の欄で)"],
          ["← →", "言語"],
          ["Space", "選んでいる組み合わせをすぐ遊ぶ"],
          ["Enter", "譜面の上では、右下に出すものを選んでから遊ぶ"],
          ["Esc", "戻る。曲の一覧ではやめる"],
        ],
        shots: [
          {
            file: "select",
            alt: "曲選びの画面。曲の欄で「シャイニング」と絞り込み、シャイニングスター(魔王魂、森田交一、4:36)が 1 曲だけ出ている。NORMAL と 4 列が光り、右に fizzbuzz.rs のコード。",
            caption: "/ で「シャイニング」と打って絞り込んだところ。譜面は同梱の Rust の 1 曲目、fizzbuzz.rs。",
          },
        ],
      },
      {
        id: "ready",
        menu: "準備",
        title: "キーを確かめる",
        body: [
          "始める前の画面に、どのキーがどの種類のトークンかが出ます。列のキーを押すとその列が光るので、キーが届いているか確かめられます。",
          "日本語入力は英数にしておきます。日本語入力のままだと、キーがゲームに届きません。",
        ],
        keys: [
          ["D F J K", "4 つの列。キーワード・識別子・演算子と括弧・リテラル"],
          ["↑ ↓", "速さ。x0.5 から x4.0"],
          ["Space / Enter", "4 拍のカウントのあと始まる"],
          ["Esc", "曲選びに戻る"],
        ],
        shots: [
          {
            file: "ready",
            alt: "始める前の画面。上にシャイニングスター — 魔王魂、森田交一 と 0:00 / 4:36。列の上に beatcode のロゴ、D=キーワード F=識別子 J=演算子・括弧 K=リテラル、Space / Enter で始める。右の欄に NOTES 0/1240、BPM 158。",
            caption: "列の上に KW・ID・OP・LIT と種類が出ています。譜面は曲の終わりまでくり返すので、15 行の fizzbuzz.rs でも 1240 ノーツになります。",
          },
        ],
      },
      {
        id: "play",
        menu: "叩く",
        title: "判定ラインで叩く",
        body: [
          "トークンがそれぞれの列を落ちてきます。判定ラインに来たところで、その列のキーを押します。叩いたトークンは右のコードで光り、列の真ん中にコンボが出ます。",
          "±50ms 以内が PERFECT で 2 点、±110ms 以内が GREAT で 1 点、それより外れると MISS です。Esc で止まり、この曲をやめるか聞かれます。",
        ],
        keys: [
          ["D F J K", "叩く"],
          ["Esc", "一時停止"],
        ],
        video: { label: "シャイニングスターを流しながらプレイ中の画面を 12 秒録ったもの。トークンが落ちてきて判定ラインで叩かれ、コンボが増えていく。" },
        shots: [
          {
            file: "play",
            alt: "プレイ中、0:12 / 4:36。列に 3 コンボ、右の欄に PERFECT 27・MISS 8、叩いたトークンがコードの中で光っている。",
            caption: "プレイ中の 12 秒。曲の音つきです(スピーカーのボタンで鳴ります)。叩いたトークンが、右のコードで順に光っていきます。音楽：魔王魂。",
          },
        ],
      },
      {
        id: "result",
        menu: "結果",
        title: "結果を見る",
        body: [
          "ランクは満点に対する割合で AAA から F まで。右のグラフは曲の流れに沿った点数、その下の帯は判定を時間順に並べたもの、左の枠は同じ曲と譜面の上位 5 回です。",
          "30 ノーツ以上叩くと、下の行にずれの平均が出ます。o を押すと、その分だけ判定をずらして覚えておきます。",
        ],
        keys: [
          ["r", "もう一度"],
          ["f", "この組み合わせをお気に入りに"],
          ["x", "結果のカードを X に"],
          ["q", "曲選びに戻る"],
        ],
        shots: [
          {
            file: "result",
            alt: "結果の画面。シャイニングスター、ランク AA、SCORE 2032 / 2458(82.7%)、PERFECT 1016・MISS 213。右に曲の流れのグラフと判定の帯、左下にランキング。",
            caption: "82.7% で AA。帯は区切りごとの判定を割合で下から MISS・GREAT・PERFECT と積むので、MISS が多いところほど赤が高くなります。",
          },
        ],
      },
      {
        id: "share",
        menu: "X で見せびらかす",
        title: "X で見せびらかす",
        body: [
          "結果の画面で x を押すと、結果のカード(ランク・%・判定の数・グラフ・難しさ・列数・言語が入った 1200×675 の PNG)を作ってクリップボードに入れ、X の投稿画面を下書き入りで開きます。⌘V でカードを貼って投稿します。",
          "下書きには、ランクと点、譜面の gist の URL、beatcode の URL、ランキングの印(bc1: の行。config.toml の [share] rank = false で外せます)、#beatcode が入ります。同梱・AI・Gist の譜面でまだ公開していないものは、secret か public かを聞いて、先に gist へ公開します。カードは ~/.cache/beatcode/share/ にも残ります。",
        ],
        keys: [
          ["x", "カードを作って X を開く(結果の画面で)"],
          ["⌘ V", "投稿にカードを貼る"],
        ],
        shots: [
          {
            file: "share",
            narrow: true,
            alt: "beatcode の投稿のプレビュー。「シャイニングスター」で AA (83.7% | 2008/2398)を取りました、beatcode の URL、#beatcode。添えたカードにはジャケット、シャイニングスター(魔王魂、森田交一)、YouTube Music・NORMAL・4 LANES、AA・83.7%・PERFECT 1004・MISS 195・最大コンボ 23 と点数のグラフ。",
            caption: "カードは YouTube Music でシャイニングスターを流して遊んだときに beatcode が作ったもの。まわりの投稿は見え方のプレビューで、X の画面ではありません。譜面は手元の repo のものなので譜面のリンクはなく、ランキングの印は外しています。音楽：魔王魂(maou.audio)。",
          },
        ],
      },
      {
        id: "lanes",
        menu: "列と HARD",
        title: "列を増やす、HARD にする",
        body: [
          "曲選びで w を押すと 4 / 6 / 8 列、d で NORMAL / HARD が替わります。列が多いほど、トークンの種類が細かく分かれます。",
          "HARD は同じトークンを 16 分音符に詰めます。間に空白なしで書いた別の列のトークン 2 つは同時に落ち、12 文字以上の文字列は長押しになります。",
        ],
        cmd: "beatcode src/main.rs --lanes 8 --hard",
        keys: [
          ["S D F J K L", "6 列。キーワード・識別子と型・演算子と区切り・括弧・文字列・数値と真偽"],
          ["A S D F J K L ;", "8 列。キーワード・識別子・型・演算子・括弧・文字列・数値と真偽・区切り"],
          ["w", "4 / 6 / 8 列"],
          ["d", "NORMAL / HARD"],
        ],
        shots: [
          {
            file: "ready8",
            alt: "HARD・8 列の始める前の画面。列は KW・ID・TY・OP・括弧・STR・NUM・区切り、A=キーワード S=識別子 D=型 F=演算子 J=括弧 K=文字列 L=数値・真偽 ;=区切り。NOTES 0/2858。",
            caption: "HARD・8 列。同じ曲で、ノーツは 1240 から 2858 に増えます。",
          },
          {
            file: "play8",
            alt: "8 列でプレイ中。列は KW・ID・TY・OP・括弧・STR・NUM・区切り。押しているキーの列が光っている。",
            caption: "8 列。光っている列は、いま押しているキーの列です。",
          },
        ],
      },
      {
        id: "history",
        menu: "履歴",
        title: "履歴からもう一度",
        body: [
          "曲選びで p を押すと、遊び終えた回が新しい順に並びます。★ はその曲と譜面での自己ベストです。",
          "Enter で右下に出すものを聞かれ、同じ曲・譜面・難しさ・列数でもう一度始まります。コマンドでファイルを指定して遊んだ回は残りません。",
        ],
        keys: [
          ["p", "履歴を開く(曲選びで)"],
          ["Enter", "同じ曲と譜面で遊ぶ"],
          ["f", "お気に入り。Tab でお気に入りだけに"],
          ["Esc", "戻る"],
        ],
        shots: [
          {
            file: "history",
            alt: "遊んだ履歴の画面。1 行だけ:たった今、AA 82.7%、N4、★ ♫ シャイニング、Rust fizzbuzz.rs。右にそのコード。",
            caption: "まだ 1 回分。",
          },
          {
            file: "box",
            alt: "履歴の上に出た問い:プレイ中の右下に何を出しますか? コードを選んでいる。ほかにジャケット、インカメ。",
            caption: "曲を流しているので、ジャケットも選べます(無音のときは薄くなって選べません)。",
          },
        ],
      },
      {
        id: "setup",
        menu: "setup",
        title: "曲やほかの設定をつなぐ",
        body: [
          "beatcode setup は、曲を流す先・譜面を書く AI・コンボの声・表示の言語を順に聞きます。↑ ↓ と Enter で選び、Esc で飛ばせます。",
          "Spotify は Premium が要ります。YouTube Music はアプリ Pear Desktop を操ります。今はつながないを選べば、無音のまま遊べます。",
        ],
        cmd: "beatcode setup",
        keys: [
          ["↑ ↓", "選ぶ"],
          ["Enter", "決める"],
          ["Esc", "飛ばす"],
        ],
        shots: [
          {
            file: "setup",
            alt: "beatcode setup が曲を流す先を聞いている。Spotify(Premium が要ります・まだつないでいません)、YouTube Music(アプリ Pear Desktop を操ります)、今はつながない。",
            caption: "最初の質問。これだけ聞き直すときは beatcode setup music。",
          },
        ],
      },
    ],
  },
};

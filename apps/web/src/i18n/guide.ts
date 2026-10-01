import type { Lang } from "./strings";

/** A screenshot in src/assets/guide/<lang>/<file>.png */
type Shot = { file: string; alt: string; caption: string; /** A portrait image (the X post), shown narrower. */ narrow?: boolean };

type Step = {
  id: string;
  /** Short name for the step menu. */
  menu: string;
  title: string;
  body: string[];
  /** A command to type, shown above the keys. */
  cmd?: string;
  keys?: [string, string][];
  shots: Shot[];
  /** Show the recorded clip (public/guide/<lang>/play.mp4) in place of the first shot, which becomes its poster. */
  video?: { label: string };
};

export type Guide = {
  title: string;
  description: string;
  heading: string;
  lede: string;
  recorded: string;
  menuLabel: string;
  keysLabel: string;
  steps: Step[];
};

export const guide: Record<Lang, Guide> = {
  en: {
    title: "Guide — beatcode",
    description: "How to play beatcode, screen by screen: song select, playing, results, lanes and difficulty, history and setup.",
    heading: "How to play",
    lede: "From song select to the results screen, then the settings worth knowing. Each step shows the screen you’ll see.",
    recorded:
      "Recorded with beatcode record on a fresh install with no music connected, so every song here is Silent: no music, and the judgment line flashes on each beat.",
    menuLabel: "Steps",
    keysLabel: "Keys on this screen",
    steps: [
      {
        id: "select",
        menu: "Pick a song",
        title: "Pick a song and a chart",
        body: [
          "Run beatcode with no arguments. Songs are top left, charts bottom left, and the code of the selected chart is on the right.",
          "The bundled source has three songs in each of Rust, Python, Go, TypeScript, Ruby and PHP. Your local git repos and GitHub repos are other sources; switch with [ and ].",
        ],
        cmd: "beatcode",
        keys: [
          ["Tab", "Move between songs, charts and code"],
          ["↑ ↓", "Pick"],
          ["← →", "Language"],
          ["Space", "Play the selected pair now"],
          ["Enter", "On charts, choose what the lower right shows, then play"],
          ["Esc", "Back, or quit from the song list"],
        ],
        shots: [
          {
            file: "select",
            alt: "The song select screen: Silent at BPM 100 is selected, NORMAL and 4 lanes are highlighted, and the code of fizzbuzz.rs is on the right.",
            caption: "Song select with fizzbuzz.rs, the first bundled Rust chart.",
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
            alt: "The ready screen: the glowing beatcode logo over the lanes, the key legend D keyword, F identifier, J operators and brackets, K literals, and Space / Enter to start.",
            caption: "The lanes are labelled KW, ID, OP and LIT across the top.",
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
        video: { label: "A 12-second recording of the play screen: tokens fall and are hit on the judgment line while the combo climbs." },
        shots: [
          {
            file: "play",
            alt: "Twelve seconds in: a combo of 13 in the lanes, the score panel showing PERFECT 24 and MISS 5, and the played tokens highlighted in the code.",
            caption: "Twelve seconds of play. The code on the right lights up as each token is hit.",
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
            alt: "The results screen: rank AAA, score 152 of 166 (91.6%), PERFECT 76, MISS 7, with the score graph and a strip of judgments on the right.",
            caption: "AAA at 91.6%. The red marks in the strip are the seven misses.",
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
            alt: "A preview of the post from beatcode: Got AA (85.5% 2052/2398) on \"シャイニングスター\", the beatcode URL and #beatcode, with the result card attached showing the cover art, シャイニングスター by 魔王魂 and 森田交一, YouTube Music, NORMAL, 4 lanes, AA, 85.5%, PERFECT 1026, MISS 173, max combo 31 and the score graph.",
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
            file: "select8",
            alt: "Song select with HARD and 8 lanes highlighted. fizzbuzz.rs now shows 83 notes in 0:15.",
            caption: "HARD and 8 lanes: the same 83 notes in half the time.",
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
            alt: "The history screen with one row: just now, AAA 91.6%, 4 lanes, Silent at BPM 100, Rust fizzbuzz.rs, with its code on the right.",
            caption: "One play so far.",
          },
          {
            file: "box",
            alt: "A dialog over the history: What should the lower right show while playing? Code is selected; Cover art is dimmed, only with a song; Camera.",
            caption: "Cover art needs a song, so it’s dimmed while playing Silent.",
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
      "画面は、曲をつないでいない入れたての状態で beatcode record を使って撮りました。なので曲はすべて無音です(曲は流さず、判定ラインが拍の頭で光ります)。",
    menuLabel: "手順",
    keysLabel: "この画面のキー",
    steps: [
      {
        id: "select",
        menu: "曲を選ぶ",
        title: "曲と譜面を選ぶ",
        body: [
          "引数なしで beatcode を打ちます。左上が曲、左下が譜面、右が選んだ譜面のコードです。",
          "同梱の譜面は Rust・Python・Go・TypeScript・Ruby・PHP に 3 曲ずつ。手元の git repo や GitHub の repo も譜面になります。出どころは [ と ] で替えます。",
        ],
        cmd: "beatcode",
        keys: [
          ["Tab", "曲 → 譜面 → コードと移る"],
          ["↑ ↓", "選ぶ"],
          ["← →", "言語"],
          ["Space", "選んでいる組み合わせをすぐ遊ぶ"],
          ["Enter", "譜面の上では、右下に出すものを選んでから遊ぶ"],
          ["Esc", "戻る。曲の一覧ではやめる"],
        ],
        shots: [
          {
            file: "select",
            alt: "曲選びの画面。無音 BPM 100 を選び、NORMAL と 4 列が光っている。右に fizzbuzz.rs のコード。",
            caption: "同梱の Rust の 1 曲目、fizzbuzz.rs を選んだところ。",
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
            alt: "始める前の画面。列の上に beatcode のロゴ、D=キーワード F=識別子 J=演算子・括弧 K=リテラル、Space / Enter で始める。",
            caption: "列の上に KW・ID・OP・LIT と種類が出ています。",
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
        video: { label: "プレイ中の画面を 12 秒録ったもの。トークンが落ちてきて判定ラインで叩かれ、コンボが増えていく。" },
        shots: [
          {
            file: "play",
            alt: "プレイ中。列に 13 コンボ、右の欄に PERFECT 24・MISS 5、叩いたトークンがコードの中で光っている。",
            caption: "プレイ中の 12 秒。叩いたトークンが、右のコードで順に光っていきます。",
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
            alt: "結果の画面。ランク AAA、SCORE 152 / 166(91.6%)、PERFECT 76・MISS 7。右に曲の流れのグラフと判定の帯。",
            caption: "91.6% で AAA。帯の赤が 7 つの MISS です。",
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
            alt: "beatcode の投稿のプレビュー。「シャイニングスター」で AA (84.6% | 2030/2398)を取りました、beatcode の URL、#beatcode。添えたカードにはジャケット、シャイニングスター(魔王魂、森田交一)、YouTube Music・NORMAL・4 LANES、AA・84.6%・PERFECT 1015・MISS 184・最大コンボ 40 と点数のグラフ。",
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
            file: "select8",
            alt: "曲選びで HARD と 8 列が光っている。fizzbuzz.rs は 83 notes・0:15 になった。",
            caption: "HARD・8 列。同じ 83 ノーツが半分の長さに詰まります。",
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
            alt: "遊んだ履歴の画面。1 行だけ:たった今、AAA 91.6%、4 列、無音 BPM 100、Rust fizzbuzz.rs。右にそのコード。",
            caption: "まだ 1 回分。",
          },
          {
            file: "box",
            alt: "履歴の上に出た問い:プレイ中の右下に何を出しますか? コードを選んでいる。ジャケットは曲を流すときだけなので薄い。インカメ。",
            caption: "ジャケットは曲を流すときだけ。無音では選べません。",
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

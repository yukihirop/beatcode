import type { Guide } from "./guide";
import type { Lang } from "./strings";

// The fourth guide page: running the ranking server beatcode sends plays to, from its image on GHCR.
// The same as beatcode-private's docs/ranking-server.md; the image is built by beatcode-private-tools.
const image = "ghcr.io/yukihirop/beatcode-ranking";
// The whole site in one file, for the agent to read first
const llmsFull = `${(import.meta.env.SITE ?? "https://stg-ngk7v9hb.vercel.app").replace(/\/?$/, "/")}llms-full.txt`;

const compose = [
  "services:",
  "  ranking:",
  `    image: ${image}:latest`,
  "    restart: unless-stopped",
  "    environment:",
  "      PUBLIC_URL: https://ranking.example.com",
  "    ports:",
  '      - "8080:8787"',
  "    volumes:",
  "      - ranking-data:/data",
  "",
  "volumes:",
  "  ranking-data:",
];
const run = `docker run -d --name beatcode-ranking --restart unless-stopped -p 8080:8787 -v beatcode-ranking:/data ${image}:latest`;
const login = "gh auth token | docker login ghcr.io -u <your GitHub login> --password-stdin";
const config = ["[share]", 'ranking_server_url = "https://ranking.example.com"'];
// A Raspberry Pi at home, reached only through a Cloudflare Tunnel: no ports published, on the Pi or the router
const piCompose = [
  "services:",
  "  ranking:",
  `    image: ${image}:latest`,
  "    restart: unless-stopped",
  "    environment:",
  "      PUBLIC_URL: https://ranking.example.com",
  "    volumes:",
  "      - /mnt/ssd/beatcode-ranking:/data",
  "  cloudflared:",
  "    image: cloudflare/cloudflared:latest",
  "    restart: unless-stopped",
  "    command: tunnel --no-autoupdate run",
  "    environment:",
  "      TUNNEL_TOKEN: ${TUNNEL_TOKEN}",
];
const piCmds = [
  "curl -fsSL https://get.docker.com | sh",
  "echo <token with read:packages> | docker login ghcr.io -u <your GitHub login> --password-stdin",
  "echo 'TUNNEL_TOKEN=<the tunnel token>' > .env && chmod 600 .env",
  "docker compose up -d",
  "curl https://ranking.example.com/healthz",
];

export const guideRankingServer: Record<Lang, Guide> = {
  en: {
    title: "Ranking server — beatcode",
    description: "Run your own ranking server for beatcode from one Docker image: the ranking page and the API, with the plays in SQLite.",
    heading: "Ranking server",
    lede: "Put a ranking server in config.toml and beatcode sends each finished play to it. The server is one Docker image: the ranking page and the API on one address, with the plays in one SQLite file.",
    recorded: "The screenshots were taken from a ranking server running on this machine, filled with made-up plays (pnpm db:seed). The players are not real accounts.",
    menuLabel: "Topics",
    keysLabel: "Keys on this screen",
    next: { href: "guide/", label: "← How to play: one song from start to finish" },
    steps: [
      {
        id: "page",
        menu: "What you get",
        title: "What you get",
        body: [
          "Every chart anyone plays gets its own board. The page lists them with the song’s cover, how many have played and when, and you can narrow them to Spotify, YouTube Music or silent play.",
          "A board puts the top three on a podium with their score, accuracy and grade, and the rest in a table with their judgements and max combo. When the chart came from a gist, the play preview plays the notes by itself, and Play this chart copies the chart’s gist URL: press G on beatcode’s song select and paste it to play the same chart.",
          "Each player has a page with their best on every chart and where it ranks. Press R on beatcode’s result screen to jump straight to the board the play went on.",
        ],
        shots: [
          { file: "ranking-list", alt: "The ranking page listing charts with covers, sources, difficulty, lanes, player avatars and how long ago they were played", caption: "The list of boards, newest play first" },
          { file: "ranking-board", alt: "A board for Never Gonna Give You Up on HARD with 8 lanes: a podium for the top three and a table for 4th to 7th", caption: "A board: the podium and the rest of the ranking" },
          { file: "ranking-preview", alt: "A board with the play preview: notes falling down four lanes KW, ID, OP and LIT, with PERFECT and the combo in the middle", caption: "The play preview of a chart from a gist" },
          { file: "ranking-player", alt: "A player page with the pixel avatar, the number of charts and plays, and their best on each chart with its rank", caption: "A player’s bests and ranks" },
        ],
      },
      {
        id: "agent",
        menu: "Let an agent do it",
        title: "Let a coding agent set it up",
        body: [
          "Copy this prompt into a coding agent (Claude Code, Codex and the like) on the machine that will run the server, or the one you reach it from. It reads this site, asks where to run it, writes the compose file and points your beatcode at it.",
          "It asks before starting anything, and leaves the sign-ins (gh, beatcode setup rank) and the Cloudflare tunnel token for you. Tokens are only checked for, never read.",
        ],
        file: {
          name: "Prompt for your coding agent",
          copy: true,
          lines: [
            "Set up a ranking server for beatcode, a rhythm game that runs in the terminal, and point my beatcode at it.",
            "",
            `1. Read ${llmsFull} first. It is the whole beatcode site; follow its Ranking server page.`,
            "2. Ask me where to run it: on this machine with Docker, on a Raspberry Pi with Cloudflare Tunnel, or on a hosting service. Ask for the https address people will open (PUBLIC_URL) too, if there is one.",
            "3. Look without changing anything: whether docker and docker compose work, whether gh is signed in with the read:packages scope (gh auth status), and my ~/.config/beatcode/config.toml.",
            "4. The image ghcr.io/yukihirop/beatcode-ranking is private. If the scope is missing, give me gh auth refresh -s read:packages to run myself, then sign docker in to GHCR without printing the token.",
            "5. Write compose.yaml as the page shows, with /data on a volume (on a Raspberry Pi, on a USB SSD). For Cloudflare Tunnel, make .env readable only by me (chmod 600) and let me paste the tunnel token into it myself. Show me the file and ask before starting it, then check that /healthz answers {\"ok\":true}.",
            "6. Add ranking_server_url under [share] in my config.toml (read it first and add to [share] if it is there), then run beatcode --help to check it still loads.",
            "7. Give me beatcode setup rank to run myself. It signs in on github.com.",
            "8. Never read or print tokens: gh's, the tunnel's or beatcode's. Only check whether they exist.",
            "9. At the end, tell me the page's address, where ranking.db is and how to back it up, and anything left undone.",
          ],
        },
        shots: [],
      },
      {
        id: "login",
        menu: "Sign in to GHCR",
        title: "Sign in to GHCR",
        body: [
          `The image is ${image} on GitHub’s container registry. It is private for now, so pulling it needs access to the package and a sign-in with a token that can read packages.`,
          "With gh, add the read:packages scope once (gh auth refresh -s read:packages), then hand its token to docker.",
        ],
        cmd: ["gh auth refresh -s read:packages", login],
        shots: [],
      },
      {
        id: "run",
        menu: "Run it",
        title: "Run it",
        body: [
          "One container is the whole ranking. Open http://localhost:8080 for the page. The plays are kept in the volume at /data; without it, they go when the container does.",
          "There is no database to run beside it: the server reads and writes /data/ranking.db, an SQLite file, itself.",
        ],
        cmd: run,
        shots: [],
      },
      {
        id: "compose",
        menu: "With Docker Compose",
        title: "With Docker Compose",
        body: ["The same in a compose.yaml, with PUBLIC_URL set. Start it with docker compose up -d."],
        file: { name: "compose.yaml", lines: compose },
        cmd: "docker compose up -d",
        shots: [],
      },
      {
        id: "settings",
        menu: "Settings",
        title: "Settings",
        body: [
          "The server is plain HTTP. For HTTPS, put your own proxy (Caddy, nginx or a hosting service’s) in front of it and set PUBLIC_URL to the https address.",
          "beatcode sends the player’s GitHub token (read:user only, from beatcode setup rank) with each play, so serve it over HTTPS anywhere but your own machine.",
        ],
        table: {
          head: ["Variable", "Default", "Meaning"],
          rows: [
            ["PUBLIC_URL", "none", "Where people open the page. The links in a board’s card (the picture X shows under a shared board) start with it. Left out, the address the request came to is used, which is http:// behind an HTTPS proxy"],
            ["PORT", "8787", "The port the server listens on inside the container. Most hosting services set it"],
            ["GITHUB_API_URL", "https://api.github.com", "Where the server asks whose token a play came with, and reads gists"],
            ["SHOW_SECRET_GISTS", "none", "1 links a board to the beatmap gist its play preview comes from even when the gist is secret (beatcode makes a secret one when it sends a play). Anyone who opens the board can then open the gist, so set it only for a ranking only people you know open"],
          ],
        },
        shots: [],
      },
      {
        id: "beatcode",
        menu: "Send plays to it",
        title: "Send plays to it",
        body: [
          "Put the page’s address in config.toml. Each time you finish a song, the results screen sends the play and says how it went; R there opens the board it went on.",
          "Then sign in once with beatcode setup rank (a code to enter on github.com). The token it gets can only read your profile (read:user), but it goes to that server, so only put in a server you trust.",
        ],
        file: { name: "~/.config/beatcode/config.toml", lines: config },
        shots: [],
      },
      {
        id: "host",
        menu: "On a hosting service",
        title: "On a hosting service",
        body: [
          `A host that runs a Docker image can run it as is: the image ${image}, a volume (a persistent disk) at /data, and PUBLIC_URL. While the image is private, the host needs a sign-in to GHCR too.`,
          "SQLite is one file on that one disk, so run one copy, not several.",
        ],
        shots: [],
      },
      {
        id: "pi",
        menu: "Raspberry Pi + Cloudflare Tunnel",
        title: "On a Raspberry Pi with Cloudflare Tunnel",
        body: [
          "A Raspberry Pi 4 or 5 with a 64-bit OS runs the image too: it is built for arm64. A Cloudflare Tunnel gives it an https address without opening a port on the Pi or your router, and keeps your home IP out of sight. It needs a domain on Cloudflare; a Quick Tunnel (trycloudflare.com) changes its address every time, so it doesn’t suit a ranking.",
          "In Cloudflare’s dashboard, create a tunnel under Networking → Tunnels, pick Docker and keep only the token from the command it shows. Then add a route: Published application, your subdomain and domain, and the service URL http://ranking:8787 — the service name and port inside the compose file below.",
          "The compose file has no ports at all: the tunnel is the only way in. Keep the token in .env next to it, readable only by you. Put /data on a USB SSD rather than the SD card, which wears out under SQLite’s writes, and copy ranking.db somewhere else now and then (Update and back up, below). With restart: unless-stopped, both come back on their own after a power cut.",
        ],
        cmd: piCmds,
        file: { name: "compose.yaml", lines: piCompose },
        shots: [],
      },
      {
        id: "update",
        menu: "Update and back up",
        title: "Update and back up",
        body: [
          "The server makes its tables match the schema each time it starts, so pulling the new image and starting it again is the update. Versions are tagged (0.1.0); latest is the newest.",
          "Every play is in /data/ranking.db. Copy it out while nothing is being sent. docker compose down -v removes the volume and every play with it.",
        ],
        cmd: ["docker compose pull && docker compose up -d", "docker compose cp ranking:/data/ranking.db ./ranking.db"],
        shots: [],
      },
    ],
  },
  ja: {
    title: "ランキングサーバー — beatcode",
    description: "beatcode のランキングのサーバーを、Docker の image 1 つで自分で立てます。ランキングのページと API、記録は SQLite に。",
    heading: "ランキングサーバー",
    lede: "config.toml にランキングのサーバーを書くと、遊び終えるたびに beatcode が記録をそこへ送ります。サーバーは Docker の image 1 つで、ランキングのページと API を 1 つのアドレスで出し、記録は SQLite の 1 つのファイルに置きます。",
    recorded: "スクリーンショットは手元で動かしたランキングサーバーに、作り物の記録(pnpm db:seed)を入れて撮りました。プレイヤーは実在のアカウントではありません。",
    menuLabel: "項目",
    keysLabel: "この画面のキー",
    next: { href: "guide/", label: "← 使い方: 1 曲を通して遊ぶ流れ" },
    steps: [
      {
        id: "page",
        menu: "どんなページか",
        title: "どんなページか",
        body: [
          "誰かが遊んだ譜面ごとに、ボードが 1 つできます。一覧には曲のジャケット・遊んだ人数・最後に遊ばれた時が並び、Spotify・YouTube Music・無音で絞れます。",
          "ボードでは上位 3 人が表彰台に立ち、点・精度・ランクが出ます。4 位から下は、判定の割合と最大コンボの表です。gist から取った譜面なら、プレイプレビューでノーツが自動で流れ、「この曲で遊ぶ」で譜面の gist の URL をコピーできます。beatcode の曲選びで G を押して貼れば、同じ譜面で遊べます。",
          "プレイヤーごとのページには、譜面ごとの自己ベストと順位が並びます。beatcode の結果の画面で R を押せば、その記録が載ったボードへすぐ飛べます。",
        ],
        shots: [
          { file: "ranking-list", alt: "ランキングの一覧。曲のジャケット・出どころ・難しさ・列の数・遊んだ人のアイコン・何時間前かが並ぶ", caption: "ボードの一覧(最近遊ばれた順)" },
          { file: "ranking-board", alt: "Never Gonna Give You Up の HARD・8 列のボード。上位 3 人の表彰台と、4〜7 位の表", caption: "ボード: 表彰台と、その下の順位" },
          { file: "ranking-preview", alt: "プレイプレビューのあるボード。KW・ID・OP・LIT の 4 列にノーツが落ち、真ん中に PERFECT とコンボ数", caption: "gist から取った譜面のプレイプレビュー" },
          { file: "ranking-player", alt: "プレイヤーのページ。ドット絵のアイコン・譜面の数とプレイ回数・譜面ごとの自己ベストと順位", caption: "プレイヤーの自己ベストと順位" },
        ],
      },
      {
        id: "agent",
        menu: "エージェントに任せる",
        title: "コーディングエージェントに任せる",
        body: [
          "サーバーを動かすマシン(か、そこへつなぐマシン)のコーディングエージェント(Claude Code・Codex など)に、このプロンプトを渡します。このサイトを読み、どこで動かすかを聞き、compose を書いて、beatcode の送り先まで設定してくれます。",
          "何かを起動する前には聞きます。サインイン(gh・beatcode setup rank)と Cloudflare のトンネルのトークンは自分で入れるよう案内します。トークンはあるかどうかを見るだけで、中身は読みません。",
        ],
        file: {
          name: "コーディングエージェントに渡すプロンプト",
          copy: true,
          lines: [
            "ターミナルで動く音ゲー beatcode のランキングサーバーを立てて、私の beatcode の記録をそこへ送るようにしてください。",
            "",
            `1. まず ${llmsFull} を読んでください。beatcode のサイト全部です。その中のランキングサーバーのページに従ってください。`,
            "2. どこで動かすかを聞いてください: このマシンの Docker・Raspberry Pi と Cloudflare Tunnel・ホスティングのサービス。人が開く https のアドレス(PUBLIC_URL)があれば、それも聞いてください。",
            "3. 何も変えずに見てください: docker と docker compose が動くか、gh が read:packages の権限付きでサインインしているか(gh auth status)、~/.config/beatcode/config.toml の中身。",
            "4. image の ghcr.io/yukihirop/beatcode-ranking は private です。権限が足りなければ gh auth refresh -s read:packages を私が打つよう教え、そのあと docker を GHCR にサインインさせてください(トークンは出さない)。",
            "5. ページのとおりに compose.yaml を書いてください。/data は volume に(Raspberry Pi なら USB の SSD に)。Cloudflare Tunnel なら .env を私だけが読めるように作り(chmod 600)、トンネルのトークンは私が貼ります。ファイルを見せて、起動する前に聞いてください。起動したら /healthz が {\"ok\":true} を返すか確かめてください。",
            "6. config.toml の [share] に ranking_server_url を足してください(先に中身を読み、[share] があればそこに足す)。足したら beatcode --help で読めるか確かめてください。",
            "7. beatcode setup rank は私が打つよう教えてください。github.com でサインインします。",
            "8. トークン(gh・トンネル・beatcode のもの)の中身は読まない・出さないでください。あるかどうかだけを見てください。",
            "9. 最後に、ページのアドレス・ranking.db の場所とバックアップの取り方・済んでいないことを教えてください。",
          ],
        },
        shots: [],
      },
      {
        id: "login",
        menu: "GHCR にサインイン",
        title: "GHCR にサインイン",
        body: [
          `image は GitHub のコンテナレジストリの ${image} です。いまは private なので、取ってくるにはパッケージを読める権限と、packages を読めるトークンでのサインインが要ります。`,
          "gh なら、一度 read:packages の権限を足して(gh auth refresh -s read:packages)、そのトークンを docker に渡します。",
        ],
        cmd: ["gh auth refresh -s read:packages", "gh auth token | docker login ghcr.io -u <GitHub の login> --password-stdin"],
        shots: [],
      },
      {
        id: "run",
        menu: "動かす",
        title: "動かす",
        body: [
          "コンテナ 1 つでランキングのすべてです。http://localhost:8080 でページが開きます。記録は /data の volume に残ります。volume を付けないと、コンテナを消したときに記録も消えます。",
          "横に動かすデータベースはありません。サーバーが /data/ranking.db(SQLite のファイル)に自分で読み書きします。",
        ],
        cmd: run,
        shots: [],
      },
      {
        id: "compose",
        menu: "Docker Compose で",
        title: "Docker Compose で",
        body: ["同じものを compose.yaml に書き、PUBLIC_URL も付けた形です。docker compose up -d で起動します。"],
        file: { name: "compose.yaml", lines: compose },
        cmd: "docker compose up -d",
        shots: [],
      },
      {
        id: "settings",
        menu: "設定",
        title: "設定",
        body: [
          "サーバーは HTTP だけです。HTTPS にするには、前に自分のプロキシ(Caddy・nginx・ホスティングのサービスのもの)を置き、PUBLIC_URL を https のアドレスにします。",
          "beatcode は遊んだ人の GitHub のトークン(beatcode setup rank で取った read:user だけのもの)を記録と一緒に送るので、自分のマシンの中以外では HTTPS で出してください。",
        ],
        table: {
          head: ["環境変数", "既定", "意味"],
          rows: [
            ["PUBLIC_URL", "なし", "人がページを開くアドレス。ボードのカード(X で共有したボードの下に出る画像)のリンクはこれで始まる。書かなければ来たリクエストのアドレスを使い、HTTPS のプロキシの後ろでは http:// になる"],
            ["PORT", "8787", "コンテナの中でサーバーが待つポート。ホスティングのサービスはたいてい自分で決める"],
            ["GITHUB_API_URL", "https://api.github.com", "記録に付いてきたトークンが誰のものかを聞き、gist を読む先"],
            ["SHOW_SECRET_GISTS", "なし", "1 にすると、プレイプレビューの元の譜面の gist が secret でも、ボードに gist へのリンクと「この曲で遊ぶ」を出す(beatcode は記録を送るとき secret の gist を作る)。ボードを開いた人は誰でもその gist を開けるので、知り合いだけが開くランキングでだけ使う"],
          ],
        },
        shots: [],
      },
      {
        id: "beatcode",
        menu: "記録を送る",
        title: "記録を送る",
        body: [
          "config.toml にページのアドレスを書きます。遊び終えるたびに結果の画面が記録を送り、どうなったかを出します。そこで R を押すと、記録が載ったボードのページが開きます。",
          "そのあと一度 beatcode setup rank でサインインします(github.com でコードを打つ)。取ったトークンはプロフィールを読めるだけ(read:user)ですが、そのサーバーへ渡るので、書くのは信用できるサーバーだけにしてください。",
        ],
        file: { name: "~/.config/beatcode/config.toml", lines: config },
        shots: [],
      },
      {
        id: "host",
        menu: "ホスティング",
        title: "ホスティングのサービスで",
        body: [
          `Docker の image を動かせるサービスなら、そのまま動きます。image に ${image}、/data に volume(消えないディスク)、それに PUBLIC_URL。image が private の間は、サービスにも GHCR へのサインインが要ります。`,
          "SQLite はそのディスクの上の 1 つのファイルなので、動かすのは 1 つだけにして、複数にしないでください。",
        ],
        shots: [],
      },
      {
        id: "pi",
        menu: "ラズパイ + Cloudflare Tunnel",
        title: "ラズパイと Cloudflare Tunnel で",
        body: [
          "64 ビットの OS の Raspberry Pi 4 / 5 でも、image はそのまま動きます(arm64 でも作っています)。Cloudflare Tunnel を使えば、Pi にもルーターにもポートを開けずに https のアドレスを持て、家の IP も表に出ません。Cloudflare に載せたドメインが要ります。ドメイン無しの Quick Tunnel(trycloudflare.com)は作るたびにアドレスが変わるので、ランキングには向きません。",
          "Cloudflare のダッシュボードの Networking → Tunnels でトンネルを作り、Docker を選んで、出てくるコマンドのトークンだけを控えます。続けて Route を足します。Published application で、サブドメインとドメイン、サービスの URL は http://ranking:8787(下の compose の中のサービス名とポート)です。",
          "compose には ports を書きません。入口はトンネルだけです。トークンは同じ場所の .env に置き、自分だけが読めるようにします。/data は SD カードではなく USB の SSD に置いてください(SQLite の書き込みで SD カードは傷みます)。ranking.db はときどき別の場所へ写します(下の「新しくする・バックアップ」)。restart: unless-stopped なので、停電のあとも両方とも自分で戻ります。",
        ],
        cmd: piCmds,
        file: { name: "compose.yaml", lines: piCompose },
        shots: [],
      },
      {
        id: "update",
        menu: "新しくする・バックアップ",
        title: "新しくする・バックアップ",
        body: [
          "サーバーは起動のたびに表をスキーマに合わせるので、新しい image を取ってきて起動し直せば新しくなります。版ごとに tag があり(0.1.0)、latest がいちばん新しい版です。",
          "記録はすべて /data/ranking.db にあります。何も送られていない間に取り出します。docker compose down -v は volume ごと、記録をすべて消します。",
        ],
        cmd: ["docker compose pull && docker compose up -d", "docker compose cp ranking:/data/ranking.db ./ranking.db"],
        shots: [],
      },
    ],
  },
};

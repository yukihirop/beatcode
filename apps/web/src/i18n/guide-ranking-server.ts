import type { Guide } from "./guide";
import type { Lang } from "./strings";

// The fourth guide page: running the ranking server beatcode sends plays to, from its image on GHCR.
// The same as beatcode-private's docs/ranking-server.md; the image is built by beatcode-private-tools.
const image = "ghcr.io/yukihirop/beatcode-ranking";

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

export const guideRankingServer: Record<Lang, Guide> = {
  en: {
    title: "Ranking server — beatcode",
    description: "Run your own ranking server for beatcode from one Docker image: the ranking page and the API, with the plays in SQLite.",
    heading: "Ranking server",
    lede: "Put a ranking server in config.toml and beatcode sends each finished play to it. The server is one Docker image: the ranking page and the API on one address, with the plays in one SQLite file.",
    menuLabel: "Topics",
    keysLabel: "Keys on this screen",
    next: { href: "guide/", label: "← How to play: one song from start to finish" },
    steps: [
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
          "beatcode sends the player’s GitHub token (gh auth token) with each play, so serve it over HTTPS anywhere but your own machine.",
        ],
        table: {
          head: ["Variable", "Default", "Meaning"],
          rows: [
            ["PUBLIC_URL", "none", "Where people open the page. The links in a board’s card (the picture X shows under a shared board) start with it. Left out, the address the request came to is used, which is http:// behind an HTTPS proxy"],
            ["PORT", "8787", "The port the server listens on inside the container. Most hosting services set it"],
            ["GITHUB_API_URL", "https://api.github.com", "Where the server asks whose token a play came with, and reads gists"],
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
          "Only put in a server you trust: it gets your GitHub token.",
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
    menuLabel: "項目",
    keysLabel: "この画面のキー",
    next: { href: "guide/", label: "← 使い方: 1 曲を通して遊ぶ流れ" },
    steps: [
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
          "beatcode は遊んだ人の GitHub のトークン(gh auth token)を記録と一緒に送るので、自分のマシンの中以外では HTTPS で出してください。",
        ],
        table: {
          head: ["環境変数", "既定", "意味"],
          rows: [
            ["PUBLIC_URL", "なし", "人がページを開くアドレス。ボードのカード(X で共有したボードの下に出る画像)のリンクはこれで始まる。書かなければ来たリクエストのアドレスを使い、HTTPS のプロキシの後ろでは http:// になる"],
            ["PORT", "8787", "コンテナの中でサーバーが待つポート。ホスティングのサービスはたいてい自分で決める"],
            ["GITHUB_API_URL", "https://api.github.com", "記録に付いてきたトークンが誰のものかを聞き、gist を読む先"],
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
          "書くのは信用できるサーバーだけにしてください。GitHub のトークンがそこへ渡ります。",
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

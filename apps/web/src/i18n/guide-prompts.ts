import type { Guide } from "./guide";
import type { Lang } from "./strings";

// The prompts page: how to write your own prompt for AI charts. Not in the header's menu; the settings page and the AI section of "More" point here.
// Everything here is what beatcode does (src/ai.rs, crates/beatcode-plugin-prompt-xray); the advice marked as seen once is from our own tries, not a measurement.
const minimal = [
  "---",
  "name: Festival",
  "description: a loud, crowded scene",
  "---",
  "You write {lang} code that becomes a rhythm game chart: each token falls as a note.",
  "The theme is {topic}. Let the energy of the song show in the subject and the shape of the code.",
  "Use English identifiers.",
  "",
  "{xray}",
];

export const guidePrompts: Record<Lang, Guide> = {
  en: {
    title: "Writing prompts — beatcode",
    description: "How to write your own prompt for AI charts: where {xray} goes, what beatcode adds for you, how to read the text that is actually sent, and what to avoid.",
    heading: "Writing prompts",
    lede: "The prompts for AI charts are Markdown files you can write yourself. This page is about writing a good one: what beatcode already sends, where the song X-ray goes, and how to read the exact text before spending a request on it.",
    menuLabel: "Topics",
    keysLabel: "Keys",
    next: { href: "guide/config/", label: "← Settings: every section of config.toml" },
    steps: [
      {
        id: "start",
        menu: "Start",
        title: "Start from a bundled prompt",
        body: [
          "Don’t begin from a blank page. beatcode prompts new --template mood opens a draft of a bundled prompt in $EDITOR, with the replacements explained in comments. Save and close, name it, and it shows up in the topic box. beatcode prompts edit <name> changes one you have.",
          "The file format, the keys (name, description, model, effort, length, lang, kind) and the replacements like {lang} and {topic} are on the settings page, under “AI prompts”.",
        ],
        cmd: ["beatcode prompts new --template mood", "beatcode prompts edit mood"],
        shots: [],
      },
      {
        id: "see",
        menu: "Read what is sent",
        title: "Read the text that is actually sent",
        body: [
          "What you write is not all that is sent: beatcode adds instructions after it (the next topics). Before you try a prompt on a real song, print the whole thing. It needs a song beatcode has analyzed (a Spotify song you played, or asked the AI to write a chart for) and a language. Leave the song out, or give a name that doesn’t match, and beatcode lists your analyzed songs to pick from with ↑ ↓ and Enter (only in a terminal; in a script, give the name).",
          "The prompt is named by its file name, mood.md, not by its path. The output is the system message, then the user message, exactly as the model gets them.",
        ],
        cmd: ["beatcode xray --show mood.md typescript", 'beatcode xray "Shining Star" --show mood.md typescript'],
        shots: [],
      },
      {
        id: "xray",
        menu: "{xray}",
        title: "Where {xray} goes",
        body: [
          "For a song beatcode has listened to, {xray} is the song X-ray: a table of the song’s sections (time, bars, which notes fall there, how many tokens to write, how loud and how busy), a bar-by-bar loudness graph, how to use them, a shape for the reply, and a checklist to run before replying. The table and graph are wrapped in <xray> … </xray>, the shape in <examples>, and the checklist in <checklist>.",
          "Put {xray} where you want it in the prompt. If the prompt has no {xray}, beatcode adds the X-ray after your text for any song that has one. {xray} is empty for a song without an analysis (and for YouTube Music songs, which are never analyzed), so one prompt works for both. To turn the X-ray off, set [ai] xray = false.",
          "With the X-ray, the length comes from its token counts, not from {lines}: it says so in the text. Don’t also write a line count in your prompt; the two will disagree.",
          "{xray} is one piece. There are no separate placeholders for the table, the rules or the checklist.",
        ],
        file: { name: "~/.config/beatcode/prompts/festival.md", lines: minimal },
        shots: [],
      },
      {
        id: "added",
        menu: "What beatcode adds",
        title: "What beatcode adds to every prompt",
        body: [
          "After your text, beatcode always adds two things. For code, “every line must be the language itself”: no padding the length with another language inside a heredoc or a string (shorter code is fine if the language can’t reach the length). And, for every prompt, an instruction to write 2–4 sentences about the feelings behind the code between <beatcode-intent> tags, outside the code block. They show under the graph on the results screen.",
          "So a prompt that says “reply with only the code block, nothing else” fights the second one. The bundled prompts say “Outside it, write only what the instructions below ask for” instead, and the added text says the intent is the one thing allowed outside.",
          "The X-ray asks for one marker line at the start of each section, // [@beatcode#section#N] (the comment mark of the language). That overrides a “no comments” rule in your prompt, and it says so. beatcode uses the markers to put each block on its section of the song; without them it follows the blank lines between blocks.",
        ],
        shots: [],
      },
      {
        id: "tips",
        menu: "What to avoid",
        title: "What to avoid",
        body: [
          "Don’t give a length. With the X-ray the token counts are the length; without it, {lines} is. A second number in the prose only pulls the model both ways.",
          "Don’t forbid what beatcode asks for: comments (the markers), text outside the code block (the intent), and extra sections or blocks (the X-ray fixes the number).",
          "Describe style, not structure: the subject, the mood, short or long lines, how names look. The structure (sections, markers, token counts) is the X-ray’s job.",
          "Seen once, not measured: on one song with openai/gpt-6-luna at effort = low, the code came back well under half the length asked for and without markers or the intent, then right in length on the next try, still without markers or the intent. We have not compared efforts. If details get dropped, raising [ai] effort (or a stronger model) is the first thing to try, and beatcode xray <song> --show helps you check that the text itself is clear.",
        ],
        shots: [],
      },
    ],
  },
  ja: {
    title: "プロンプトの書き方 — beatcode",
    description: "AI に譜面を書いてもらう自分のプロンプトの書き方。{xray} を置く場所、beatcode が足してくれるもの、本当に送られる文の見方、避けること。",
    heading: "プロンプトの書き方",
    lede: "AI に譜面を書いてもらうプロンプトは、自分で書ける Markdown のファイルです。このページは、いいプロンプトを書くための話です。beatcode がもう送っているもの、曲のレントゲンを置く場所、頼む前に実際に送る文を読む方法を書きます。",
    menuLabel: "項目",
    keysLabel: "キー",
    next: { href: "guide/config/", label: "← 設定: config.toml の全部の段" },
    steps: [
      {
        id: "start",
        menu: "はじめ方",
        title: "同梱のプロンプトから始める",
        body: [
          "白紙からは始めません。beatcode prompts new --template mood で、同梱のプロンプトの下書きが $EDITOR で開き、使える置き換えの説明がコメントで入っています。保存して閉じて名前を付けると、お題の欄に出ます。すでにあるものを直すのは beatcode prompts edit <名前> です。",
          "ファイルの書き方・キー(name・description・model・effort・length・lang・kind)・{lang} や {topic} などの置き換えは、設定のページの「AI のプロンプト」にあります。",
        ],
        cmd: ["beatcode prompts new --template mood", "beatcode prompts edit mood"],
        shots: [],
      },
      {
        id: "see",
        menu: "送る文を読む",
        title: "本当に送られる文を読む",
        body: [
          "書いたものだけが送られるわけではありません。beatcode が後ろに指示を足します(次の項目)。本物の曲で試す前に、全文を出して読めます。beatcode が解析した曲(Spotify で遊んだ曲、または AI に譜面を頼んだ曲)と言語が要ります。曲を省くか、合わない名前を渡すと、解析済みの曲の一覧が出て、↑↓ と Enter で選べます(端末だけ。スクリプトでは名前を渡します)。",
          "プロンプトはパスではなくファイル名(mood.md)で指します。出るのは system のメッセージと user のメッセージで、モデルに渡るままです。",
        ],
        cmd: ["beatcode xray --show mood.md typescript", 'beatcode xray "Shining Star" --show mood.md typescript'],
        shots: [],
      },
      {
        id: "xray",
        menu: "{xray}",
        title: "{xray} を置く場所",
        body: [
          "beatcode が音を聴いた曲では、{xray} は曲のレントゲンになります。曲の区切りの表(時間・小節・落ちるノーツ・書くトークン数・音量と音の多さ)、小節ごとの音量のグラフ、その使い方、返事の形、返事の前に確かめるチェックリストです。表とグラフは <xray> … </xray>、返事の形は <examples>、チェックリストは <checklist> で囲んであります。",
          "{xray} は、プロンプトの好きな場所に置けます。プロンプトに {xray} が無ければ、レントゲンのある曲では、書いた文の後ろに beatcode が足します。解析していない曲(と、解析しない YouTube Music の曲)では {xray} は空なので、1 つのプロンプトで両方に使えます。レントゲンを止めるときは [ai] xray = false。",
          "レントゲンがあるときの長さは、{lines} ではなくレントゲンのトークン数で決まります(文にもそう書いてあります)。プロンプトに行数も書くと、2 つが食い違うので書かないでください。",
          "{xray} は 1 つの塊です。表・ルール・チェックリストを別々に置く置き換えはありません。",
        ],
        file: { name: "~/.config/beatcode/prompts/festival.md", lines: minimal },
        shots: [],
      },
      {
        id: "added",
        menu: "足されるもの",
        title: "どのプロンプトにも足されるもの",
        body: [
          "書いた文の後ろに、beatcode は必ず 2 つを足します。コードでは「どの行もその言語そのもの」: ヒアドキュメントや文字列の中に別の言語を入れて長さを稼がない(その言語で長さに届かないなら、短くてかまいません)。そして、どのプロンプトにも、コードの気持ちを 2〜4 文、<beatcode-intent> のタグで囲んでコードブロックの外に書く指示。結果の画面のグラフの下に出ます。",
          "なので「コードブロックだけを返して、ほかには何も書くな」と書くと、2 つ目とぶつかります。同梱のプロンプトは代わりに「囲みの外には、下の指示が頼むものだけを書く」と書いてあり、足される文が、思いだけは外に書いてよいと断ります。",
          "レントゲンは、各区切りの頭に印の行を 1 つ書くよう頼みます。`// [@beatcode#section#N]`(その言語の 1 行コメントの記号)です。プロンプトの「コメントを書くな」を上書きし、そうだと文に書いてあります。beatcode は印で、ブロックを曲の区切りに当てます。印が無いときは、ブロックの間の空行を見ます。",
        ],
        shots: [],
      },
      {
        id: "tips",
        menu: "避けること",
        title: "避けること",
        body: [
          "長さを書かない。レントゲンがあればトークン数が長さで、無ければ {lines} が長さです。文章でもう 1 つ数を書くと、モデルが両方に引っ張られます。",
          "beatcode が頼むことを禁じない。コメント(印)、コードブロックの外の文(思い)、区切りやブロックを増やすこと(数はレントゲンが決めます)です。",
          "構造ではなく、書きぶりを書く。題材・気分・短い行か長い行か・名前の付け方です。構造(区切り・印・トークン数)はレントゲンの仕事です。",
          "1 回見ただけで、測ってはいません: 1 曲で openai/gpt-6-luna・effort = low のとき、コードは頼んだ長さの半分に満たず、印も思いも無く返りました。次の 1 回は長さは合いましたが、印と思いはやはり無しでした。effort の違いは比べていません。細かいところが落ちるなら、まず [ai] effort を上げる(か強いモデルにする)のを試し、beatcode xray <曲> --show で、文そのものが分かりやすいかを確かめてください。",
        ],
        shots: [],
      },
    ],
  },
};

/**
 * サンドボックスの一覧ページ（sandbox/index.html）を sandbox/private/*.html と sandbox/screens/*.html から作る。
 *
 *   input:  sandbox/private/*.html（非公開・gitignore 済み）と sandbox/screens/*.html（公開の見本）の
 *           <title> と <meta name="description">
 *   output: sandbox/index.html（生成物。gitignore 済み）
 *
 *   private/ は手元にしか無いので、GitHub Pages（CI のビルド）の一覧には公開の見本だけが載る。
 *
 *   画面を足すたびに一覧を手で直さなくて済むよう、ビルド（npm run build）・npm run sandbox:new・npm run dev のたびに作り直す。
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const SECTIONS = [
  { dir: "private", heading: "非公開の画面", note: "sandbox/private/ — 手元の PC だけにあり、git には入りません。案件の画面はここに作ります", badge: "非公開" },
  { dir: "screens", heading: "公開の見本", note: "sandbox/screens/ — GitHub に上がり、誰でも見られます。架空のデータだけで作ります", badge: "公開" },
];
const outFile = path.join(projectRoot, "sandbox/index.html");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pick = (html, re) => (html.match(re)?.[1] ?? "").trim();

async function readScreens(dir) {
  const abs = path.join(projectRoot, "sandbox", dir);
  const files = (await readdir(abs).catch(() => [])).filter((f) => f.endsWith(".html")).sort();
  return Promise.all(files.map(async (file) => {
    const html = await readFile(path.join(abs, file), "utf8");
    return {
      href: `${dir}/${file}`,
      title: pick(html, /<title>([^<]*)<\/title>/) || file,
      desc: pick(html, /<meta\s+name="description"\s+content="([^"]*)"/),
    };
  }));
}

export async function buildSandboxIndex() {
  const groups = await Promise.all(SECTIONS.map(async (sec) => ({ ...sec, screens: await readScreens(sec.dir) })));
  const total = groups.reduce((n, g) => n + g.screens.length, 0);

  const sections = groups.filter((g) => g.screens.length > 0).map((g) => {
    const items = g.screens.map((s) => `          <li><a class="sb-screen-link" href="${esc(s.href)}">
            <span class="sb-screen-title">${esc(s.title)}</span>
            ${s.desc ? `<span class="sb-screen-desc">${esc(s.desc)}</span>` : ""}
            <span class="sb-screen-file">sandbox/${esc(s.href)}</span>
          </a></li>`).join("\n");
    return `      <section class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <h2 class="typo-xlarge m-0 flex items-center gap-2">${g.heading}<span class="badge badge-soft-${g.dir === "private" ? "neutral" : "warning"}">${g.badge}</span></h2>
          <p class="typo-small text-fg-low m-0">${g.note}</p>
        </div>
        <ul class="sb-screen-list">
${items}
        </ul>
      </section>`;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sandbox — Design System</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../dist/ds.css">
<link rel="stylesheet" href="sandbox.css">
<script src="sandbox.js"></script>
</head>
<body>
  <!-- 生成物（scripts/build-sandbox-index.mjs）。直接編集しない -->
  <div class="sb-app sb-app-no-sidebar">
    <header class="sb-topbar">
      <p class="sb-topbar-brand">Sandbox</p>
      <div class="sb-topbar-actions">
        <a class="link" href="../preview/index.html"><span class="link-label">コンポーネントのカタログ</span></a>
        <span data-theme-toggle></span>
      </div>
    </header>
    <main class="sb-index flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="typo-3xlarge m-0">Sandbox</h1>
        <p class="typo-medium text-fg-middle m-0">DS の部品だけで組んだ画面の置き場です（${total}画面）。新しい画面は <code>npm run sandbox:new -- &lt;名前&gt; "&lt;画面名&gt;"</code> で sandbox/private/（非公開）に作ります。</p>
      </div>
${sections}
    </main>
  </div>
</body>
</html>
`;
  await writeFile(outFile, html);
  return total;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const n = await buildSandboxIndex();
  console.log(`✓ sandbox/index.html（${n}画面）`);
}

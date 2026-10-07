/**
 * サンドボックスの一覧ページ（sandbox/index.html）を sandbox/screens/*.html から作る。
 *
 *   input:  sandbox/screens/*.html の <title> と <meta name="description">
 *   output: sandbox/index.html（生成物。gitignore 済み）
 *
 *   画面を足すたびに一覧を手で直さなくて済むよう、ビルド（npm run build）・npm run sandbox:new・npm run dev のたびに作り直す。
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const screensDir = path.join(projectRoot, "sandbox/screens");
const outFile = path.join(projectRoot, "sandbox/index.html");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pick = (html, re) => (html.match(re)?.[1] ?? "").trim();

export async function buildSandboxIndex() {
  const files = (await readdir(screensDir).catch(() => [])).filter((f) => f.endsWith(".html")).sort();
  const screens = await Promise.all(files.map(async (file) => {
    const html = await readFile(path.join(screensDir, file), "utf8");
    return {
      file,
      title: pick(html, /<title>([^<]*)<\/title>/) || file,
      desc: pick(html, /<meta\s+name="description"\s+content="([^"]*)"/),
    };
  }));

  const items = screens.map((s) => `      <li><a class="sb-screen-link" href="screens/${esc(s.file)}">
        <span class="sb-screen-title">${esc(s.title)}</span>
        ${s.desc ? `<span class="sb-screen-desc">${esc(s.desc)}</span>` : ""}
        <span class="sb-screen-file">sandbox/screens/${esc(s.file)}</span>
      </a></li>`).join("\n");

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
        <p class="typo-medium text-fg-middle m-0">DS の部品だけで組んだ画面の置き場です（${screens.length}画面）。新しい画面は <code>npm run sandbox:new -- &lt;名前&gt; "&lt;画面名&gt;"</code> で作ります。</p>
      </div>
      <ul class="sb-screen-list">
${items}
      </ul>
    </main>
  </div>
</body>
</html>
`;
  await writeFile(outFile, html);
  return screens.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const n = await buildSandboxIndex();
  console.log(`✓ sandbox/index.html（${n}画面）`);
}

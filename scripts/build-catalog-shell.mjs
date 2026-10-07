/**
 * カタログ（preview/）の全ページに、共通の外枠（上部バー・左のナビ）を書き込む。
 *
 *   input:  preview/index.html の部品カードの並び（ナビの Components の順番の正本）
 *           preview/components/*.html の <h1>（ナビの表示名）
 *   output: preview/index.html・preview/components/*.html・preview/foundations/*.html の
 *           <!-- catalog-shell:start --> 〜 <!-- catalog-shell:end --> の間（この間は直接編集しない）
 *
 *   部品ページを増やしたら、index.html の部品カードに追加して npm run build する（ナビに自動で載る）。
 *   foundations/*.html は build:foundations が作るので、このスクリプトはその後に実行する。
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const previewDir = path.join(projectRoot, "preview");

const START = "<!-- catalog-shell:start -->";
const END = "<!-- catalog-shell:end -->";

const FOUNDATIONS = [
  { href: "foundations/colors.html", title: "Colors" },
  { href: "foundations/typography.html", title: "Typography" },
  { href: "foundations/spacing.html", title: "Spacing" },
  { href: "foundations/effects.html", title: "Radius & Shadow" },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function components() {
  const index = await readFile(path.join(previewDir, "index.html"), "utf8");
  const order = [...index.matchAll(/class="catalog-grid-card" href="(components\/[a-z0-9-]+\.html)"/g)].map((m) => m[1]);
  const files = (await readdir(path.join(previewDir, "components"))).filter((f) => f.endsWith(".html"));
  const missing = files.map((f) => `components/${f}`).filter((f) => !order.includes(f));
  if (missing.length) throw new Error(`preview/index.html の部品カードに無いページがあります: ${missing.join(", ")}`);
  return Promise.all(order.map(async (href) => {
    const html = await readFile(path.join(previewDir, href), "utf8");
    const title = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1].trim();
    if (!title) throw new Error(`preview/${href} に <h1> が見つかりません`);
    return { href, title };
  }));
}

/** page: preview/ からの相対パス（例: components/button.html） */
function shell(page, comps) {
  const up = page.includes("/") ? "../" : "";
  const item = ({ href, title }) => {
    const current = href === page ? ' aria-current="page"' : "";
    return `        <li><a class="catalog-nav-item" href="${up}${href}"${current}>${esc(title)}</a></li>`;
  };
  return `${START}
  <a class="catalog-skip" href="#main">本文へ移動</a>
  <header class="catalog-topbar">
    <button type="button" class="catalog-nav-toggle icon-btn icon-btn-sm icon-btn-neutral icon-btn-ghost" aria-controls="catalog-nav" aria-expanded="false" aria-label="メニューを開く">
      <svg class="icon icon-sm" aria-hidden="true"><use href="${up}icons.svg#lucide-menu"></use></svg>
    </button>
    <a class="catalog-brand" href="${up}index.html"><span class="catalog-brand-mark" aria-hidden="true"></span>Design System</a>
    <div class="catalog-topbar-actions">
      <a class="catalog-topbar-link" href="${up}../sandbox/index.html">Sandbox</a>
      <a class="catalog-topbar-link" href="https://github.com/yonkzs/my-design-system" target="_blank" rel="noopener noreferrer">GitHub<svg class="icon icon-xs" aria-hidden="true"><use href="${up}icons.svg#lucide-external-link"></use></svg><span class="sr-only">（新しいタブで開く）</span></a>
      <span class="catalog-topbar-sep" aria-hidden="true"></span>
      <span data-theme-toggle></span>
    </div>
  </header>
  <nav class="catalog-nav" id="catalog-nav" aria-label="カタログ">
    <ul class="catalog-nav-list">
${item({ href: "index.html", title: "はじめに" })}
    </ul>
    <p class="catalog-nav-heading">Foundation</p>
    <ul class="catalog-nav-list">
${FOUNDATIONS.map(item).join("\n")}
    </ul>
    <p class="catalog-nav-heading">Components</p>
    <ul class="catalog-nav-list">
${comps.map(item).join("\n")}
    </ul>
    <div class="catalog-nav-links">
      <p class="catalog-nav-heading">リンク</p>
      <ul class="catalog-nav-list">
        <li><a class="catalog-nav-item" href="${up}../sandbox/index.html">Sandbox</a></li>
        <li><a class="catalog-nav-item" href="https://github.com/yonkzs/my-design-system" target="_blank" rel="noopener noreferrer">GitHub<span class="sr-only">（新しいタブで開く）</span></a></li>
      </ul>
    </div>
  </nav>
  ${END}`;
}

export async function buildCatalogShell() {
  const comps = await components();
  const pages = [
    "index.html",
    ...FOUNDATIONS.map((f) => f.href),
    ...comps.map((c) => c.href),
  ];
  for (const page of pages) {
    const file = path.join(previewDir, page);
    const html = await readFile(file, "utf8");
    const s = html.indexOf(START);
    const e = html.indexOf(END);
    if (s < 0 || e < 0) throw new Error(`preview/${page} に ${START} 〜 ${END} がありません`);
    await writeFile(file, html.slice(0, s) + shell(page, comps) + html.slice(e + END.length));
  }
  return pages.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const n = await buildCatalogShell();
  console.log(`✓ preview/ の外枠（${n}ページ）`);
}

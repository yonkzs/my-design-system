/**
 * カタログの Foundation ページ（preview/foundations/*.html）のひな形と、tokens/*.css の読み取り。
 * 上部バー・左のナビは build-catalog-shell.mjs が catalog-shell の印の間に書き込む。
 * build-color-page.mjs / build-typography-page.mjs から使う。
 */

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** CSS 文字列から `marker` の直後の { … } の中身を返す（入れ子対応） */
export function blockBody(css, marker, file = "tokens") {
  const start = css.indexOf(marker);
  if (start < 0) throw new Error(`${file} に ${marker} が見つかりません`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`${file}: ${marker} のブロックが閉じていません`);
}

/** `prefix` で始まるカスタムプロパティを順番どおりに取り出す。同じ行の末尾コメントを説明として拾う */
export function declarations(body, prefix = "--") {
  const list = [];
  const re = new RegExp(`(${prefix}[\\w-]+)\\s*:\\s*([^;]+);[ \\t]*(?:\\/\\*\\s*(.*?)\\s*\\*\\/)?`, "g");
  for (const m of body.matchAll(re)) list.push({ name: m[1], value: m[2].trim(), note: m[3] ?? "" });
  return list;
}

/** Foundation ページの HTML 全体 */
export function foundationPage({ title, desc, source, style, body }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>${title} — Design System</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="../../dist/ds.css">
<link rel="stylesheet" href="../catalog.css">
<script src="../catalog.js"></script>
<!-- このファイルは ${source} から生成する。直接編集しない -->
<style>
.fp-scroll { overflow-x: auto; }
.fp-table { width: 100%; border-collapse: collapse; font: var(--typo-body-small); }
.fp-table th, .fp-table td { padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4); border-top: 1px solid var(--color-stroke-low); text-align: left; vertical-align: middle; }
.fp-table thead th { color: var(--color-fg-low); font-weight: var(--font-weight-semibold); border-top: none; }
.fp-mono { font-family: var(--font-mono); font-size: var(--text-12); color: var(--color-fg-high); display: block; }
.fp-sub { display: block; font: var(--typo-caption); color: var(--color-fg-low); margin-top: 2px; }
.fp-body { padding: 0 calc(var(--spacing) * 6) calc(var(--spacing) * 6); }
.fp-code { background: var(--color-bg-sunken); border: 1px solid var(--color-stroke-low); border-radius: var(--radius-sm); padding: calc(var(--spacing) * 4); font-family: var(--font-mono); font-size: var(--text-12); overflow-x: auto; }
${style ?? ""}
</style>
</head>
<body>

  <!-- catalog-shell:start -->
  <!-- catalog-shell:end -->

  <main class="catalog-main" id="main">
    <nav class="catalog-breadcrumb" aria-label="パンくずリスト"><a href="../index.html">ホーム</a><span aria-hidden="true">/</span><span>Foundation</span></nav>
    <h1 class="catalog-page-title">${title}</h1>
    <p class="catalog-page-desc">${desc}</p>
${body}
  </main>
</body>
</html>
`;
}

# Sandbox（画面の試作）

DS の部品を組み合わせて、任意の画面を作って試す場所です。本番のコードではありません。

- 部品の組み合わせ方・密度・余白のリズムを、実際の画面の形で確かめる
- DS に足りない部品やトークンを見つける（見つけたら DS 側に足す）
- クライアント・PM・エンジニアに画面の形で見せる

## 使い方

```bash
npm install
npm run dev     # → http://localhost:5173/sandbox/（一覧）
```

新しい画面を作る:

```bash
npm run sandbox:new -- <名前> "<画面名>" ["<説明>"]
# 例
npm run sandbox:new -- invoice-list "請求一覧" "請求書を確認・送付する画面"
```

`sandbox/screens/<名前>.html` ができ、一覧（`sandbox/index.html`）に自動で載ります。`<名前>` は半角英小文字・数字・ハイフンだけ（ファイル名と URL になるため）。
あとはそのファイルを編集し、ブラウザで再読み込みして確認します。

## ルール

| | 内容 |
|---|---|
| OK | 画面の中身は DS の部品（`src/components/*.css` の先頭コメントに完成形 HTML）と utility（`p-4` `gap-6` `grid-cols-2` など）だけで組む |
| OK | アイコンは `../../dist/icons.svg#lucide-<名前>`（一覧は [docs/ICONS.md](../docs/ICONS.md)） |
| OK | 状態（空・エラー・読み込み中・権限なし・長文）も同じ画面か別の画面で作っておく |
| NG | `style="…"` や独自の CSS で色・余白・文字の大きさを直書きしない → DS で表せないなら、それは DS に足りないものとしてメモする |
| NG | `sandbox.css` に画面の中身用のクラスを足さない（置くのは画面の枠だけ） |

使える utility は `src/index.css` の `@source inline(...)`（safelist）に書かれたものだけです。`dist/ds.css` は使うクラスだけを残してビルドしているため、一覧に無い Tailwind の utility は効きません。

## 構成

| ファイル | 内容 |
|---|---|
| `screens/*.html` | 画面。1ファイル1画面 |
| `_template.html` | `sandbox:new` が使うひな形（上部バー・サイドバー・ページ見出し・カード） |
| `sandbox.css` | 画面の枠（上部バー・サイドバー・本文）だけ。値はすべて DS のトークン |
| `sandbox.js` | ライト / ダークの切り替え（カタログと同じ設定を共有）、`data-indeterminate` の checkbox を中間状態にする |
| `index.html` | 一覧。`screens/` から自動生成（gitignore 済み。直接編集しない） |

画面の枠（`sb-app` `sb-topbar` `sb-sidebar` `sb-main`）は DS にまだアプリの枠組みの部品が無いための仮置きです。
同じ枠をプロダクトでも使うようなら、DS の部品（app-shell）にする候補として扱います。

## 公開

`main` に入ると GitHub Pages に `sandbox/` ごと公開されます（`.github/workflows/deploy-pages.yml`）。カタログ右上の「Sandbox」から開けます。

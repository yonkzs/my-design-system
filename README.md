# Design System

Tailwind CSS v4 ベース、フレームワーク非依存のデザインシステムです。
デザイントークン + コンポーネントを CSS として提供します。正本はこのリポジトリのコードです。

参考プロダクト: Linear / Notion / Vercel — 控えめで機能的、情報密度を優先。
見た目の値（色・角丸・部品の高さ・書体）は Figma「Design System Starter File」に揃えています（対応表: [docs/FIGMA-STARTER-MAPPING.md](docs/FIGMA-STARTER-MAPPING.md)）。

## 使い始める

### 1. ビルド

```bash
npm install
npm run build
```

`dist/ds.css` が生成されます。

```html
<link rel="stylesheet" href="dist/ds.css">
```

これで `.btn` / `.input` / `.card` などのクラスと、`bg-primary-500` / `text-fg-high` などのトークンユーティリティが使えます。

### 書体

欧文は Figma の Starter File と同じ Inter を第一候補にしています。`ds.css` は Webフォントを読み込まないので、Inter で表示したいページでは利用側で読み込んでください。読み込まない場合は OS のフォント（和文はヒラギノ / 游ゴシック UI / メイリオ）で表示されます。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
```

画面の組み立て用に、レイアウト utility の最小セット（`p-/m-/gap-` の9段、`flex` / `grid` / `items-*` / `justify-*` / `mx-auto` / `w-full` / `max-w-{page,content,article,narrow}` など）も入っています。Tailwind の utility が全部使えるわけではありません。一覧の正本は `src/index.css` の `@source inline`（MCP も同じ一覧を AI に渡します）。

### 2. すぐ書ける例

```html
<button class="btn btn-md btn-primary btn-solid">保存</button>

<div class="alert alert-info">
  <span class="alert-icon" aria-hidden="true">i</span>
  <div class="alert-body">
    <p class="alert-title">お知らせ</p>
    <p>新しいバージョンが利用可能です。</p>
  </div>
</div>
```

### 3. ダークモード（任意）

```html
<html data-color-mode="dark">  <!-- 常にダーク。"auto" で OS の設定に追従 -->
```

属性を付けなければライトのままです。仕組みは [DESIGN.md](DESIGN.md) の「テーマ」を参照してください。

全コンポーネントの動作確認は [`preview/index.html`](preview/index.html) を参照してください（右上のボタンでテーマを切り替えられます）。

## コンポーネント一覧（35個）

| # | コンポーネント | 主要クラス |
|---|---|---|
| 1 | Button | `.btn` + `.btn-{primary,neutral,negative}` + `.btn-{solid,subtle,outline,ghost}` + `.btn-{sm,md,lg}`（中に `.icon` を置ける）、`.btn-group`（表示の切り替え） |
| 2 | Icon Button | `.icon-btn` + `.icon-btn-{primary,neutral,negative}` + `.icon-btn-{solid,subtle,outline,ghost}` + `.icon-btn-{sm,md,lg}` |
| 3 | Label Control | `.label-control`, `.label-control-{row,text,support}`, `.label-badge-{required,optional}`, `.field-{error,support}-text` |
| 4 | Input | `.input`, `.input-{sm,md,lg}`, `.input-error` |
| 5 | Textarea | `.textarea-control`, `.textarea`, `.textarea-{sm,md,error}`, `.textarea-{footer,counter}` |
| 6 | Search Input | `.search-input`, `.search-input-{sm,md,lg,error}`, `.search-input-{field,clear,submit}` |
| 7 | Select | `.select`, `.select-{sm,md,lg}`, `.select-error`（見た目はInputと統一） |
| 8 | Selector | `.selector`, `.selector-{sm,md,lg}`, `.selector-icon`, `.selector-error`（左アイコン付きselect） |
| 9 | Checkbox | `.checkbox`, `.checkbox-{sm,lg}`, `.checkbox-label`, `.checkbox-error`, `.checkbox-field` + `.checkbox-desc`（補足文） |
| 10 | Radio | `.radio`, `.radio-{sm,lg}`, `.radio-label`, `.radio-group`, `.radio-field` + `.radio-desc`（補足文） |
| 11 | Badge | `.badge` + `.badge-{soft,solid}-{neutral,primary,success,warning,negative,info}` |
| 12 | Card | `.card`, `.card-{header,title,subtitle,body,footer}` |
| 13 | Data Table | `.data-table`, `.data-table-{dense,num,empty,check,sort,filter,th}`, `.data-table-toolbar`（表の上の操作バー）（選択行は `aria-selected="true"`、並べ替えは `aria-sort`） |
| 14 | Alert | `.alert`, `.alert-{neutral,success,negative,warning,info}`, `.alert-{icon,body,title,close}` |
| 15 | Modal | `.modal`（ネイティブ `<dialog>` ベース。開閉は `showModal()` / `close()`） |
| 16 | Tab | `.tabs`, `.tab`（現在地は `aria-selected="true"`）, `.tab-count` |
| 17 | Toggle Switch | `.switch`, `.switch-sm`, `.switch-label`, `.switch-field` + `.switch-desc`（`<input type="checkbox" role="switch">`ベース） |
| 18 | Accordion | `.accordion`, `.accordion-item`, `.accordion-trigger`, `.accordion-icon`, `.accordion-panel`（ネイティブ`<details>/<summary>`ベース） |
| 19 | Tooltip | `.tooltip`, `.tooltip-content`（CSSのみで動作。関連付けは`aria-describedby`。top配置のみ対応） |
| 20 | Link | `.link`, `.link-label`, `.link-{neutral,inverse}`（下線+周囲からfont-size継承） |
| 21 | Breadcrumb | `.breadcrumb`, `.breadcrumb-sep`, `.breadcrumb-current`（`.link`+chevron区切り） |
| 22 | Menu | `.menu`, `.menu-flush`, `.menu-group`, `.menu-divider`, `.menu-item`, `.menu-item-sm`, `.menu-item-check`（現在地は`aria-current="page"`、チェック項目は`role="menuitemcheckbox\|menuitemradio"`） |
| 23 | Pagination | `.pagination`, `.pagination-item`, `.pagination-ellipsis`（現在ページは`aria-current="page"`） |
| 24 | Stepper | `.stepper`, `.stepper-step`, `.stepper-marker`, `.stepper-label`（現在地は`aria-current="step"`、完了は`.is-completed`） |
| 25 | Page Shell | `.page-shell`（`max-w-page`に中央寄せ）/ `.page-shell-content`（900pxに絞る。フォーム/設定/詳細） |
| 26 | Simple Table | `.simple-table`（`<th>`/`<td>`を子要素として使用、rowspanでmerge可） |
| 27 | Filter Chip | `.filter-chip`, `.filter-chip-{label,count,check}`（選択状態は`aria-pressed`） |
| 28 | Input Group | `.input-group`, `.input-group-{sm,md,lg,error}`, `.input-group-{field,addon,tab,loader}`（前後の単位・選択・ボタン・読み込み中） |
| 29 | Avatar | `.avatar`, `.avatar-{sm,md,lg,xl,2xl}`, `.avatar-image`, `.avatar-status-{online,idle,busy,offline}`, `.avatar-badge`, `.avatar-label`, `.avatar-group` |
| 30 | Progress | `.progress`（`<progress>`）, `.progress-lg`, `.progress-{success,warning,negative}`, `.progress-field`, `.progress-circle-{sm,md,lg,xl}`, `.progress-half`（値は `--value`） |
| 31 | Date Picker | `.date-picker`, `.date-picker-popover`, `.calendar`, `.calendar-{nav,title,grid,day}`（選択は `aria-selected`、今日は `aria-current="date"`、期間は `data-range="middle"`） |
| 32 | File Upload | `.file-upload`, `.file-upload-{input,icon,title,hint,compact,complete,error}`, `.file-list`, `.file-item`, `.file-item-{icon,body,name,meta,error}`（ドラッグ中は `data-dragover`） |
| 33 | Reorderable List | `.reorder-list`, `.reorder-list-plain`, `.reorder-item`, `.reorder-handle`, `.reorder-label`（ドラッグ中は `data-dragging`） |
| 34 | Section Header | `.section-header`, `.section-header-{main,text,title,desc,actions,raised}`（下に `.tabs` を置ける） |
| 35 | Divider | `.divider`（`<hr>`）, `.divider-{strong,dashed,dotted,inset,vertical}` |

アイコンは Lucide SVG sprite（`dist/icons.svg`、33種）を `.icon icon-{xs,sm,md,lg,xl}` で使用（詳細はDESIGN.md）。

各コンポーネントの完成形HTML・使用法（OK/NG）・アクセシビリティ対応は `src/components/*.css` の先頭コメントを参照してください（正本）。

## ドキュメント一覧

| ファイル | 内容 |
|---|---|
| [DESIGN.md](DESIGN.md) | 1枚にまとめた憲法（トークン値・非交渉原則・禁止パターン） |
| [PHASE0-DIRECTION.md](PHASE0-DIRECTION.md) | 参考プロダクト・ブランドカラー・デザイン原則の決定背景 |
| [docs/ICONS.md](docs/ICONS.md) | アイコン（Lucide SVG sprite）の使い方・同梱一覧・ビルドの仕組み |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Git運用・コミット規約・整合性チェックの読み方 |
| [docs/RELEASING.md](docs/RELEASING.md) | リリース手順（SemVer・gitタグ・GitHub Release） |
| [docs/FIGMA-STARTER-MAPPING.md](docs/FIGMA-STARTER-MAPPING.md) | Figma「Design System Starter File」とトークンの対応表・Starter から変えた箇所と理由 |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | WCAG 2.2 抜粋チェックリスト（DSが担保する項目 / プロダクト側の責務） |
| [src/components/](src/components/) | コンポーネントCSS（先頭コメントが仕様の正本） |
| [tokens/](tokens/) | デザイントークンの正本 |

## 開発

```bash
npm install       # 依存関係インストール
npm run build     # dist/ds.css をビルド
```

新しいトークン/クラスを `src/index.css` の `@source inline(...)` safelist に含めないと、
実際に使うコンポーネントが増えるまでビルドで刈り取られる点に注意（Tailwind v4の `source(none)` 設定のため）。

## MCP（AIコーディングツール連携）

AI（Claude Code等）にこのDSのコンポーネント仕様・トークン・原則を直接読ませるMCPサーバーです（`src/mcp/`、ツールは3つ: `get_component` / `get_tokens` / `get_design_principles`）。

### 使う人（URLを登録するだけ・Node不要）

```bash
claude mcp add --transport http ds-mcp https://my-design-system-mcp.shingai-6ba.workers.dev/mcp --scope user
```

- claude.ai: Settings → Connectors → Add custom connector → 上記URL（認証なし）
- CSS は `<link rel="stylesheet" href="https://shingai-alt.github.io/my-design-system/dist/ds.css">` の1行

### メンテナ向け

- ローカル版（DSを直すと即反映。開発中の確認用）: `claude mcp add ds-mcp --scope project -- node "$(pwd)/src/mcp/server.mjs"`（`.mcp.json` は絶対パスを含むため gitignore 対象）
- リモート版は Cloudflare Workers（[src/mcp/worker.mjs](src/mcp/worker.mjs)）。ロジックは `handlers.mjs` をローカル版と共有し、データはデプロイ時に `dist/mcp-files.json` に固める。`main` への push で、データの正本（components / tokens / DESIGN.md 等）が変わっていれば GitHub Actions が自動デプロイする（[deploy-mcp-worker.yml](.github/workflows/deploy-mcp-worker.yml)）。

```bash
npm run dev:mcp-remote   # ローカル確認（http://localhost:8787/mcp）
npm run deploy:mcp       # デプロイ（要 wrangler login）
```

## 回帰スイート（evals）

固定のお題をAIに解かせて自動採点する仕組みです。詳細は [evals/README.md](evals/README.md) を参照してください。

```bash
npm run eval             # 全お題を実行（claude CLIとMCP接続が必要）
npm run eval:report      # 実行履歴の推移表（無料）
```
# my-design-system

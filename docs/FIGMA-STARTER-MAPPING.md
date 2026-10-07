# Figma「Design System Starter File」との対応表

2026-10 に、このDSの見た目の値（色・角丸・部品の高さ・書体・状態）を Figma の
[Design System Starter File](https://www.figma.com/design/gXpjoSvxc6ggLkeMyXF5tB/Design-System-Starter-File) に揃えました。
トークン名・クラス名・semantic 3層の構造は変えていません（既存の利用コードはそのまま動きます）。

## ベースに選んだ理由

候補は次の2つでした。

| | Design System Starter File | UI Collective Basic Design System |
|---|---|---|
| 中身 | 約20ページ（Button / Field & Input / Dropdown / Text area / Checkbox / Switch / Date Picker / Menu / Table / File Upload / Avatar / Progress など） | 表紙とアイコン（17カテゴリ・16px）だけ |
| 変数 | 色（surface / text / border × primary / secondary / information / warning / error / success × default / subtle / hover）、角丸、線幅、文字 | なし |
| 状態 | default / hover / focus / disabled、エラー、サイズ3段（lg / md / default） | — |

UI Collective の Basic 版には、トークンやコンポーネントを揃える元になる材料がありませんでした。そのため Starter File を採用しています。

## トークンの対応

### 色

| このDSのトークン | Starter の変数 | 値 |
|---|---|---|
| `--color-bg-primary` | surface/primary/default | `#252b33` |
| `--color-bg-primary-hover` | surface/primary/default-hover | `#161a20` |
| `--color-bg-primary-subtle` / `--color-bg-sunken` | surface/primary/default-subtle | `#f6f8fa` |
| `--color-bg-primary-muted` / `--color-bg-neutral-middle` | surface/primary/default-subtle-hover | `#f0f3f7` |
| `--color-bg-page` / `--color-bg-raised` | surface/default | `#ffffff` |
| `--color-bg-disabled` | surface/disabled/default | `#f6f8fa`（Starter は `#f9f9f9`。gray の段に丸めた） |
| `--color-fg-high` | text/default/body | `#252b33` |
| `--color-fg-middle` / `--color-fg-primary` | text/primary/default | `#38404a` |
| `--color-fg-low` | text/default/caption | `#4f5864` |
| `--color-fg-placeholder` | text/default/placeholder | `#687384` |
| `--color-fg-disabled` | text/disabled/on-color | `#8695a7` |
| `--color-fg-on-*` | text/{role}/on-color | `#ffffff`（Starter は `#fbfcfd`） |
| `--color-stroke-high` | border/default | `#c8d0da` |
| `--color-stroke-middle` | border/primary/default-subtle | `#e0e5eb` |
| `--color-stroke-primary` / `--color-stroke-control-hover` | border/primary/default | `#38404a` |
| `--color-bg-negative` / `--color-stroke-negative` | surface/error/default | `#c94040` |
| `--color-fg-negative` | text/error/default | `#a82222` |
| `--color-bg-negative-subtle` / `-muted` | surface/error/default-subtle / -hover | `#fff2f2` / `#fde6e6` |
| `--color-bg-success` | surface/success/default | `#17825a` |
| `--color-bg-warning` / `--color-fg-warning` | surface/warning/default | `#a24613` |
| `--color-bg-info` / `--color-fg-info` | surface/information/default | `#1346a2` |
| `--color-bg-{status}-subtle` / `-muted` | surface/{status}/default-subtle / -hover | 各色の 50 / 100 |
| `--color-stroke-{status}-subtle` | border/{status}/default-subtle | 各色の 100 |

primitive は `gray` / `red` / `orange` / `green` / `blue` の5系統です。Starter の値を 50〜200・500〜700 の段に置き、足りない段（300・400・800〜950）は同じ色相で補間しています。値の正本は `tokens/colors.css` です。

### 角丸・線・影

| このDSのトークン | Starter の変数 | 値 | 主な用途 |
|---|---|---|---|
| `--radius-xs` | border radius/100 | 4px | チェックボックス・小さい要素 |
| `--radius-sm` | border radius/150 | 6px | ボタン・icon-button・filter-chip・pagination・tooltip |
| `--radius-md` | border radius/200 | 8px | 入力欄・select・textarea・menu・表・alert・accordion |
| `--radius-lg` | border radius/300 | 12px | card・modal |
| `--radius-full` | border radius/round | 9999px | switch・バッジ・丸 |
| `--shadow-sm` | effect「sm」 | 0 0 4px（6%） | menu |

### 部品の高さ・書体

| このDSのトークン | Starter | 値 |
|---|---|---|
| `--control-height-sm` | Button default / Field sm | 28px |
| `--control-height-md` | Button md / Field default | 36px |
| `--control-height-lg` | Button lg | 44px |
| `--font-sans` | font style/paragraph・heading | Inter →（和文）OS のフォント |
| `--typo-body` | body-sm/regular | 14px |
| `--typo-body-large` | body-md/regular | 16px |
| `--typo-label` | body-sm/medium | 14px・500 |

## Starter から意図的に変えた箇所

いずれも、アクセシビリティ（WCAG 2.2 AA）か日本語表示のために変えています。

| 項目 | Starter | このDS | 理由 |
|---|---|---|---|
| 入力欄・チェックボックスの枠線 | `#e0e5eb` / `#c8d0da` | `#8695a7`（stroke-control） | Starter の値は白地に対して 1.3〜1.6:1 で、WCAG 1.4.11（UI部品 3:1）を満たさないため |
| success の文字色 | `#17825a` | `#105e45`（Starter の hover 用の値） | `#17825a` は淡い緑（`#e8f9ed`）の上で 4.39:1 となり、4.5:1 に届かないため |
| フォーカスリング | 要素と同じ色の box-shadow / 枠線 | info 青（`#1346a2`）の outline 2px | box-shadow は強制カラーモードで消えるため。DESIGN.md の原則6 |
| 入力欄のエラー | 1px の赤枠 | 2px の赤枠（白地は Starter と同じ） | 色だけに頼らず、線の太さでも違いを伝えるため（WCAG 1.4.1） |
| switch の OFF | 淡いトラック + 暗いつまみ | グレー（`#8695a7`）のトラック + 白いつまみ | トラック自体で 3:1 を確保するため |
| switch の sm | 26×14px | 36×20px | 小さすぎて操作しにくいため |
| ボタンの左右余白 | 6 / 8 / 12px | 8 / 12 / 16px | 2〜4文字の和文ラベルが詰まって見えるため |
| 見出しの太さ | Medium（500） | Semibold（600） | 和文フォントに 500 が無い環境では 400 で描画され、見出しの階層が弱くなるため |
| pressed（押している間） | 定義なし | hover より一段濃い塗り（`--color-bg-*-pressed` 等） | クリックした手応えを返すため |
| checkbox / radio | 独自の描画 | ネイティブ要素を `appearance: none` で描き直し、hover・pressed・indeterminate を追加。強制カラーモードではネイティブに戻す | Starter と同じ状態を出しつつ、キーボード操作・読み上げはネイティブのまま保つため |
| 本文の行間 | 14/20（1.43） | 14/21（1.5） | 日本語本文は 1.5 倍以上を基準にするため（デジタル庁ガイドライン） |
| エラー・補足の文字 | 14px | 13px（body-small） | 14pxベースの密度を保ちつつ、12px 未満にしないため |

## ダークモード

Starter File にはダークの定義がありません。ライトと同じ役割になる段をこちらで選び直しています。primary はチャコールのため、ダークでは明るい塗り（`#f0f3f7`）と暗い文字に反転させています。コントラストは `npm run check:consistency` が両テーマで検査します。

## Starter にあってこのDSにまだ無いもの

次の部品は Starter File にありますが、このDSにはまだ実装していません。必要になった時点で、同じ対応表の方針で追加します。

- Date Picker
- File Upload
- Reorderable List
- Avatar
- Progress Indicators
- Section Headers
- Table の Action Bar（行を選んだときに出る一括操作バー）
- Button の information / warning / success 色（DESIGN.md の原則2「色は状態を伝える手段に限定する」と衝突するため保留）

## 部品のバリエーションの対応

| Starter | このDS |
|---|---|
| Button Type=default / subtle / outline / transparent | `.btn-solid` / `.btn-subtle` / `.btn-outline` / `.btn-ghost`（icon-button も同じ） |
| Button State=default / secondary / error | `.btn-primary` / `.btn-neutral`（outline）/ `.btn-negative` |
| Button iconLeft / iconRight | ボタン内の `.icon`（sm/md 16px・lg 20px） |
| Field Type=pre-element / post-element | `.input-group-addon` |
| Field Type=pre-tab / post-tab | `.input-group-tab`（select / button / span） |
| Field Status=loader | `.input-group-loader` |
| Checkbox Size=md / lg | `.checkbox`（20px）/ `.checkbox-lg`（28px）。radio も同じ |
| Checkbox / Switch Label の subtext | `.checkbox-field` + `.checkbox-desc`（radio・switch も同じ） |
| Menu Modifier=checkbox / radio | `role="menuitemcheckbox|menuitemradio"` + `.menu-item-check` |
| Menu Corner=square / rounded | `.menu-flush` / `.menu`（既定） |
| Menu Status=disabled | `.menu-item[aria-disabled="true"]` |
| Table Type=default / data heavy | `.data-table` / `.data-table-dense` |
| Table Content Row Type=hover / selected | `tr:hover` / `tr[aria-selected="true"]` |
| Table header items Type=sort / filter / check | `.data-table-sort` / `.data-table-filter` / `.data-table-check` |

## カタログでの状態の確認

各部品のカタログページの「状態一覧」で、通常・hover・focus・pressed・disabled を並べて確認できます。hover などは `preview/force-state.js` が `dist/ds.css` のルールを複製して固定表示しているもので、部品のCSSを直せば見本も追従します（`ds.css` には含まれません）。

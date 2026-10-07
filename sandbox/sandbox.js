// サンドボックスの画面に共通の小さな振る舞い。
//   ・テーマ切り替え（OS に追従 → ライト → ダーク）。初めて開いたときは OS に追従。カタログ（preview/）と同じ保存先なので、片方で選んだテーマが両方に効く
//   ・[data-indeterminate] の checkbox を一部選択の表示にする（HTML の属性だけでは付けられないため）
// 画面の動き（モーダルの開閉・タブの切り替えなど）が要るときは、各画面の <script> に書く。
(() => {
  const MODES = ["auto", "light", "dark"];
  const LABELS = { light: "ライト", dark: "ダーク", auto: "OS に追従" };
  const KEY = "ds-color-mode";
  const read = () => {
    try { return MODES.includes(localStorage.getItem(KEY)) ? localStorage.getItem(KEY) : "auto"; } catch { return "auto"; }
  };
  const apply = (mode) => document.documentElement.setAttribute("data-color-mode", mode);
  let current = read();
  apply(current);

  document.addEventListener("DOMContentLoaded", () => {
    for (const el of document.querySelectorAll("[data-indeterminate]")) el.indeterminate = true;

    const slot = document.querySelector("[data-theme-toggle]");
    if (!slot) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-sm btn-neutral btn-outline";
    const render = () => { button.textContent = `テーマ: ${LABELS[current]}`; };
    render();
    button.addEventListener("click", () => {
      current = MODES[(MODES.indexOf(current) + 1) % MODES.length];
      try { localStorage.setItem(KEY, current); } catch {}
      apply(current);
      render();
    });
    slot.append(button);
  });
})();

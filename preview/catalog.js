// カタログの外枠の振る舞い。<head> で同期実行し、描画前に data-color-mode を付けてちらつきを防ぐ。
//   ・テーマ切り替え（OS に追従 → ライト → ダーク の順）。初めて開いたときは OS に追従。
//     サンドボックス（sandbox/sandbox.js）と同じ保存先なので、片方で選んだテーマが両方に効く
//   ・狭い画面での左ナビの開閉（catalog-nav-toggle）
//   ・左ナビで今のページが見える位置までスクロールしておく
(() => {
  const MODES = ["auto", "light", "dark"];
  const LABELS = { auto: "OS に追従", light: "ライト", dark: "ダーク" };
  const KEY = "ds-color-mode";

  const read = () => {
    try { return MODES.includes(localStorage.getItem(KEY)) ? localStorage.getItem(KEY) : "auto"; } catch { return "auto"; }
  };
  const apply = (mode) => document.documentElement.setAttribute("data-color-mode", mode);

  let current = read();
  apply(current);

  document.addEventListener("DOMContentLoaded", () => {
    // テーマ切り替え
    const slot = document.querySelector("[data-theme-toggle]");
    if (slot) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-sm btn-neutral btn-ghost";
      const render = () => { button.textContent = `テーマ: ${LABELS[current]}`; };
      render();
      button.addEventListener("click", () => {
        current = MODES[(MODES.indexOf(current) + 1) % MODES.length];
        try { localStorage.setItem(KEY, current); } catch {}
        apply(current);
        render();
      });
      slot.append(button);
    }

    // 左ナビ: 今のページを見える位置へ
    const nav = document.getElementById("catalog-nav");
    // （scrollIntoView はページ全体までスクロールさせることがあるので、ナビの中だけを動かす）
    const active = nav?.querySelector('[aria-current="page"]');
    if (active) nav.scrollTop = active.offsetTop - nav.clientHeight / 2;

    // 左ナビの開閉（狭い画面だけでボタンが見える）
    const toggle = document.querySelector(".catalog-nav-toggle");
    if (!nav || !toggle) return;
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.documentElement.toggleAttribute("data-catalog-nav-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  });
})();

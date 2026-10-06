// カタログ専用: hover / focus / pressed を静止状態で見せる。
//
// 読み込んだ CSS（dist/ds.css）の :hover / :focus-visible / :focus-within / :focus / :active を含むルールを
// [data-force-state~="hover|focus|pressed"] に置き換えて複製し、同じ @layer components の末尾に足す。
// 部品の CSS をそのまま読むので、カタログ用に色を二重管理しない（部品を直せば見本も追従する）。
//   <button class="btn ..." data-force-state="hover">
//   <input type="checkbox" class="checkbox" data-indeterminate>   … indeterminate は JS でしか付けられないため
// ds.css には含めない（利用者の画面では本物の :hover 等だけが効く）。
(() => {
  const STATES = [
    [/:hover\b/g, '[data-force-state~="hover"]'],
    [/:focus-visible\b|:focus-within\b|:focus\b/g, '[data-force-state~="focus"]'],
    [/:active\b/g, '[data-force-state~="pressed"]'],
  ];
  const TRIGGER = /:(hover|focus-visible|focus-within|focus|active)\b/;

  const convert = (rules) => {
    let out = "";
    for (const rule of rules) {
      if (rule instanceof CSSStyleRule) {
        if (!TRIGGER.test(rule.selectorText)) continue;
        const selector = STATES.reduce((sel, [re, to]) => sel.replace(re, to), rule.selectorText);
        out += `${selector} { ${rule.style.cssText} }\n`;
      } else if (rule instanceof CSSMediaRule) {
        const inner = convert(rule.cssRules);
        if (inner) out += `@media ${rule.conditionText} {\n${inner}}\n`;
      } else if (rule.cssRules) {
        // @layer や @supports の中身もたどる（ds.css の部品はすべて @layer components の中）
        out += convert(rule.cssRules);
      }
    }
    return out;
  };

  const build = () => {
    let css = "";
    for (const sheet of document.styleSheets) {
      if (!sheet.href || !/ds\.css$/.test(sheet.href)) continue;
      try { css += convert(sheet.cssRules); } catch { /* 読めないシート（file:// 等）は飛ばす */ }
    }
    if (!css) return;
    const style = document.createElement("style");
    style.dataset.forceState = "";
    style.textContent = `@layer components {\n${css}}`;
    document.head.append(style);
  };

  document.addEventListener("DOMContentLoaded", () => {
    for (const el of document.querySelectorAll("[data-indeterminate]")) el.indeterminate = true;
    // 押下・フォーカス状態の見本は操作させない（クリックで状態が変わると見本にならないため）
    for (const el of document.querySelectorAll("[data-force-state]")) {
      el.setAttribute("tabindex", "-1");
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });
  if (document.readyState === "complete") build();
  else window.addEventListener("load", build);
})();

/**
 * サンドボックスに新しい画面を作る。
 *
 *   npm run sandbox:new -- <名前> "<画面名>" ["<説明>"]
 *   例: npm run sandbox:new -- invoice-list "請求一覧" "請求書を確認・送付する画面"
 *
 *   sandbox/_template.html をコピーして sandbox/screens/<名前>.html を作り、一覧ページを作り直す。
 *   <名前> は半角英小文字・数字・ハイフンだけ（ファイル名と URL になるため）。
 */
import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSandboxIndex } from "./build-sandbox-index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const [slug, title, desc = ""] = process.argv.slice(2);
if (!slug || !title) {
  console.error('使い方: npm run sandbox:new -- <名前> "<画面名>" ["<説明>"]\n例:     npm run sandbox:new -- invoice-list "請求一覧"');
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`<名前> は半角英小文字・数字・ハイフンだけにしてください（例: invoice-list）。受け取った値: ${slug}`);
  process.exit(1);
}

const out = path.join(projectRoot, "sandbox/screens", `${slug}.html`);
const exists = await access(out).then(() => true, () => false);
if (exists) {
  console.error(`sandbox/screens/${slug}.html はすでにあります。別の名前にするか、既存のファイルを直接編集してください`);
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const template = await readFile(path.join(projectRoot, "sandbox/_template.html"), "utf8");
await writeFile(out, template.replaceAll("{{TITLE}}", esc(title)).replaceAll("{{DESCRIPTION}}", esc(desc)));
const n = await buildSandboxIndex();
console.log(`✓ sandbox/screens/${slug}.html を作りました（一覧: ${n}画面）`);
console.log("  npm run dev で確認できます → http://localhost:5173/sandbox/");

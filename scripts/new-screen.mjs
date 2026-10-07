/**
 * サンドボックスに新しい画面を作る。
 *
 *   npm run sandbox:new -- <名前> "<画面名>" ["<説明>"]            → sandbox/private/<名前>.html（非公開・既定）
 *   npm run sandbox:new -- <名前> "<画面名>" ["<説明>"] --public   → sandbox/screens/<名前>.html（公開の見本）
 *   例: npm run sandbox:new -- invoice-list "請求一覧" "請求書を確認・送付する画面"
 *
 *   sandbox/_template.html をコピーして画面を作り、一覧ページを作り直す。
 *   リポジトリは public なので、既定は gitignore 済みの private/ に作る。screens/ は架空のデータだけの見本用。
 *   <名前> は半角英小文字・数字・ハイフンだけ（ファイル名と URL になるため）。
 */
import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSandboxIndex } from "./build-sandbox-index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const isPublic = args.includes("--public");
const [slug, title, desc = ""] = args.filter((a) => a !== "--public");
if (!slug || !title) {
  console.error('使い方: npm run sandbox:new -- <名前> "<画面名>" ["<説明>"] [--public]\n例:     npm run sandbox:new -- invoice-list "請求一覧"');
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`<名前> は半角英小文字・数字・ハイフンだけにしてください（例: invoice-list）。受け取った値: ${slug}`);
  process.exit(1);
}

// private/ と screens/ で同じ名前があると一覧で紛らわしいので、どちらかにあれば作らない
for (const dir of ["private", "screens"]) {
  const exists = await access(path.join(projectRoot, "sandbox", dir, `${slug}.html`)).then(() => true, () => false);
  if (exists) {
    console.error(`sandbox/${dir}/${slug}.html はすでにあります。別の名前にするか、既存のファイルを直接編集してください`);
    process.exit(1);
  }
}

const dir = isPublic ? "screens" : "private";
await mkdir(path.join(projectRoot, "sandbox", dir), { recursive: true });
const out = path.join(projectRoot, "sandbox", dir, `${slug}.html`);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const template = await readFile(path.join(projectRoot, "sandbox/_template.html"), "utf8");
await writeFile(out, template.replaceAll("{{TITLE}}", esc(title)).replaceAll("{{DESCRIPTION}}", esc(desc)));
const n = await buildSandboxIndex();
console.log(`✓ sandbox/${dir}/${slug}.html を作りました（一覧: ${n}画面）`);
console.log(isPublic
  ? "  公開の見本です。GitHub に上がり誰でも見られるので、架空のデータだけで作ってください"
  : "  非公開です（git に入りません）。この PC にしか残らないので、共有やバックアップは別の手段で");
console.log("  npm run dev で確認できます → http://localhost:5173/sandbox/");

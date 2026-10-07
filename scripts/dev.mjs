/**
 * ローカルでカタログとサンドボックスを確認するための開発サーバー。
 *
 *   npm run dev  →  http://localhost:5173/sandbox/（サンドボックス）
 *                   http://localhost:5173/preview/（コンポーネントのカタログ）
 *
 *   ・起動時に npm run build を1回実行する（dist/ds.css・アイコン・カタログ・サンドボックスの一覧）
 *   ・tokens/ と src/ の変更を見張り、dist/ds.css を作り直す（vite build --watch）
 *   ・sandbox/screens/ にファイルが増減したら一覧を作り直す
 *   ブラウザの自動再読み込みはしない（保存したら手で再読み込みする）。依存パッケージは増やさない。
 */
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSandboxIndex } from "./build-sandbox-index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT ?? 5173);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

console.log("初回ビルド中…");
const first = spawnSync(npm, ["run", "build"], { cwd: projectRoot, stdio: "inherit" });
if (first.status !== 0) process.exit(first.status ?? 1);

// ds.css の作り直し（tokens / src の変更を vite が見張る）
const vite = spawn(npx, ["vite", "build", "--watch", "--logLevel", "warn"], { cwd: projectRoot, stdio: "inherit", env: { ...process.env, DS_DEV: "1" } });

// 画面の増減で一覧を作り直す
let timer;
watch(path.join(projectRoot, "sandbox/screens"), () => {
  clearTimeout(timer);
  timer = setTimeout(() => buildSandboxIndex().then((n) => console.log(`↻ sandbox/index.html（${n}画面）`)), 200);
});

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (urlPath === "/") urlPath = "/sandbox/";
    let file = path.join(projectRoot, urlPath);
    if (!file.startsWith(projectRoot)) { res.writeHead(403).end(); return; }
    if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`\nサンドボックス: http://localhost:${PORT}/sandbox/`);
  console.log(`カタログ:       http://localhost:${PORT}/preview/`);
  console.log("止めるときは Ctrl+C");
});

process.on("SIGINT", () => { vite.kill(); process.exit(0); });

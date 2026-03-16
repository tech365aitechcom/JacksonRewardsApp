/**
 * Downloads all animaapp.com images to /public/assets/animaapp/
 * and replaces every URL in source files with the local path.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";
import https from "https";
import { glob } from "fs/promises";
import { readdir, readFile, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_ASSETS = join(ROOT, "public", "assets", "animaapp");

// All source file directories to scan and replace
const SOURCE_DIRS = [
  join(ROOT, "app"),
  join(ROOT, "components"),
  join(ROOT, "hooks"),
  join(ROOT, "lib"),
  join(ROOT, "contexts"),
];

const BASE_URL = "https://c.animaapp.com";

// ─── helpers ────────────────────────────────────────────────────────────────

function urlToLocalPath(url) {
  // https://c.animaapp.com/1jLgqlGD/img/polygon-1.svg
  // → public/assets/animaapp/1jLgqlGD/img/polygon-1.svg
  const rel = url.replace(BASE_URL, ""); // /1jLgqlGD/img/polygon-1.svg
  return {
    disk: join(PUBLIC_ASSETS, rel),
    web: `/assets/animaapp${rel}`,
  };
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    mkdirSync(dirname(dest), { recursive: true });
    const file = createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close();
        reject(err);
      });
  });
}

async function getAllSourceFiles(dirs) {
  const files = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name === ".next" || e.name === "out") continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (/\.(js|jsx|ts|tsx|css|json)$/.test(e.name)) {
        files.push(full);
      }
    }
  }
  for (const d of dirs) await walk(d);
  return files;
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Collect all unique animaapp.com URLs from source files
  console.log("Scanning source files for animaapp.com URLs...");
  const sourceFiles = await getAllSourceFiles(SOURCE_DIRS);
  const urlSet = new Set();
  const URL_REGEX = /https:\/\/c\.animaapp\.com\/[^\s"'`\\)>]+/g;

  for (const f of sourceFiles) {
    const content = readFileSync(f, "utf8");
    const matches = content.match(URL_REGEX) || [];
    for (const m of matches) urlSet.add(m.trim());
  }

  const urls = [...urlSet].filter((u) => u !== BASE_URL);
  console.log(`Found ${urls.length} unique animaapp.com image URLs.\n`);

  // 2. Download each image
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failedUrls = [];

  for (const url of urls) {
    const { disk, web } = urlToLocalPath(url);
    if (existsSync(disk)) {
      skipped++;
      continue;
    }
    try {
      await download(url, disk);
      downloaded++;
      if (downloaded % 20 === 0) console.log(`  Downloaded ${downloaded}/${urls.length}...`);
    } catch (err) {
      failed++;
      failedUrls.push({ url, err: err.message });
    }
  }

  console.log(`\nDownload complete: ${downloaded} downloaded, ${skipped} already existed, ${failed} failed.\n`);
  if (failedUrls.length) {
    console.log("Failed URLs:");
    failedUrls.forEach(({ url, err }) => console.log(`  ✗ ${url} — ${err}`));
    console.log();
  }

  // 3. Build URL → local path mapping (only successfully downloaded)
  const mapping = [];
  for (const url of urls) {
    const { disk, web } = urlToLocalPath(url);
    if (existsSync(disk)) {
      mapping.push({ url, web });
    }
  }

  // Sort longest URL first to avoid partial replacements
  mapping.sort((a, b) => b.url.length - a.url.length);

  // 4. Replace URLs in all source files
  console.log("Replacing URLs in source files...");
  let filesChanged = 0;

  for (const f of sourceFiles) {
    let content = readFileSync(f, "utf8");
    let changed = false;
    for (const { url, web } of mapping) {
      if (content.includes(url)) {
        content = content.split(url).join(web);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(f, content, "utf8");
      filesChanged++;
    }
  }

  console.log(`Done! Updated ${filesChanged} source files.\n`);
  console.log("All animaapp.com images are now served locally from /public/assets/animaapp/");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});

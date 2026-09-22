import { execFile } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { promisify } from 'node:util';

// Checks tracked files and unignored new files. It does not scan historical commits.
// --files-from accepts a NUL-delimited `git ls-files -z` inventory.
const inventoryIndex = process.argv.indexOf('--files-from');
let inventory;
try {
  inventory = inventoryIndex >= 0
    ? readFileSync(process.argv[inventoryIndex + 1], 'utf8')
    : (await promisify(execFile)('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' })).stdout;
} catch {
  console.error('Cannot read the Git inventory. Run from the repository root, or provide --files-from with a NUL-delimited file list.');
  process.exit(1);
}
const files = inventory.split('\0').filter(Boolean);
const forbidden = [
  /(^|\/)(node_modules|\.next|out|release|\.idea|\.claude|\.codex|\.agents|\.vscode)\//,
  /(^|\/)\.env(?!\.example$)(?:\.|$)/,
  /\.(?:apk|aab|log|hprof|jks|keystore|pem|p12|pfx)$/i,
  /(^|\/)(?:google-services\.json|local\.properties|key\.properties|keystore\.properties)$/,
  /^(?:ALTERNATIVE_UPDATE_METHOD\.js|UPDATED_BIOMETRIC_SCHEMA\.js|routes\/biometric-fixed\.js)$/,
  /^[^/]+\.(?:pdf|csv)$/i,
  /\.postman_collection.*\.json$/,
  /^assets\/c__Users_/,
  /^app\/\(onboarding\)\/select-age\/draft\.jsx$/,
];
const signatures = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['secret token', /\b(?:sk_live_|sk_test_|ghp_|github_pat_|AKIA)[A-Za-z0-9_]{12,}/g],
  ['JWT', /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}/g],
];
const binary = /\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|mp3|mp4|pdf|apk|aab|jar|dm)$/i;
let failures = 0;
for (const file of files) {
  let size;
  try { size = statSync(file).size; } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Tracked deletion needs staging: ${file}`);
      failures++;
      continue;
    }
    throw error;
  }
  if (forbidden.some(pattern => pattern.test(file))) {
    console.error(`Excluded handoff file is still tracked: ${file}`);
    failures++;
  }
  if (size > 10 * 1024 * 1024) {
    console.error(`Review large tracked file (${Math.round(size / 1024 / 1024)} MB): ${file}`);
    failures++;
  }
  if (binary.test(file)) continue;
  const source = readFileSync(file, 'utf8');
  for (const [label, pattern] of signatures) {
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index).split('\n').length;
      console.error(`Possible ${label}: ${file}:${line}`);
      failures++;
    }
  }
}
console.log(`Checked ${files.length} candidate paths; ${failures} handoff issue(s).`);
console.log('Pattern checks are not a complete secret audit. Review history and service ownership separately.');
process.exitCode = failures ? 1 : 0;

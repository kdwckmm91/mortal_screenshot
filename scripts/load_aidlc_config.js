// scripts/load_aidlc_config.js
//
// Load project-specific AIDLC_* settings from a repo-local config file
// and expose them as environment variables.
//
// - GitHub Actions: appends to $GITHUB_ENV (default when GITHUB_ENV exists)
// - Local: prints KEY=VALUE lines to stdout (default)
//
// Precedence: existing process.env wins (we do NOT overwrite already-set envs).

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { format: null };
  for (const raw of argv) {
    if (raw.startsWith('--format=')) {
      args.format = raw.slice('--format='.length);
    }
  }
  return args;
}

function resolveRepoRoot() {
  if (process.env.GITHUB_WORKSPACE) return process.env.GITHUB_WORKSPACE;
  // scripts/ 配下から repo root を推定
  return path.resolve(__dirname, '..');
}

function loadJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Config must be a JSON object: ${filePath}`);
  }
  return parsed;
}

function coerceEnvValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const repoRoot = resolveRepoRoot();
  const configRelPath = process.env.AIDLC_CONFIG_PATH || '.github/aidlc-config.json';
  const configPath = path.resolve(repoRoot, configRelPath);

  const config = loadJson(configPath);

  const resolved = {};
  for (const [key, rawValue] of Object.entries(config)) {
    const value = coerceEnvValue(rawValue);
    if (!value) continue;

    // Only set env vars that are not already set.
    if (process.env[key] && String(process.env[key]).trim() !== '') continue;

    if (/[\r\n]/.test(value)) {
      throw new Error(`Env value for ${key} contains a newline; not supported.`);
    }

    resolved[key] = value;
  }

  const format = args.format || (process.env.GITHUB_ENV ? 'github-env' : 'dotenv');

  if (format === 'github-env') {
    const envFile = process.env.GITHUB_ENV;
    if (!envFile) {
      throw new Error('GITHUB_ENV is not set; cannot use --format=github-env');
    }

    const lines = Object.entries(resolved)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    if (lines.length > 0) {
      fs.appendFileSync(envFile, lines + '\n', 'utf8');
    }

    console.log(`Loaded ${Object.keys(resolved).length} config values from ${configRelPath}`);
    return;
  }

  if (format === 'json') {
    process.stdout.write(JSON.stringify(resolved, null, 2) + '\n');
    return;
  }

  // dotenv (default)
  for (const [k, v] of Object.entries(resolved)) {
    process.stdout.write(`${k}=${v}\n`);
  }
}

try {
  main();
} catch (err) {
  const msg = err && err.message ? err.message : String(err);
  console.error(`load_aidlc_config failed: ${msg}`);
  process.exit(1);
}

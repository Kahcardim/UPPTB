import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const distRoot = resolve(process.cwd(), 'dist');
const debtConfig = JSON.parse(await readFile(resolve(process.cwd(), 'config/audit-debt.json'), 'utf8'));
const debtItems = debtConfig.items ?? [];
const debtByPath = new Map(debtItems.map((item) => [item.path, item]));
const seenDebt = new Set();

const requiredRuntime = [
  'assets/turtles/turtle-01.webp',
  'assets/turtles/turtle-31.webp',
  'assets/alice-states/alice_01.webp',
  'assets/alice-states/alice_30.webp',
  'assets/sphynx-cat.svg',
  'docs/alice-30-estados.pdf',
  'build.json'
];

const isExternal = (value) =>
  /^(?:[a-z]+:)?\/\//i.test(value) ||
  /^(?:mailto:|tel:|data:|javascript:)/i.test(value) ||
  value.startsWith('#');

const normalizeReference = (htmlPath, raw) => {
  const clean = raw.split('#')[0].split('?')[0].trim();
  if (!clean || isExternal(clean)) return null;
  const absolute = clean.startsWith('/')
    ? resolve(distRoot, clean.replace(/^\/+/, ''))
    : resolve(dirname(htmlPath), clean);
  return { absolute, relative: relative(distRoot, absolute).replaceAll('\\\\', '/') };
};

const htmlPaths = (await readdir(distRoot))
  .filter((name) => name.endsWith('.html'))
  .map((name) => resolve(distRoot, name));

const missing = [];
const governanceErrors = [];
const today = Date.now();
const maxAgeMs = Number(debtConfig.maxAgeDays ?? 30) * 86400000;

for (const item of debtItems) {
  if (!item.path || !item.decision || !item.createdAt) {
    governanceErrors.push('dívida sem path/decision/createdAt: ' + JSON.stringify(item));
    continue;
  }
  const age = today - Date.parse(item.createdAt);
  if (!Number.isFinite(age) || age > maxAgeMs) {
    governanceErrors.push(`dívida expirada ou sem data válida: ${item.path} (${item.decision})`);
  }
}

for (const htmlPath of htmlPaths) {
  const html = await readFile(htmlPath, 'utf8');
  const references = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const raw of references) {
    const ref = normalizeReference(htmlPath, raw);
    if (!ref) continue;
    try {
      await access(ref.absolute);
    } catch {
      const debt = debtByPath.get(ref.relative);
      if (debt) seenDebt.add(ref.relative);
      else missing.push({ page: relative(distRoot, htmlPath), path: ref.relative });
    }
  }
}

for (const runtimePath of requiredRuntime) {
  try {
    await access(resolve(distRoot, runtimePath));
  } catch {
    const debt = debtByPath.get(runtimePath);
    if (debt) seenDebt.add(runtimePath);
    else missing.push({ page: '[runtime contract]', path: runtimePath });
  }
}

for (const item of debtItems) {
  if (!seenDebt.has(item.path)) {
    governanceErrors.push(`dívida obsoleta: ${item.path} já não está ausente; remova ${item.decision}`);
  }
}

if (missing.length) {
  console.error('Build incompleto. Referências locais ausentes no artefato:');
  missing.forEach((item) => console.error(` - ${item.page} -> ${item.path}`));
}
if (governanceErrors.length) {
  console.error('Governança de dívida inválida:');
  governanceErrors.forEach((item) => console.error(' - ' + item));
}
if (missing.length || governanceErrors.length) process.exit(1);

console.log(`Build reference gate: OK (${htmlPaths.length} HTMLs validados · ${debtItems.length} dívidas permitidas)`);

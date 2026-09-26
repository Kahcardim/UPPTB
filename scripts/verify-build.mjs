import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const distRoot = resolve(process.cwd(), 'dist');
const debtFile = resolve(process.cwd(), 'config/audit-debt.json');
const auditDebt = JSON.parse(await readFile(debtFile, 'utf8'));
const debtItems = auditDebt.items ?? [];
const knownAuditDebt = new Set(debtItems.map((item) => item.path));

const requiredRuntime = [
  'assets/turtles/turtle-01.webp',
  'assets/turtles/turtle-31.webp',
  'assets/alice-states/alice_01.webp',
  'assets/alice-states/alice_30.webp',
  'assets/sphynx-local.svg',
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

  return {
    absolute,
    relative: relative(distRoot, absolute).replaceAll('\\\\', '/')
  };
};

const htmlPaths = (await readdir(distRoot))
  .filter((name) => name.endsWith('.html'))
  .map((name) => resolve(distRoot, name));

const missing = [];
const allowedDebt = [];

for (const htmlPath of htmlPaths) {
  const html = await readFile(htmlPath, 'utf8');
  const references = [
    ...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)
  ].map((match) => match[1]);

  for (const raw of references) {
    const ref = normalizeReference(htmlPath, raw);
    if (!ref) continue;

    try {
      await access(ref.absolute);
    } catch {
      if (knownAuditDebt.has(ref.relative)) {
        allowedDebt.push({ page: relative(distRoot, htmlPath), path: ref.relative });
      } else {
        missing.push({ page: relative(distRoot, htmlPath), path: ref.relative });
      }
    }
  }
}

for (const runtimePath of requiredRuntime) {
  try {
    await access(resolve(distRoot, runtimePath));
  } catch {
    missing.push({ page: '[runtime contract]', path: runtimePath });
  }
}

const debtErrors = [];
const today = new Date();
for (const item of debtItems) {
  if (!item.path || !item.decision || !item.expiresAt) {
    debtErrors.push(`dívida incompleta: ${JSON.stringify(item)}`);
    continue;
  }

  if (new Date(item.expiresAt) < today) {
    debtErrors.push(`dívida expirada: ${item.path} (${item.decision})`);
  }

  try {
    await access(resolve(distRoot, item.path));
    debtErrors.push(`dívida obsoleta: ${item.path} já existe no artefato e deve sair da allowlist`);
  } catch {}
}

if (allowedDebt.length) {
  console.warn('Dívidas de auditoria ainda permitidas:');
  for (const item of allowedDebt) console.warn(` - ${item.page} -> ${item.path}`);
}

if (missing.length || debtErrors.length) {
  if (missing.length) {
    console.error('Build incompleto. Referências locais ausentes no artefato:');
    for (const item of missing) console.error(` - ${item.page} -> ${item.path}`);
  }
  if (debtErrors.length) {
    console.error('Governança de dívida inválida:');
    for (const item of debtErrors) console.error(` - ${item}`);
  }
  process.exit(1);
}

console.log(`Build reference gate: OK (${htmlPaths.length} HTMLs validados · ${debtItems.length} dívidas permitidas)`);

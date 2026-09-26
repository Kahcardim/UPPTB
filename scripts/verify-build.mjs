import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const distRoot = resolve(process.cwd(), 'dist');
const debtConfigPath = resolve(process.cwd(), 'config/audit-debt.json');

const debtConfig = JSON.parse(await readFile(debtConfigPath, 'utf8'));
const auditDebt = new Map((debtConfig.items ?? []).map((item) => [item.path, item]));

for (const item of auditDebt.values()) {
  if (!item.decisionId || !item.reason || !item.expiresOn) {
    console.error(`Dívida inválida em ${item.path}: decisionId, reason e expiresOn são obrigatórios.`);
    process.exit(1);
  }

  if (Date.parse(item.expiresOn + 'T23:59:59Z') < Date.now()) {
    console.error(`Dívida expirada em ${item.path}: ${item.expiresOn}.`);
    process.exit(1);
  }
}

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
const observedDebt = new Set();

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
      const debt = auditDebt.get(ref.relative);
      if (debt) {
        observedDebt.add(ref.relative);
        allowedDebt.push({ page: relative(distRoot, htmlPath), path: ref.relative, decisionId: debt.decisionId });
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

for (const item of auditDebt.values()) {
  if (!observedDebt.has(item.path)) {
    console.error(`Dívida obsoleta: ${item.path} está listada, mas não foi observada como ausente.`);
    process.exit(1);
  }
}

if (allowedDebt.length) {
  console.warn('Dívidas de auditoria permitidas:');
  for (const item of allowedDebt) {
    console.warn(` - ${item.page} -> ${item.path} (${item.decisionId})`);
  }
}

if (missing.length) {
  console.error('Build incompleto. Referências locais ausentes no artefato:');
  for (const item of missing) {
    console.error(` - ${item.page} -> ${item.path}`);
  }
  process.exit(1);
}

console.log(`Build reference gate: OK (${htmlPaths.length} HTMLs validados · ${auditDebt.size} dívidas ativas)`);

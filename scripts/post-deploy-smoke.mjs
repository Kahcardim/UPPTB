const base = process.env.PUBLIC_BASE_URL;
const expectedSha = process.env.EXPECTED_SHA;

if (!base || !expectedSha) {
  console.error('PUBLIC_BASE_URL e EXPECTED_SHA são obrigatórios');
  process.exit(1);
}

const root = base.endsWith('/') ? base : base + '/';
const paths = ['index.html','laboratorio-beyblade.html','ingles.html','memorias.html','alice.html'];
const failures = [];

for (const path of paths) {
  const response = await fetch(new URL(path, root), { redirect: 'follow' });
  if (!response.ok) failures.push(`${path}: HTTP ${response.status}`);
}

const buildResponse = await fetch(new URL('build.json', root), { cache: 'no-store' });
if (!buildResponse.ok) {
  failures.push(`build.json: HTTP ${buildResponse.status}`);
} else {
  const build = await buildResponse.json();
  if (build.sha !== expectedSha) failures.push(`SHA publicado ${build.sha} != ${expectedSha}`);
}

const pdfResponse = await fetch(new URL('docs/alice-30-estados.pdf', root), { cache: 'no-store' });
if (!pdfResponse.ok) {
  failures.push(`PDF Alice: HTTP ${pdfResponse.status}`);
} else {
  const bytes = new Uint8Array(await pdfResponse.arrayBuffer());
  const signature = String.fromCharCode(...bytes.slice(0, 4));
  if (signature !== '%PDF') failures.push('PDF Alice sem assinatura %PDF');
}

if (failures.length) {
  console.error('Post-deploy smoke: FAIL');
  failures.forEach((failure) => console.error(' - ' + failure));
  process.exit(1);
}

console.log(`Post-deploy smoke: OK · ${paths.length} páginas · SHA ${expectedSha}`);

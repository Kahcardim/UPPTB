const base = (process.env.PUBLIC_BASE_URL || '').replace(/\/+$/, '');
const expectedSha = process.env.EXPECTED_SHA || '';
if (!base || !expectedSha) {
  console.error('PUBLIC_BASE_URL e EXPECTED_SHA são obrigatórios');
  process.exit(1);
}

const paths = [
  'index.html',
  'laboratorio-beyblade.html',
  'ingles.html',
  'memorias.html',
  'alice.html',
  'docs/alice-30-estados.pdf',
  'assets/sphynx-local.svg'
];

async function fetchWithRetry(path, attempts = 12) {
  let last;
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(`${base}/${path}`, { redirect: 'follow', cache: 'no-store' });
      last = response;
      if (response.ok) return response;
    } catch (error) {
      last = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error(`Falha pública em ${path}: ${last?.status || last?.message || 'sem resposta'}`);
}

const buildResponse = await fetchWithRetry('build.json');
const build = await buildResponse.json();
if (build.sha !== expectedSha) {
  throw new Error(`SHA público divergente: esperado ${expectedSha}, recebido ${build.sha}`);
}

for (const path of paths) {
  const response = await fetchWithRetry(path);
  console.log(`PUBLIC 200 ${path} · ${response.headers.get('content-type') || 'sem content-type'}`);
}

console.log(`Public smoke: OK · ${expectedSha}`);

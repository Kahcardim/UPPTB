const baseUrl = process.env.PAGE_URL;
const expectedSha = process.env.EXPECTED_SHA;

if (!baseUrl || !expectedSha) {
  console.error('PAGE_URL e EXPECTED_SHA são obrigatórios.');
  process.exit(1);
}

const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
const required = [
  'index.html',
  'laboratorio-beyblade.html',
  'ingles.html',
  'memorias.html',
  'alice.html',
  'docs/alice-30-estados.pdf'
];

async function get(path) {
  const response = await fetch(new URL(path, base), { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response;
}

let lastError;
for (let attempt = 1; attempt <= 12; attempt += 1) {
  try {
    const build = await (await get('build.json')).json();
    if (build.sha !== expectedSha) {
      throw new Error(`build.json ainda aponta para ${build.sha}; esperado ${expectedSha}`);
    }

    for (const path of required) await get(path);

    console.log(`Post-deploy smoke: OK · ${expectedSha} · tentativa ${attempt}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.warn(`Post-deploy smoke tentativa ${attempt}/12: ${error.message}`);
    if (attempt < 12) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

console.error('Post-deploy smoke: FAIL');
console.error(lastError?.stack || lastError);
process.exit(1);

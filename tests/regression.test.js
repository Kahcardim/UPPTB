import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPublic = (path) => readFile(new URL('../public/' + path, import.meta.url), 'utf8');
const readRoot = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
const campusPages = ['index.html','laboratorio-beyblade.html','ingles.html','memorias.html'];

test('campi essenciais usam assets sem cache bust manual e entregam Efeito Alice como módulo', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /<main id="conteudo">/);
    assert.match(html, /id="random-asset-plane"/);
    assert.match(html, /href="styles\.css"/);
    assert.match(html, /type="module" src="app\.js"/);
    assert.match(html, /type="module" src="alice\.js"/);
    assert.doesNotMatch(html, /\?v=\d+/);
  }
});

test('nome canônico atual aparece na Home e no README', async () => {
  const html = await readPublic('index.html');
  const readme = await readRoot('README.md');
  assert.match(html, /Universidade publica turtles and bleys/);
  assert.match(readme, /Universidade publica turtles and bleys/);
});

test('Alice mantém domínio isolado e sem cache bust manual', async () => {
  const html = await readPublic('alice.html');
  const js = await readPublic('alice-page.js');
  assert.doesNotMatch(html, /id="random-asset-plane"/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /href="alice-page\.css"/);
  assert.match(html, /type="module" src="alice-page\.js"/);
  assert.doesNotMatch(html, /\?v=\d+/);
  assert.match(js, /from '\.\/alice-states\.js'/);
  assert.doesNotMatch(js, /aliceAssetVersion/);
});

test('AL-CT01: quatro famílias de borboletas continuam definidas', async () => {
  const js = await readPublic('alice-page.js');
  for (const family of ['pink','blue','white','black']) {
    assert.ok(js.includes(`alice-butterfly-${family}`) || js.includes(`'${family}'`), 'família ausente: ' + family);
  }
  assert.match(js, /index % 4/);
});

test('AL-CT02/03: reduced-motion continua bloqueando autoavanço e animação', async () => {
  const js = await readPublic('alice-page.js');
  const css = await readPublic('alice-page.css');
  assert.match(js, /prefersReducedMotion/);
  assert.match(js, /if \(paused \|\| prefersReducedMotion \|\| document\.hidden\) return/);
  assert.match(js, /if \(prefersReducedMotion\) return/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.alice-butterfly \.butterfly-wings\{animation:none;\}/);
});

test('AL-CT05: mural não alimentar permanece na Alice', async () => {
  const html = await readPublic('alice.html');
  assert.match(html, /class="do-not-feed alice-do-not-feed"/);
  assert.match(html, /FAVOR NÃO ALIMENTAR AS TARTARUGAS/);
});

test('AUD-21: Efeito Alice permanece canônico nos quatro campi', async () => {
  const js = await readPublic('alice.js');
  assert.match(js, /const alicePages = \['home', 'lab', 'english', 'memories'\]/);
  assert.match(js, /assets\/gato\.png/);
  assert.match(js, /assets\/chapeleiro\.png/);
  assert.match(js, /placeDecorationSafely/);
});

test('AUD-04/AUD-24: decoração usa política única de conteúdo acima do caos', async () => {
  const safe = await readPublic('safe-layout.js');
  const randomizer = await readPublic('randomizer.js');
  const alice = await readPublic('alice.js');
  assert.match(safe, /placeDecorationSafely/);
  assert.match(safe, /element\.hidden = true/);
  assert.match(safe, /main h1/);
  assert.match(safe, /main button/);
  assert.match(randomizer, /placeDecorationSafely/);
  assert.match(alice, /placeDecorationSafely/);
});

test('AUD-08: gato pelado usa asset local e continua migratório', async () => {
  const js = await readPublic('randomizer.js');
  const svg = await readPublic('assets/sphynx-cat.svg');
  assert.match(js, /catPage: campusPages\[Math\.floor\(Math\.random\(\) \* campusPages\.length\)\]/);
  assert.match(js, /assets\/sphynx-cat\.svg/);
  assert.doesNotMatch(js, /upload\.wikimedia\.org/);
  assert.match(svg, /GATO PELADO DO TI/);
});

test('AUD-06: blader legado permanece aprovado em Memórias e Beyblade nasce só no Lab', async () => {
  const js = await readPublic('randomizer.js');
  const labAssets = [
    'pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp',
    'ekusu-remade.webp','Beyblade_X_-_Ekusu_Kurosu.webp','multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
  ];
  const roaming = js.split('const roamingImages = [')[1]?.split('];')[0] ?? '';
  for (const asset of labAssets) assert.equal(roaming.includes(asset), false, 'Beyblade vazou: '+asset);
  for (const asset of ['images-2-.jpg','images-1-.jpg','images.jpg']) {
    const line = js.split('\n').find((value)=>value.includes(asset));
    assert.match(line ?? '', /fixedPage: 'memories'/);
  }
});

test('AUD-07: build gera PDF dos 30 estados e botão permanece', async () => {
  const html = await readPublic('alice.html');
  const generator = await readRoot('scripts/generate-alice-pdf.mjs');
  const pkg = JSON.parse(await readRoot('package.json'));
  assert.match(html, /docs\/alice-30-estados\.pdf/);
  assert.match(generator, /estadosAlice/);
  assert.match(generator, /Alice PDF: OK/);
  assert.match(pkg.scripts.build, /generate-alice-pdf\.mjs/);
});

test('AUD-26: dívida permitida possui fonte única', async () => {
  const debt = JSON.parse(await readRoot('config/audit-debt.json'));
  const gate = await readRoot('scripts/verify-build.mjs');
  const smoke = await readRoot('scripts/smoke-dist.mjs');
  assert.ok(Array.isArray(debt.items));
  assert.match(gate, /config\/audit-debt\.json/);
  assert.match(smoke, /config\/audit-debt\.json/);
  assert.doesNotMatch(gate, /alice\.js'\s*,\s*'docs\/alice-30-estados\.pdf/);
});

test('AUD-09: CI usa lockfile congelado sem bypass de build scripts', async () => {
  for (const path of ['.github/workflows/regression.yml','.github/workflows/pages.yml']) {
    const yml = await readRoot(path);
    assert.match(yml, /pnpm install --frozen-lockfile/);
    assert.doesNotMatch(yml, /--no-frozen-lockfile|--dangerously-allow-all-builds/);
  }
});

test('AUD-20: Pages executa smoke público após deploy', async () => {
  const yml = await readRoot('.github/workflows/pages.yml');
  const script = await readRoot('scripts/post-deploy-smoke.mjs');
  assert.match(yml, /verify-public:/);
  assert.match(yml, /PUBLIC_BASE_URL/);
  assert.match(yml, /EXPECTED_SHA/);
  assert.match(script, /build\.json/);
  assert.match(script, /alice-30-estados\.pdf/);
});

test('Home mantém identidade única, quatro atalhos Turtle e preview de Inglês', async () => {
  const html = await readPublic('index.html');
  assert.equal((html.match(/assets\/upptb-collage\.webp/g) ?? []).length, 1);
  const links = html.split('class="hero-actions home-page-links"')[1]?.split('</div>')[0] ?? '';
  assert.equal((links.match(/class="button/g) ?? []).length, 4);
  assert.equal((links.match(/turtle-mark\.svg/g) ?? []).length, 4);
  const english = html.split('class="english-preview-grid"')[1]?.split('</div>')[0] ?? '';
  assert.equal((english.match(/<article>/g) ?? []).length, 3);
});

test('fóssil fundador permanece intacto', async () => {
  const html = await readPublic('index.html');
  assert.match(html, /Let's rip, dude\. Turtle Step\. Robin loses\. Multi reborn\. Site created\./);
});

test('build preserva runtime, PDF, Sphynx local e SHA', async () => {
  const config = await readRoot('vite.config.js');
  const gate = await readRoot('scripts/verify-build.mjs');
  assert.match(config, /public\/assets/);
  assert.match(config, /upptb-build-sha/);
  assert.match(gate, /docs\/alice-30-estados\.pdf/);
  assert.match(gate, /assets\/sphynx-cat\.svg/);
  assert.match(gate, /build\.json/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPublic = (path) => readFile(new URL('../public/' + path, import.meta.url), 'utf8');
const readRoot = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');

const campusPages = ['index.html', 'laboratorio-beyblade.html', 'ingles.html', 'memorias.html'];

test('campi usam assets pelo bundler e não cache-bust manual', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /<main id="conteudo">/);
    assert.match(html, /id="random-asset-plane"/);
    assert.match(html, /href="styles\.css"/);
    assert.match(html, /src="app\.js"/);
    assert.doesNotMatch(html, /styles\.css\?v=|app\.js\?v=|alice\.js\?v=/);
    assert.doesNotMatch(html, /<script[^>]+alice\.js/);
  }
});

test('nome canônico está aplicado na Home e rodapés dos campi', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /Universidade publica turtles and bleys/);
  }
});

test('Efeito Alice é canônico e entra no bundle pelo app.js', async () => {
  const app = await readPublic('app.js');
  const alice = await readPublic('alice.js');
  assert.match(app, /import '\.\/alice\.js';/);
  assert.match(alice, /upptb-alice-characters-v2/);
  assert.match(alice, /assets\/gato\.png/);
  assert.match(alice, /assets\/chapeleiro\.png/);
  assert.match(alice, /placeDecorationSafely/);
});

test('Alice permanece isolada do randomizer global e sem cache-bust manual', async () => {
  const html = await readPublic('alice.html');
  assert.doesNotMatch(html, /id="random-asset-plane"/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /href="alice-page\.css"/);
  assert.match(html, /src="alice-page\.js"/);
  assert.doesNotMatch(html, /\?v=/);
});

test('engine da Alice usa SHA do build e preserva 4 famílias de borboletas', async () => {
  const js = await readPublic('alice-page.js');
  assert.doesNotMatch(js, /setInterval\s*\(/);
  assert.match(js, /from '\.\/alice-states\.js'/);
  assert.match(js, /upptb-build-sha/);
  assert.match(js, /index % 4 === 0 \? 'pink'/);
  assert.match(js, /index % 4 === 1 \? 'blue'/);
  assert.match(js, /index % 4 === 2 \? 'white' : 'black'/);
  assert.match(js, /wallpaperFrame\?\.prepend\(butterflyPlane\)/);
});

test('reduced-motion continua impedindo avanço automático dos carrosséis da Alice', async () => {
  const js = await readPublic('alice-page.js');
  assert.match(js, /prefersReducedMotion/);
  assert.match(js, /if \(paused \|\| prefersReducedMotion \|\| document\.hidden\) return/);
  assert.match(js, /if \(prefersReducedMotion\) return/);
});

test('mural não alimente permanece no domínio Alice', async () => {
  const html = await readPublic('alice.html');
  assert.match(html, /class="do-not-feed alice-do-not-feed"/);
  assert.match(html, /FAVOR NÃO ALIMENTAR AS TARTARUGAS/);
});

test('PDF dos 30 estados é gerado pelo build e continua linkado na Alice', async () => {
  const html = await readPublic('alice.html');
  const pkg = JSON.parse(await readRoot('package.json'));
  const generator = await readRoot('scripts/generate-alice-pdf.mjs');
  assert.match(html, /href="docs\/alice-30-estados\.pdf"/);
  assert.match(pkg.scripts.build, /generate-alice-pdf\.mjs/);
  assert.match(generator, /estadosAlice/);
  assert.match(generator, /alice-30-estados\.pdf/);
});

test('gato pelado é local e continua migratório entre os campi', async () => {
  const js = await readPublic('randomizer.js');
  const svg = await readPublic('assets/sphynx-local.svg');
  assert.match(js, /assets\/sphynx-local\.svg/);
  assert.doesNotMatch(js, /upload\.wikimedia\.org/);
  assert.match(js, /catPage: campusPages\[Math\.floor\(Math\.random\(\) \* campusPages\.length\)\]/);
  assert.match(svg, /GATO PELADO DO TI/);
});

test('regra de colisão é compartilhada por randomizer e Efeito Alice', async () => {
  const safe = await readPublic('safe-placement.js');
  const randomizer = await readPublic('randomizer.js');
  const alice = await readPublic('alice.js');
  assert.match(safe, /placeDecorationSafely/);
  assert.match(safe, /overlapsReadableContent/);
  assert.match(safe, /element\.hidden = true/);
  assert.match(randomizer, /placeDecorationSafely/);
  assert.match(alice, /placeDecorationSafely/);
});

test('randomizer mantém Beyblade no Lab e fotos legadas em Memórias', async () => {
  const js = await readPublic('randomizer.js');
  const labAssets = [
    'pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp',
    'ekusu-remade.webp',
    'Beyblade_X_-_Ekusu_Kurosu.webp',
    'multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
  ];
  const roamingSection = js.split('const roamingImages = [')[1]?.split('];')[0] ?? '';
  for (const asset of labAssets) assert.equal(roamingSection.includes(asset), false, 'Beyblade vazou: ' + asset);
  for (const asset of ['images-2-.jpg', 'images-1-.jpg', 'images.jpg']) {
    const line = js.split('\n').find((value) => value.includes(asset) && value.includes("fixedPage: 'memories'"));
    assert.ok(line, 'foto legada fora de Memórias: ' + asset);
  }
});

test('mapa aleatório persiste navegação e renova em F5', async () => {
  const js = await readPublic('randomizer.js');
  assert.match(js, /upptb-campus-distribution-v9/);
  assert.match(js, /navigationEntry\?\.type === 'reload'/);
  assert.match(js, /localStorage\.setItem\(campusStorageKey/);
});

test('registros antigos do runtime são podados sem apagar schemas atuais', async () => {
  const app = await readPublic('app.js');
  assert.match(app, /upptb-campus-distribution-v9/);
  assert.match(app, /upptb-alice-characters-v2/);
  assert.match(app, /function pruneLegacyStorage\(/);
});

test('fóssil fundador permanece intacto', async () => {
  const html = await readPublic('index.html');
  assert.match(html, /Let's rip, dude\. Turtle Step\. Robin loses\. Multi reborn\. Site created\./);
});

test('navegação preserva histórico e menu mobile', async () => {
  const js = await readPublic('router.js');
  const css = await readPublic('styles.css');
  assert.match(js, /scrollRestoration = 'manual'/);
  assert.match(js, /function setMobileMenu\(open\)/);
  assert.match(css, /html\.menu-open, html\.menu-open body/);
});

test('terminal institucional preserva os comandos MVP sem versão manual', async () => {
  const html = await readPublic('index.html');
  const js = await readPublic('terminal.js');
  assert.match(html, /src="terminal\.js"/);
  assert.doesNotMatch(html, /terminal\.js\?v=/);
  for (const command of ['help', 'status', 'lore', 'clear']) {
    assert.match(js, new RegExp("command === '" + command + "'"));
  }
});

test('Home preserva identidade única, quatro atalhos e preview de Inglês', async () => {
  const html = await readPublic('index.html');
  assert.equal((html.match(/assets\/upptb-collage\.webp/g) ?? []).length, 1);
  const linksBlock = html.split('class="hero-actions home-page-links"')[1]?.split('</div>')[0] ?? '';
  assert.equal((linksBlock.match(/class="button/g) ?? []).length, 4);
  const englishPreview = html.split('class="english-preview-grid"')[1]?.split('</div>')[0] ?? '';
  assert.equal((englishPreview.match(/<article>/g) ?? []).length, 3);
});

test('CSS protege composição atual da Home', async () => {
  const css = await readPublic('styles.css');
  assert.match(css, /html\[data-page="home"\] \.hero-copy \{[\s\S]*text-align: center/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.fossil \{[\s\S]*width: min\(58rem/);
  assert.match(css, /\.fossil \{[\s\S]*text-align: center/);
});

test('governança de dívida usa fonte única e está vazia após decisões AUD-21/AUD-07', async () => {
  const debt = JSON.parse(await readRoot('config/audit-debt.json'));
  const verify = await readRoot('scripts/verify-build.mjs');
  const smoke = await readRoot('scripts/smoke-dist.mjs');
  assert.deepEqual(debt.items, []);
  assert.match(verify, /config\/audit-debt\.json/);
  assert.match(smoke, /config\/audit-debt\.json/);
  assert.doesNotMatch(verify, /alice\.js',\s*'docs\/alice-30-estados\.pdf/);
});

test('pipeline usa frozen lockfile e smoke pós-deploy', async () => {
  const pages = await readRoot('.github/workflows/pages.yml');
  const regression = await readRoot('.github/workflows/regression.yml');
  assert.match(pages, /pnpm install --frozen-lockfile/);
  assert.match(regression, /pnpm install --frozen-lockfile/);
  assert.doesNotMatch(pages, /--dangerously-allow-all-builds/);
  assert.doesNotMatch(regression, /--dangerously-allow-all-builds/);
  assert.match(pages, /smoke-public\.mjs/);
});

test('build preserva assets dinâmicos e publica SHA rastreável', async () => {
  const config = await readRoot('vite.config.js');
  assert.match(config, /cpSync\(source, target, \{ recursive: true, force: true \}\)/);
  assert.match(config, /upptb-build-sha/);
  assert.match(config, /dist\/build\.json/);
});

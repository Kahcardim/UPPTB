import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPublic = (path) => readFile(new URL('../public/' + path, import.meta.url), 'utf8');
const readRoot = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');

const campusPages = ['index.html', 'laboratorio-beyblade.html', 'ingles.html', 'memorias.html'];

test('campi essenciais usam módulos atuais sem cache bust manual', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /<main id="conteudo">/);
    assert.match(html, /id="random-asset-plane"/);
    assert.match(html, /href="styles\.css"/);
    assert.match(html, /type="module" src="app\.js"/);
    assert.match(html, /type="module" src="alice\.js"/);
    assert.doesNotMatch(html, /(?:styles\.css|app\.js|alice\.js|terminal\.js)\?v=/);
    assert.doesNotMatch(html, /navigation\.js|ux-safety\.css/);
  }
});

test('Alice permanece isolada do plano aleatório global e sem versionamento manual', async () => {
  const html = await readPublic('alice.html');
  assert.doesNotMatch(html, /id="random-asset-plane"/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /type="module" src="app\.js"/);
  assert.match(html, /href="alice-page\.css"/);
  assert.match(html, /type="module" src="alice-page\.js"/);
  assert.doesNotMatch(html, /(?:styles\.css|app\.js|alice-page\.css|alice-page\.js)\?v=/);
});

test('engine da Alice mantém estado sem rotação automática e assets sem query manual', async () => {
  const js = await readPublic('alice-page.js');
  assert.doesNotMatch(js, /setInterval\s*\(/);
  assert.doesNotMatch(js, /restartRotation|rotatePhrase/);
  assert.match(js, /from '\.\/alice-states\.js'/);
  assert.doesNotMatch(js, /aliceAssetVersion|\?v=/);
  assert.match(js, /wallpaperFrame\?\.prepend\(butterflyPlane\)/);
  assert.match(js, /catZone\?\.append\(cat\)/);
});

test('AL-CT01: Alice mantém 15 borboletas e as quatro famílias visuais', async () => {
  const js = await readPublic('alice-page.js');
  assert.equal((js.match(/safeButterflyZones = \[/g) ?? []).length, 1);
  const zoneBlock = js.split('const safeButterflyZones = [')[1]?.split('];')[0] ?? '';
  assert.equal((zoneBlock.match(/\[[0-9]+,[0-9]+\]/g) ?? []).length, 15);
  for (const family of ['pink', 'blue', 'white', 'black']) {
    assert.ok(js.includes(`alice-butterfly-${family}`), 'família ausente: ' + family);
  }
});

test('AL-CT02/03: carrosséis da Alice respeitam reduced-motion', async () => {
  const js = await readPublic('alice-page.js');
  assert.match(js, /prefersReducedMotion/);
  assert.match(js, /if \(paused \|\| prefersReducedMotion \|\| document\.hidden\) return/);
  assert.match(js, /if \(prefersReducedMotion\) return/);
  assert.match(js, /\.alice-card-grid, #regras \.memory-grid/);
});

test('AL-CT05: mural não alimentar permanece na Alice', async () => {
  const html = await readPublic('alice.html');
  assert.match(html, /class="do-not-feed alice-do-not-feed"/);
  assert.match(html, /FAVOR NÃO ALIMENTAR AS TARTARUGAS/);
});

test('randomizer mantém Beyblade só no Lab, blader legado em Memórias e gato pelado local', async () => {
  const js = await readPublic('randomizer.js');
  const labAssets = [
    'pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp',
    'ekusu-remade.webp',
    'Beyblade_X_-_Ekusu_Kurosu.webp',
    'multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
  ];

  assert.ok(js.includes('const labOnlyImages = ['));
  assert.ok(js.includes("if (currentPage === 'lab') labOnlyImages.forEach(appendRoamingImage);"));

  const roamingSection = js.split('const roamingImages = [')[1]?.split('];')[0] ?? '';
  for (const asset of labAssets) {
    assert.equal(roamingSection.includes(asset), false, 'Beyblade vazou para roamingImages: ' + asset);
  }

  for (const asset of ['images-2-.jpg', 'images-1-.jpg', 'images.jpg']) {
    const line = js.split('\n').find(value => value.includes(asset) && value.includes("fixedPage: 'memories'"));
    assert.ok(line, 'foto legada fora de Memórias ou ausente: ' + asset);
  }

  assert.match(js, /assets\/sphynx-cat\.svg/);
  assert.doesNotMatch(js, /upload\.wikimedia\.org/);
});

test('AUD-04/24: decoração usa política única de prioridade do conteúdo', async () => {
  const randomizer = await readPublic('randomizer.js');
  const alice = await readPublic('alice.js');
  const safety = await readPublic('decorative-safety.js');

  assert.match(randomizer, /placeDecorativeAsset/);
  assert.match(alice, /placeDecorativeAsset/);
  assert.match(safety, /decorativeOverlapsContent/);
  assert.match(safety, /data-suppressed/);
  assert.match(safety, /element\.hidden = true/);
});

test('mapa aleatório usa schema atual, persiste navegação e renova em F5', async () => {
  const js = await readPublic('randomizer.js');
  assert.match(js, /upptb-campus-distribution-v10/);
  assert.match(js, /navigationEntry\?\.type === 'reload'/);
  assert.match(js, /if \(!stored \|\| isReload\)/);
  assert.match(js, /if \(valid\) return parsed/);
  assert.match(js, /localStorage\.setItem\(campusStorageKey/);
});

test('registros antigos do runtime são podados sem apagar schemas atuais', async () => {
  const app = await readPublic('app.js');
  assert.match(app, /upptb-campus-distribution-v10/);
  assert.match(app, /upptb-alice-characters-v3/);
  assert.match(app, /function pruneLegacyStorage\(/);
  assert.match(app, /localStorage\.removeItem\(key\)/);
});

test('AUD-21: Efeito Alice é módulo canônico e usa gato + Chapeleiro locais', async () => {
  const js = await readPublic('alice.js');
  assert.match(js, /upptb-alice-characters-v3/);
  assert.match(js, /from '\.\/decorative-safety\.js'/);
  assert.match(js, /caption\.textContent = config\.phrase/);
  assert.match(js, /src: 'assets\/gato\.png'/);
  assert.match(js, /src: 'assets\/chapeleiro\.png'/);
  assert.match(js, /scatterAliceCharacters/);
});

test('fóssil fundador permanece intacto', async () => {
  const html = await readPublic('index.html');
  assert.match(html, /<h2 id="fossil-title">Let's rip, dude\. Turtle Step\. Robin loses\. Multi reborn\. Site created\.<\/h2>/);
});

test('navegação atual controla topo, histórico e menu mobile', async () => {
  const js = await readPublic('router.js');
  const css = await readPublic('styles.css');
  assert.match(js, /scrollRestoration = 'manual'/);
  assert.match(js, /window\.scrollTo\(\{ top: 0, left: 0/);
  assert.match(js, /function setMobileMenu\(open\)/);
  assert.match(css, /html\.menu-open, html\.menu-open body/);
});

test('terminal institucional preserva os comandos MVP sem cache bust manual', async () => {
  const html = await readPublic('index.html');
  const js = await readPublic('terminal.js');
  assert.match(html, /type="module" src="terminal\.js"/);
  assert.doesNotMatch(html, /terminal\.js\?v=/);
  assert.match(html, /data-terminal-form/);
  for (const command of ['help', 'status', 'lore', 'clear']) {
    assert.match(js, new RegExp("command === '" + command + "'"));
  }
});

test('Home preserva identidade única, quatro atalhos e preview de Inglês', async () => {
  const html = await readPublic('index.html');
  const identityOccurrences = html.match(/assets\/upptb-collage\.webp/g) ?? [];
  assert.equal(identityOccurrences.length, 1);

  const linksBlock = html.split('class="hero-actions home-page-links"')[1]?.split('</div>')[0] ?? '';
  assert.equal((linksBlock.match(/class="button/g) ?? []).length, 4);
  for (const target of ['laboratorio-beyblade.html', 'ingles.html', 'memorias.html', 'alice.html']) {
    assert.ok(linksBlock.includes(`href="${target}"`), 'atalho ausente: ' + target);
  }

  const englishPreview = html.split('class="english-preview-grid"')[1]?.split('</div>')[0] ?? '';
  assert.equal((englishPreview.match(/<article>/g) ?? []).length, 3);
});

test('CSS atual protege composição da Home em desktop e mobile', async () => {
  const css = await readPublic('styles.css');
  assert.match(css, /html\[data-page="home"\] \.hero-copy \{[\s\S]*text-align: center/);
  assert.match(css, /html\[data-page="home"\] \.home-page-links \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.english-preview-grid \{[\s\S]*grid-template-columns: repeat\(3/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.english-preview-grid \{[\s\S]*grid-template-columns: 1fr/);
});

test('AUD-15: nome canônico está aplicado na Home e rodapés', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /Universidade publica turtles and bleys/);
    assert.doesNotMatch(html, /Universidade Pública Peculiar Turtle and Beys/);
  }
});

test('AUD-07: Alice mantém botão e PDF dos 30 estados no contrato de build', async () => {
  const html = await readPublic('alice.html');
  const config = await readRoot('vite.config.js');
  assert.match(html, /href="docs\/alice-30-estados\.pdf"/);
  assert.match(config, /alice-30-estados\.pdf/);
});

test('AUD-26: build e smoke usam a mesma fonte de dívida', async () => {
  const debt = JSON.parse(await readRoot('config/audit-debt.json'));
  const verify = await readRoot('scripts/verify-build.mjs');
  const smoke = await readRoot('scripts/smoke-dist.mjs');

  assert.equal(debt.schemaVersion, 1);
  assert.ok(Array.isArray(debt.items));
  assert.match(verify, /config\/audit-debt\.json/);
  assert.match(smoke, /config\/audit-debt\.json/);
  assert.doesNotMatch(verify, /knownAuditDebt = new Set\(\[/);
  assert.doesNotMatch(smoke, /knownAuditDebt = new Set\(\[/);
});

test('AUD-20: pipeline possui smoke pós-deploy por SHA publicado', async () => {
  const workflow = await readRoot('.github/workflows/pages.yml');
  const script = await readRoot('scripts/post-deploy-smoke.mjs');
  assert.match(workflow, /post-deploy-smoke/);
  assert.match(workflow, /EXPECTED_SHA/);
  assert.match(script, /build\.json/);
  assert.match(script, /docs\/alice-30-estados\.pdf/);
});

test('build preserva assets dinâmicos e publica identidade rastreável por SHA', async () => {
  const config = await readRoot('vite.config.js');
  assert.match(config, /cpSync\(source, target, \{ recursive: true, force: true \}\)/);
  assert.match(config, /public\/assets/);
  assert.match(config, /dist\/assets/);
  assert.match(config, /upptb-build-sha/);
  assert.match(config, /dist\/build\.json/);
});

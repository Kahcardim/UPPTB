import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPublic = (path) => readFile(new URL('../public/' + path, import.meta.url), 'utf8');
const readRoot = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');

const campusPages = ['index.html', 'laboratorio-beyblade.html', 'ingles.html', 'memorias.html'];

test('campi essenciais usam a mesma revisão de assets e não carregam arquivos legados', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /<main id="conteudo">/);
    assert.match(html, /id="random-asset-plane"/);
    assert.match(html, /styles\.css\?v=13/);
    assert.match(html, /app\.js\?v=12/);
    assert.doesNotMatch(html, /navigation\.js|ux-safety\.css/);
  }
});

test('Alice permanece isolada do plano aleatório global e usa revisão própria atual', async () => {
  const html = await readPublic('alice.html');
  assert.doesNotMatch(html, /id="random-asset-plane"/);
  assert.match(html, /styles\.css\?v=13/);
  assert.match(html, /app\.js\?v=12/);
  assert.match(html, /alice-page\.css\?v=9/);
  assert.match(html, /alice-page\.js\?v=9/);
});

test('engine da Alice mantém estado sem rotação automática e assets versionados', async () => {
  const js = await readPublic('alice-page.js');
  assert.doesNotMatch(js, /setInterval\s*\(/);
  assert.doesNotMatch(js, /restartRotation|rotatePhrase/);
  assert.match(js, /from '\.\/alice-states\.js\?v=9'/);
  assert.match(js, /const aliceAssetVersion = '4'/);
  assert.match(js, /wallpaperFrame\?\.prepend\(butterflyPlane\)/);
  assert.match(js, /catZone\?\.append\(cat\)/);
});

test('randomizer mantém domínios atuais: Beyblade só nasce no Lab e fotos legadas ficam em Memórias', async () => {
  const js = await readPublic('randomizer.js');
  const labAssets = [
    'pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp',
    'ekusu-remade.webp',
    'Beyblade_X_-_Ekusu_Kurosu.webp',
    'multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
  ];

  assert.ok(js.includes('const labOnlyImages = ['));
  assert.ok(js.includes("if (currentPage === 'lab') {\n      labOnlyImages.forEach(appendRoamingImage);"));

  const roamingSection = js.split('const roamingImages = [')[1]?.split('];')[0] ?? '';
  for (const asset of labAssets) {
    assert.equal(roamingSection.includes(asset), false, 'Beyblade vazou para roamingImages: ' + asset);
  }

  for (const asset of ['images-2-.jpg', 'images-1-.jpg', 'images.jpg']) {
    const line = js.split('\n').find(value => value.includes(asset) && value.includes("fixedPage: 'memories'"));
    assert.ok(line, 'foto legada fora de Memórias ou ausente: ' + asset);
  }

  assert.match(js, /function purgeBeybladeOutsideLab\(/);
});
test('mapa aleatório usa schema atual, persiste navegação e renova em F5', async () => {
  const js = await readPublic('randomizer.js');
  assert.match(js, /upptb-campus-distribution-v9/);
  assert.match(js, /navigationEntry\?\.type === 'reload'/);
  assert.match(js, /if \(!stored \|\| isReload\)/);
  assert.match(js, /if \(valid\) return parsed/);
  assert.match(js, /localStorage\.setItem\(campusStorageKey/);
  assert.match(js, /const safeTop = hero \? Math\.ceil\(hero\.offsetTop \+ hero\.offsetHeight \+ 48\) : 120/);
});

test('registros antigos do runtime são podados sem apagar o schema atual', async () => {
  const app = await readPublic('app.js');
  assert.match(app, /upptb-campus-distribution-v9/);
  assert.match(app, /upptb-alice-characters-v2/);
  assert.match(app, /function pruneLegacyStorage\(/);
  assert.match(app, /localStorage\.removeItem\(key\)/);
});

test('gato e Chapeleiro continuam migratórios com proteção de conteúdo', async () => {
  const js = await readPublic('alice.js');
  assert.match(js, /upptb-alice-characters-v2/);
  assert.match(js, /function characterOverlapsContent\(/);
  assert.match(js, /attempts < 24/);
  assert.match(js, /caption\.textContent = config\.phrase/);
  assert.match(js, /src: 'assets\/gato\.png'/);
  assert.match(js, /src: 'assets\/chapeleiro\.png'/);
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

test('terminal institucional preserva os comandos MVP e cache bust atual', async () => {
  const html = await readPublic('index.html');
  const js = await readPublic('terminal.js');
  assert.match(html, /terminal\.js\?v=12/);
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

test('rodapé institucional permanece consistente nos campi', async () => {
  for (const page of campusPages) {
    const html = await readPublic(page);
    assert.match(html, /class="site-footer"/);
    assert.match(html, /Kauan Cardim · Fundador · PO · QA · estudante de programação/);
    assert.match(html, /class="site-footer-alice"/);
  }
});

test('build preserva assets dinâmicos e publica identidade rastreável por SHA', async () => {
  const config = await readRoot('vite.config.js');
  assert.match(config, /cpSync\(source, target, \{ recursive: true, force: true \}\)/);
  assert.match(config, /public\/assets/);
  assert.match(config, /dist\/assets/);
  assert.match(config, /upptb-build-sha/);
  assert.match(config, /dist\/build\.json/);
});

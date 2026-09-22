import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL('../public/' + path, import.meta.url), 'utf8');

test('regressão estrutural: páginas institucionais essenciais existem e carregam scripts esperados', async () => {
  const pages = ['index.html', 'laboratorio-beyblade.html', 'ingles.html', 'memorias.html'];
  for (const page of pages) {
    const html = await read(page);
    assert.match(html, /<main id="conteudo">/);
    assert.match(html, /id="random-asset-plane"/);
    assert.match(html, /<script src="app\.js" defer><\/script>/);
    assert.match(html, /<script src="navigation\.js" defer><\/script>/);
  }
});

test('regressão UX: Alice permanece isolada do plano aleatório global', async () => {
  const html = await read('alice.html');
  assert.doesNotMatch(html, /id="random-asset-plane"/);
  assert.match(html, /alice-page\.css\?v=4/);
  assert.match(html, /alice-page\.js\?v=4/);
});

test('regressão Alice: estado não possui rotação automática por timer', async () => {
  const js = await read('alice-page.js');
  assert.doesNotMatch(js, /setInterval\s*\(/);
  assert.doesNotMatch(js, /restartRotation|rotatePhrase/);
  assert.match(js, /readInitialState/);
});

test('regressão Alice: borboletas pertencem ao frame da foto e gato ao diálogo', async () => {
  const js = await read('alice-page.js');
  assert.match(js, /wallpaperFrame\?\.prepend\(butterflyPlane\)/);
  assert.match(js, /catZone\?\.append\(cat\)/);
  const css = await read('alice-page.css');
  assert.match(css, /\.alice-wallpaper-frame\s*\{[^}]*overflow:hidden/s);
  assert.match(css, /\.alice-dialogue-stage\s*\{[^}]*overflow:hidden/s);
});

test('regressão de domínio: bladers e Beyblade ficam exclusivamente no laboratório', async () => {
  const js = await read('app.js');
  const assets = [
    'pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp',
    'ekusu-remade.webp',
    'Beyblade_X_-_Ekusu_Kurosu.webp',
    'multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
  ];
  for (const asset of assets) {
    const line = js.split('\n').find(value => value.includes(asset));
    assert.ok(line, 'asset ausente: ' + asset);
    assert.match(line, /fixedPage: 'lab'/, 'asset fora do Lab: ' + asset);
  }
});

test('regressão UX: tartarugas não entram na Alice e posicionamento protege conteúdo', async () => {
  const js = await read('app.js');
  assert.match(js, /const campusPages = \['home', 'lab', 'english', 'memories'\]/);
  assert.match(js, /function overlapsContent\(/);
  assert.match(js, /attempts < 24/);
});

test('regressão: gato pelado continua migratório nas páginas do campus', async () => {
  const js = await read('app.js');
  assert.match(js, /Sphynx_kitten\.JPG/);
  assert.match(js, /catPage: campusPages\[Math\.floor\(Math\.random\(\) \* campusPages\.length\)\]/);
  assert.match(js, /campusDistribution\.catPage !== currentPage/);
});

test('regressão: fóssil fundador permanece intacto', async () => {
  const html = await read('index.html');
  assert.match(html, /<h2 id="fossil-title">Let's rip, dude\. Turtle Step\. Robin loses\. Multi reborn\. Site created\.<\/h2>/);
});


test('regressão: resíduos de bladers são removidos fora do laboratório', async () => {
  const js = await read('app.js');
  assert.match(js, /if \(currentPage !== 'lab'\)/);
  assert.match(js, /image\.closest\('figure'\)\?\.remove\(\)/);
});

test('regressão: Chapeleiro evita conteúdo e mantém frase visível', async () => {
  const js = await read('alice.js');
  assert.match(js, /function characterOverlapsContent\(/);
  assert.match(js, /attempts < 24/);
  assert.match(js, /caption\.textContent = config\.phrase/);
  assert.match(js, /display: block !important/);
  assert.match(js, /visibility: visible !important/);
});

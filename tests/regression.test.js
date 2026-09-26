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
    assert.ok(html.includes('<script type="module" src="app.js?v=6"></script>'));
    assert.doesNotMatch(html, /navigation\.js/);
  }
});

test('regressão UX: Alice permanece isolada do plano aleatório global', async () => {
  const html = await read('alice.html');
  assert.doesNotMatch(html, /id="random-asset-plane"/);
  assert.match(html, /alice-page\.css\?v=8/);
  assert.match(html, /alice-page\.js\?v=8/);
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
  const js = await read('randomizer.js');
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

test('regressão UX: tartarugas não entram na Alice e posicionamento preserva desempenho', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /const campusPages = \['home', 'lab', 'english', 'memories'\]/);
  assert.doesNotMatch(js, /'alice'/);
  assert.match(js, /function placeAsset\(/);
  assert.doesNotMatch(js, /attempts < 80|ResizeObserver|elementsFromPoint/);
});

test('regressão: gato pelado continua migratório nas páginas do campus', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /Sphynx_kitten\.JPG/);
  assert.match(js, /catPage: campusPages\[Math\.floor\(Math\.random\(\) \* campusPages\.length\)\]/);
  assert.match(js, /campusDistribution\.catPage !== currentPage/);
});

test('regressão: fóssil fundador permanece intacto', async () => {
  const html = await read('index.html');
  assert.match(html, /<h2 id="fossil-title">Let's rip, dude\. Turtle Step\. Robin loses\. Multi reborn\. Site created\.<\/h2>/);
});


test('regressão: resíduos de bladers são removidos fora do laboratório', async () => {
  const js = await read('randomizer.js');
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


test('regressão: navegação normaliza entrada de página no topo', async () => {
  const js = await read('router.js');
  assert.match(js, /scrollRestoration = 'manual'/);
  assert.match(js, /window\.scrollTo\(\{ top: 0, left: 0/);
  assert.match(js, /currentFile !== targetFile/);
});

test('regressão: Alice usa fluxo sem scroll snap e wallpaper vertical', async () => {
  const css = await read('alice-page.css');
  assert.match(css, /scroll-snap-type:none/);
  assert.match(css, /aspect-ratio:9\/16/);
});

test('regressão: tartarugas mantêm presença visual', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.random-turtle\{opacity:\.9 !important/);
});


test('regressão: terminal interativo mantém comandos MVP', async () => {
  const html = await read('index.html');
  const js = await read('terminal.js');
  assert.match(html, /data-terminal-form/);
  assert.match(html, /terminal\.js/);
  for (const command of ['help', 'status', 'lore', 'clear']) {
    assert.match(js, new RegExp("command === '" + command + "'"));
  }
});


test('Sprint 2: app orquestra módulos router e randomizer', async () => {
  const js = await read('app.js');
  assert.match(js, /import \{ initRouter \} from '\.\/router\.js'/);
  assert.match(js, /import \{ initRandomizer \} from '\.\/randomizer\.js'/);
  assert.match(js, /initRouter\(\)/);
  assert.match(js, /initRandomizer\(\)/);
});

test('Sprint 2: mapa persiste na navegação e só renova em reload/F5', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /navigationEntry\?\.type === 'reload'/);
  assert.match(js, /if \(!stored \|\| isReload\)/);
  assert.match(js, /if \(valid\) return parsed/);
  assert.match(js, /localStorage\.setItem\(campusStorageKey/);
  assert.match(js, /campusPages = \['home', 'lab', 'english', 'memories'\]/);
});


test('runtime contract: engine cria tartarugas e sinaliza plano pronto', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /for \(let index = 1; index <= turtleCount; index \+= 1\)/);
  assert.match(js, /turtle\.src = 'assets\/turtles\/turtle-'/);
  assert.match(js, /randomAssetPlane\.dataset\.randomizerReady = 'true'/);
  assert.match(js, /createTurtles\(\)/);
});

test('runtime contract: Alice continua isolada e mantém os 30 wallpapers', async () => {
  const html = await read('alice.html');
  const js = await read('alice-page.js');
  // Alice mantém o app legado por compatibilidade, mas o próprio app encerra
  // antes de inicializar o randomizer quando data-page=alice.
  assert.match(html, /src="app\.js(?:\?v=\d+)?"/);
  const app = await read('app.js');
  const randomizer = await read('randomizer.js');
  assert.match(randomizer, /currentPage === 'alice'/);
  assert.doesNotMatch(html, /randomizer\.js/);
  assert.match(js, /const states = estadosAlice\.map/);
  assert.match(js, /assets\/alice-states/);
});


test('build contract: Vite preserva assets escolhidos dinamicamente em runtime', async () => {
  const config = await read('../vite.config.js');
  assert.match(config, /cpSync\(source, target, \{ recursive: true, force: true \}\)/);
  assert.match(config, /public\/assets/);
  assert.match(config, /dist\/assets/);
});


test('rodapé institucional identifica fundador e mantém frase da Alice nos campi', async () => {
  for (const page of ['index.html', 'laboratorio-beyblade.html', 'ingles.html', 'memorias.html']) {
    const html = await read(page);
    assert.match(html, /class="site-footer"/);
    assert.match(html, /Kauan Cardim · Fundador · PO · QA · estudante de programação/);
    assert.match(html, /class="site-footer-alice"/);
    assert.match(html, /<strong>Alice:<\/strong>/);
  }
});


test('randomizer protege caixas de leitura contra colisão visual', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /protectedElements/);
  assert.match(js, /const margin = 10/);
  assert.match(js, /asset\.hidden = !foundSafeSlot/);
  assert.doesNotMatch(js, /asset\.style\.opacity = '\.18'/);
});


test('randomizer aguarda dimensões reais das imagens antes do passe autoritativo', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /Promise\.all\(images\.map/);
  assert.match(js, /image\.addEventListener\('load', resolve/);
  assert.match(js, /\)\)\.then\(scatterAssets\)/);
});


test('randomizer evita observadores caros e recalcula apenas no resize', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /window\.addEventListener\('resize', scheduleLayout/);
  assert.doesNotMatch(js, /ResizeObserver|document\.fonts|elementsFromPoint/);
});


test('randomizer preserva tartarugas procurando slot livre após tentativas aleatórias', async () => {
  const js = await read('randomizer.js');
  assert.match(js, /let foundSafeSlot = false/);
  assert.match(js, /for \(let top = 90; top <= topLimit/);
  assert.match(js, /for \(let left = 0; left <= maxLeft/);
  assert.match(js, /asset\.hidden = !foundSafeSlot/);
});


test('randomizer nunca zera geometria ocultando todos os assets antes da colisão', async () => {
  const js = await read('randomizer.js');
  assert.doesNotMatch(js, /assets\.forEach\(\(asset\) => \{ asset\.hidden = true; \}\)/);
  assert.match(js, /function placeAsset\(asset, index, pageHeight\)/);
  assert.match(js, /asset\.hidden = false/);
});


test('mobile mantém assets dentro do viewport e invalida distribuição/cache antigo', async () => {
  const js = await read('randomizer.js');
  const css = await read('styles.css');
  assert.match(js, /upptb-campus-distribution-v6/);
  assert.match(js, /rect\.right > window\.innerWidth - viewportPadding/);
  assert.match(js, /const maxRandomLeft = isMobile/);
  assert.match(css, /V6 mobile asset safety/);
  assert.match(css, /max-width:min\(9rem,32vw\) !important/);
  for (const page of ['index.html','laboratorio-beyblade.html','ingles.html','memorias.html']) {
    const html = await read(page);
    assert.match(html, /styles\.css\?v=6/);
    assert.match(html, /app\.js\?v=6/);
  }
});


test('Alice V6 preserva imagem inteira no web e vira background no mobile', async () => {
  const html = await read('alice.html');
  const css = await read('alice-page.css');
  assert.match(html, /alice-page\.css\?v=8/);
  assert.match(html, /alice-page\.js\?v=8/);
  assert.match(css, /object-fit:contain/);
  assert.match(css, /\.alice-dialogue-stage\{overflow:visible;\}/);
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /\.alice-hero-visual\{[\s\S]*position:absolute!important/);
  assert.match(css, /object-fit:cover/);
  assert.match(css, /\.alice-gallery\{[\s\S]*z-index:6/);
});


test('Alice V7 abre menu mobile, oculta galeria e preserva hero responsiva', async () => {
  const html = await read('alice.html');
  const css = await read('alice-page.css');
  assert.ok(html.includes('<script type="module" src="app.js?v=8"></script>'));
  assert.match(css, /\.alice-gallery,\[data-alice-gallery\]\{display:none!important;\}/);
  assert.match(css, /@media\(min-width:761px\)[\s\S]*object-fit:contain!important/);
  assert.match(css, /@media\(max-width:760px\)[\s\S]*nav\[data-open="true"\][\s\S]*display:flex!important/);
  assert.match(css, /@media\(max-width:760px\)[\s\S]*object-fit:cover!important/);
});


test('EPIC: menu mobile tem estado único, fecha fora e bloqueia scroll de fundo', async () => {
  const router = await read('router.js');
  const css = await read('styles.css');
  assert.match(router, /function setMobileMenu\(open\)/);
  assert.match(router, /closeMenus\(\{ closeMobile: true \}\)/);
  assert.match(css, /html\.menu-open, html\.menu-open body/);
  assert.match(css, /position:fixed !important/);
});

test('EPIC: Multi permanece exclusiva do laboratório e Alice fora do campus global', async () => {
  const js = await read('randomizer.js');
  const multi = js.split('\n').find(line => line.includes('multi-nanairo-from-beyblade'));
  assert.match(multi, /fixedPage: 'lab'/);
  assert.match(js, /const campusPages = \['home', 'lab', 'english', 'memories'\]/);
});

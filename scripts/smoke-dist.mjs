import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { chromium, firefox, webkit } from '@playwright/test';

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const pages = [
  'index.html',
  'laboratorio-beyblade.html',
  'ingles.html',
  'memorias.html',
  'alice.html'
];
const campusPages = pages.filter((path) => path !== 'alice.html');
const viewports = [
  { width: 360, height: 800 },
  { width: 1366, height: 768 }
];
const browserTypes = { chromium, firefox, webkit };
const selected = (process.env.SMOKE_BROWSERS || 'chromium')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const debtConfig = JSON.parse(await readFile(new URL('../config/audit-debt.json', import.meta.url), 'utf8'));
const knownAuditDebt = new Set((debtConfig.items ?? []).map((item) => '/' + item.path.replace(/^\/+/, '')));

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [
  viteBin,
  'preview',
  '--host', '127.0.0.1',
  '--port', String(port),
  '--strictPort'
], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin + '/index.html');
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('Preview não iniciou. Saída:\n' + serverOutput);
}

const failures = [];
const isKnownDebtUrl = (raw) => {
  try {
    const url = new URL(raw, origin);
    return knownAuditDebt.has(url.pathname);
  } catch {
    return false;
  }
};

async function decorativeOverlaps(page) {
  return page.evaluate(() => {
    const targetSelector = [
      'main > section',
      'main h1',
      'main h2',
      'main h3',
      'main p:not(.do-not-feed)',
      'main li',
      'main a',
      'main button',
      'main input',
      'main textarea',
      'main select',
      'main pre',
      'main code',
      'main blockquote',
      'main label',
      '.terminal-controls'
    ].join(',');

    const intersects = (a, b) => !(
      a.right <= b.left - 8 ||
      a.left >= b.right + 8 ||
      a.bottom <= b.top - 8 ||
      a.top >= b.bottom + 8
    );

    const targets = [...document.querySelectorAll(targetSelector)]
      .filter((element) => !element.closest('.random-asset-plane') && !element.hidden)
      .map((element) => ({
        tag: element.tagName,
        text: (element.textContent || '').trim().slice(0, 45),
        rect: element.getBoundingClientRect()
      }))
      .filter(({ rect }) => rect.width > 2 && rect.height > 2);

    const assets = [...document.querySelectorAll('#random-asset-plane .random-asset')]
      .filter((element) => !element.hidden && getComputedStyle(element).display !== 'none')
      .map((element) => ({
        name: element.className,
        rect: element.getBoundingClientRect()
      }))
      .filter(({ rect }) => rect.width > 2 && rect.height > 2);

    const collisions = [];
    for (const asset of assets) {
      for (const target of targets) {
        if (intersects(asset.rect, target.rect)) {
          collisions.push({ asset: asset.name, target: `${target.tag}:${target.text}` });
          break;
        }
      }
    }
    return collisions;
  });
}

async function verifyNoDecorativeOverlap(page, label) {
  const collisions = await decorativeOverlaps(page);
  if (collisions.length) {
    failures.push(`${label} decoração sobre conteúdo: ${JSON.stringify(collisions.slice(0, 4))}`);
  }
}

try {
  await waitForServer();

  for (const browserName of selected) {
    const browserType = browserTypes[browserName];
    if (!browserType) {
      failures.push(`browser desconhecido: ${browserName}`);
      continue;
    }

    const browser = await browserType.launch({ headless: true });
    try {
      for (const viewport of viewports) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();

        page.on('pageerror', (error) => {
          failures.push(`${browserName} ${viewport.width} pageerror: ${error.message}`);
        });

        page.on('console', (message) => {
          if (message.type() !== 'error') return;
          const source = message.location().url || '';
          if (source && isKnownDebtUrl(source)) return;
          failures.push(`${browserName} ${viewport.width} console: ${message.text()}`);
        });

        page.on('response', (response) => {
          if (response.status() < 400) return;
          const url = response.url();
          if (!url.startsWith(origin) || isKnownDebtUrl(url)) return;
          failures.push(`${browserName} ${viewport.width} HTTP ${response.status()}: ${url}`);
        });

        for (const path of pages) {
          const response = await page.goto(`${origin}/${path}`, {
            waitUntil: 'domcontentloaded',
            timeout: 20_000
          });
          await page.waitForTimeout(500);

          if (!response?.ok()) {
            failures.push(`${browserName} ${viewport.width} navegação ${path}: ${response?.status()}`);
            continue;
          }

          const overflow = await page.evaluate(() =>
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
          );
          if (overflow) failures.push(`${browserName} ${viewport.width} overflow horizontal: ${path}`);

          const sha = await page.locator('meta[name="upptb-build-sha"]').getAttribute('content');
          if (!sha) failures.push(`${browserName} ${viewport.width} sem build SHA: ${path}`);

          const turtleCount = await page.locator('.random-turtle').count();
          if (path === 'alice.html' && turtleCount !== 0) {
            failures.push(`${browserName} ${viewport.width} tartaruga na Alice: ${turtleCount}`);
          }

          const beybladeSelectors = [
            'img[src*="pretend-were-the-in-universe-general-public"]',
            'img[src*="ekusu-remade"]',
            'img[src*="Beyblade_X_-_Ekusu_Kurosu"]',
            'img[src*="multi-nanairo"]'
          ];

          if (path !== 'laboratorio-beyblade.html') {
            for (const selector of beybladeSelectors) {
              const count = await page.locator(selector).count();
              if (count !== 0) {
                failures.push(`${browserName} ${viewport.width} Beyblade fora do Lab em ${path}: ${selector} = ${count}`);
              }
            }
          }

          if (path === 'index.html') {
            for (let reloadIndex = 1; reloadIndex <= 5; reloadIndex += 1) {
              await page.reload({ waitUntil: 'domcontentloaded', timeout: 20_000 });
              await page.waitForTimeout(450);

              for (const selector of beybladeSelectors) {
                const count = await page.locator(selector).count();
                if (count !== 0) {
                  failures.push(
                    `${browserName} ${viewport.width} F5 #${reloadIndex}: Beyblade apareceu na Home: ${selector} = ${count}`
                  );
                }
              }

              await verifyNoDecorativeOverlap(page, `${browserName} ${viewport.width} Home F5 #${reloadIndex}`);
            }

            const identityCount = await page.locator('img[src*="upptb-collage"]').count();
            if (identityCount !== 1) failures.push(`${browserName} ${viewport.width} identidade duplicada na Home: ${identityCount}`);

            const legacyPhotoCount = await page.locator(
              'img[src*="images-2-"], img[src*="images-1-"], img[src$="/images.jpg"]'
            ).count();
            if (legacyPhotoCount !== 0) failures.push(`${browserName} ${viewport.width} foto legada fora de Memórias: ${legacyPhotoCount}`);

            const pageLinks = page.locator('.home-page-links .button');
            if (await pageLinks.count() !== 4) failures.push(`${browserName} ${viewport.width} CTAs da Home != 4`);

            const turtleButtons = await pageLinks.evaluateAll((elements) => elements.map((element) => {
              const rect = element.getBoundingClientRect();
              return { width: rect.width, height: rect.height };
            }));
            for (const button of turtleButtons) {
              if (button.height < 44) failures.push(`${browserName} ${viewport.width} CTA Turtle baixo demais: ${button.height}`);
            }

            const turtleIconCount = await page.locator('.home-page-links .button img').count();
            if (turtleIconCount !== 4) failures.push(`${browserName} ${viewport.width} ícones Turtle nos CTAs != 4: ${turtleIconCount}`);

            const titleSize = await page.locator('#hero-title').evaluate(
              (element) => parseFloat(getComputedStyle(element).fontSize)
            );
            if (viewport.width >= 1100 && titleSize > 58) failures.push(`${browserName} ${viewport.width} título da Home grande demais: ${titleSize}px`);

            const fossilMetrics = await page.locator('.fossil').evaluate((element) => {
              const rect = element.getBoundingClientRect();
              return {
                left: rect.left,
                width: rect.width,
                viewport: window.innerWidth,
                textAlign: getComputedStyle(element).textAlign
              };
            });
            const fossilCenter = fossilMetrics.left + fossilMetrics.width / 2;
            if (Math.abs(fossilCenter - fossilMetrics.viewport / 2) > 3) failures.push(`${browserName} ${viewport.width} fóssil fora do centro`);
            if (viewport.width >= 1100 && fossilMetrics.width > 940) failures.push(`${browserName} ${viewport.width} fóssil largo demais: ${fossilMetrics.width}px`);
            if (fossilMetrics.textAlign !== 'center') failures.push(`${browserName} ${viewport.width} conteúdo do fóssil não centralizado`);

            const textAlign = await page.locator('.hero-copy').evaluate(
              (element) => getComputedStyle(element).textAlign
            );
            if (textAlign !== 'center') failures.push(`${browserName} ${viewport.width} hero-copy desalinhado: ${textAlign}`);

            const englishCards = await page.locator('.english-preview-grid article').count();
            if (englishCards !== 3) failures.push(`${browserName} ${viewport.width} preview inglês != 3 cards: ${englishCards}`);

            const input = page.locator('[data-terminal-input]');
            await input.fill('help');
            await input.press('Enter');
            const output = await page.locator('#terminal-output').textContent();
            if (!output?.includes('help · status · lore · clear')) failures.push(`${browserName} ${viewport.width} terminal não respondeu help`);
          }

          if (path === 'alice.html') {
            const mural = await page.locator('.alice-do-not-feed').count();
            if (mural !== 1) failures.push(`${browserName} ${viewport.width} mural Alice ausente: ${mural}`);

            const butterflyCount = await page.locator('.alice-butterfly').count();
            if (butterflyCount !== 15) failures.push(`${browserName} ${viewport.width} borboletas Alice != 15: ${butterflyCount}`);

            for (const family of ['pink', 'blue', 'white', 'black']) {
              const count = await page.locator(`.alice-butterfly-${family}`).count();
              if (count < 1) failures.push(`${browserName} ${viewport.width} família de borboleta ausente: ${family}`);
            }

            const pdfHref = await page.locator('a[href="docs/alice-30-estados.pdf"]').getAttribute('href');
            if (!pdfHref) {
              failures.push(`${browserName} ${viewport.width} link PDF dos 30 estados ausente`);
            } else {
              const pdfResponse = await page.request.get(new URL(pdfHref, page.url()).toString());
              if (!pdfResponse.ok()) failures.push(`${browserName} ${viewport.width} PDF dos 30 estados indisponível: ${pdfResponse.status()}`);
            }
          }

          await verifyNoDecorativeOverlap(page, `${browserName} ${viewport.width} ${path}`);
        }

        await context.close();

        // Efeito Alice canônico: força um estado conhecido e comprova gato + Chapeleiro no campus.
        const aliceEffectContext = await browser.newContext({ viewport });
        await aliceEffectContext.addInitScript(() => {
          localStorage.setItem('upptb-alice-characters-v3', JSON.stringify({
            gato: { visible: true, page: 'home', phrase: 'Gato de teste' },
            chapeleiro: { visible: true, page: 'home', phrase: 'Chapeleiro de teste' },
            generatedAt: Date.now()
          }));
        });
        const aliceEffectPage = await aliceEffectContext.newPage();
        const alicePageErrors = [];
        aliceEffectPage.on('pageerror', (error) => alicePageErrors.push(error.message));
        await aliceEffectPage.goto(origin + '/index.html', { waitUntil: 'domcontentloaded' });
        await aliceEffectPage.waitForTimeout(500);
        const aliceDebug = await aliceEffectPage.evaluate(() => ({
          storage: localStorage.getItem('upptb-alice-characters-v3'),
          plane: !!document.querySelector('#random-asset-plane'),
          scripts: [...document.scripts].map((script) => script.src),
          characters: document.querySelectorAll('.alice-character').length
        }));
        if (aliceDebug.characters !== 2) console.error('Efeito Alice diagnóstico:', JSON.stringify({ ...aliceDebug, pageErrors: alicePageErrors }));
        if (await aliceEffectPage.locator('.alice-gato').count() !== 1) {
          failures.push(`${browserName} ${viewport.width} Efeito Alice: gato canônico não foi criado`);
        }
        if (await aliceEffectPage.locator('.alice-chapeleiro').count() !== 1) {
          failures.push(`${browserName} ${viewport.width} Efeito Alice: Chapeleiro canônico não foi criado`);
        }
        await verifyNoDecorativeOverlap(aliceEffectPage, `${browserName} ${viewport.width} Efeito Alice forçado`);
        await aliceEffectContext.close();

        // Gato pelado migratório: um único destino por mapa e asset local.
        const catContext = await browser.newContext({ viewport });
        const catPage = await catContext.newPage();
        let catOccurrences = 0;
        for (const path of campusPages) {
          await catPage.goto(`${origin}/${path}`, { waitUntil: 'domcontentloaded' });
          await catPage.waitForTimeout(450);
          catOccurrences += await catPage.locator('.random-hairless-cat').count();
          const localCatCount = await catPage.locator('.random-hairless-cat img[src*="assets/sphynx-cat.svg"]').count();
          const anyCat = await catPage.locator('.random-hairless-cat').count();
          if (anyCat && localCatCount !== anyCat) {
            failures.push(`${browserName} ${viewport.width} gato pelado ainda depende de asset externo em ${path}`);
          }
        }
        if (catOccurrences !== 1) {
          failures.push(`${browserName} ${viewport.width} gato pelado migratório != 1 no ciclo: ${catOccurrences}`);
        }
        await catContext.close();

        // Amostra global de colisão em todos os campi.
        const overlapContext = await browser.newContext({ viewport });
        const overlapPage = await overlapContext.newPage();
        for (const path of campusPages) {
          await overlapPage.goto(`${origin}/${path}`, { waitUntil: 'domcontentloaded' });
          await overlapPage.waitForTimeout(450);
          for (let reloadIndex = 1; reloadIndex <= 2; reloadIndex += 1) {
            await verifyNoDecorativeOverlap(overlapPage, `${browserName} ${viewport.width} ${path} amostra #${reloadIndex}`);
            await overlapPage.reload({ waitUntil: 'domcontentloaded' });
            await overlapPage.waitForTimeout(450);
          }
        }
        await overlapContext.close();
      }

      // Reduced-motion da Alice: os dois carrosséis não autoavançam.
      const reducedContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: 'reduce'
      });
      const reducedPage = await reducedContext.newPage();
      await reducedPage.goto(origin + '/alice.html', { waitUntil: 'domcontentloaded' });
      await reducedPage.waitForTimeout(500);
      const tracks = reducedPage.locator('.alice-card-grid, #regras .memory-grid');
      const before = await tracks.evaluateAll((nodes) => nodes.map((node) => node.scrollLeft));
      await reducedPage.waitForTimeout(6500);
      const after = await tracks.evaluateAll((nodes) => nodes.map((node) => node.scrollLeft));
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        failures.push(`${browserName} reduced-motion: carrossel Alice autoavançou (${JSON.stringify(before)} -> ${JSON.stringify(after)})`);
      }
      await reducedContext.close();
    } finally {
      await browser.close();
    }
  }
} finally {
  if (server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([
      once(server, 'exit'),
      new Promise((resolve) => setTimeout(resolve, 2_000))
    ]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
}

if (failures.length) {
  console.error('Runtime smoke: FAIL');
  for (const failure of failures) console.error(' -', failure);
  process.exit(1);
}

console.log(`Runtime smoke: OK (${selected.join(', ')} · conteúdo protegido · Alice canônica · gato pelado local)`);

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
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
const viewports = [
  { width: 360, height: 800 },
  { width: 1366, height: 768 }
];
const browserTypes = { chromium, firefox, webkit };
const selected = (process.env.SMOKE_BROWSERS || 'chromium')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const knownAuditDebt = new Set([
  '/alice.js',
  '/docs/alice-30-estados.pdf'
]);

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
          await page.waitForTimeout(350);
          if (!response?.ok()) {
            failures.push(`${browserName} ${viewport.width} navegação ${path}: ${response?.status()}`);
            continue;
          }

          const overflow = await page.evaluate(() =>
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
          );
          if (overflow) {
            failures.push(`${browserName} ${viewport.width} overflow horizontal: ${path}`);
          }

          const sha = await page.locator('meta[name="upptb-build-sha"]').getAttribute('content');
          if (!sha) {
            failures.push(`${browserName} ${viewport.width} sem build SHA: ${path}`);
          }

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
            const identityCount = await page.locator('img[src*="upptb-collage"]').count();
            if (identityCount !== 1) {
              failures.push(`${browserName} ${viewport.width} identidade duplicada na Home: ${identityCount}`);
            }

            const legacyPhotoCount = await page.locator(
              'img[src*="images-2-"], img[src*="images-1-"], img[src$="/images.jpg"]'
            ).count();
            if (legacyPhotoCount !== 0) {
              failures.push(`${browserName} ${viewport.width} foto legada fora de Memórias: ${legacyPhotoCount}`);
            }

            const hero = await page.locator('.hero').boundingBox();
            const decorativeBoxes = await page.locator(
              '#random-asset-plane .random-turtle, #random-asset-plane .random-photo, #random-asset-plane .random-identity'
            ).evaluateAll((elements) => elements.map((element) => {
              const rect = element.getBoundingClientRect();
              return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
            }));
            if (hero) {
              const heroRect = {
                left: hero.x,
                top: hero.y,
                right: hero.x + hero.width,
                bottom: hero.y + hero.height
              };
              const overlaps = decorativeBoxes.filter((rect) =>
                rect.right > heroRect.left &&
                rect.left < heroRect.right &&
                rect.bottom > heroRect.top &&
                rect.top < heroRect.bottom
              );
              if (overlaps.length) {
                failures.push(`${browserName} ${viewport.width} assets decorativos invadem hero: ${overlaps.length}`);
              }
            }

            const pageLinks = page.locator('.home-page-links .button');
            if (await pageLinks.count() !== 4) {
              failures.push(`${browserName} ${viewport.width} CTAs da Home != 4`);
            }
            if (viewport.width >= 1100) {
              const wrap = await page.locator('.home-page-links').evaluate(
                (element) => getComputedStyle(element).flexWrap
              );
              if (wrap !== 'nowrap') {
                failures.push(`${browserName} ${viewport.width} CTAs desktop não estão lineares: ${wrap}`);
              }
            }

            const textAlign = await page.locator('.hero-copy').evaluate(
              (element) => getComputedStyle(element).textAlign
            );
            if (textAlign !== 'center') {
              failures.push(`${browserName} ${viewport.width} hero-copy desalinhado: ${textAlign}`);
            }

            const englishCards = await page.locator('.english-preview-grid article').count();
            if (englishCards !== 3) {
              failures.push(`${browserName} ${viewport.width} preview inglês != 3 cards: ${englishCards}`);
            }

            const input = page.locator('[data-terminal-input]');
            await input.fill('help');
            await input.press('Enter');
            const output = await page.locator('#terminal-output').textContent();
            if (!output?.includes('help · status · lore · clear')) {
              failures.push(`${browserName} ${viewport.width} terminal não respondeu help`);
            }
          }
        }

        await context.close();
      }
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

console.log(`Runtime smoke: OK (${selected.join(', ')} · ${pages.length} páginas · ${viewports.length} viewports)`);

import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile, readdir } from 'node:fs/promises';
import { createApp } from '../src/app.js';

async function withServer(run) {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test('health expõe o contrato JSON sem cabeçalho do framework', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/api/v1/health`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.equal(response.headers.get('x-powered-by'), null);
    assert.deepEqual(await response.json(), { status: 'ok', service: 'UPPTB' });
  });
});

test('Home V1 é servida com identidade e fóssil fundador preservados', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.match(html, /Universidade Pública Peculiar Turtle and Beys/);
    assert.match(html, /Identidade HIGH · Severidade ULTRA TURTLE/);
    assert.match(html, /<h2 id="fossil-title">Let's rip, dude\. Turtle Step\. Robin loses\. Multi reborn\. Site created\.<\/h2>/);
    assert.match(html, /Desenvolvimento de Inglês/);
    assert.match(html, /Alice/);
    assert.match(html, /Forbidden Turtle Archive/);
  });
});

test('assets principais da Home estão acessíveis', async () => {
  await withServer(async base => {
    for (const path of ['/styles.css', '/app.js', '/assets/upptb-logo.svg', '/assets/turtle-mark.svg', '/assets/bey-mark.svg']) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200, `asset indisponível: ${path}`);
    }
  });
});

test('pacote visual contém 31 tartarugas separadas e imagens aleatórias', async () => {
  const turtles = await readdir(new URL('../public/assets/turtles/', import.meta.url));
  assert.equal(turtles.filter(file => /^turtle-\d{2}\.webp$/.test(file)).length, 31);

  await withServer(async base => {
    for (const path of [
      '/assets/turtles/turtle-01.webp',
      '/assets/turtles/turtle-31.webp',
      '/assets/upptb-collage.webp',
      '/assets/Beyblade_X_-_Ekusu_Kurosu.webp',
      '/assets/multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
    ]) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200, `asset indisponível: ${path}`);
    }
  });
});

test('documento do Arquivo Proibido Turtle é servido pelo backend', async () => {
  await withServer(async base => {
    const response = await fetch(`${base}/docs/UPPTB-Arquivo-Proibido-Turtle.md`);
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.match(text, /Identidade:\*\* HIGH/);
    assert.match(text, /ULTRA TURTLE/);
  });
});

test('rotas e métodos sem contrato retornam 404 JSON', async () => {
  await withServer(async base => {
    for (const [path, method] of [['/nao-existe', 'GET'], ['/api/v1/health', 'POST'], ['/api/v1/phrases', 'GET']]) {
      const response = await fetch(`${base}${path}`, { method });
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), { error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' } });
    }
  });
});

test('catálogo tem 255 rascunhos únicos em 17 categorias e classes válidas', async () => {
  const phrases = JSON.parse(await readFile(new URL('../content/phrases.json', import.meta.url), 'utf8'));
  assert.equal(phrases.length, 255);
  assert.equal(new Set(phrases.map(item => item.id)).size, 255);
  assert.equal(new Set(phrases.map(item => item.category)).size, 17);
  const counts = { public: 0, easter_egg: 0, internal_chaos: 0 };
  for (const phrase of phrases) {
    assert.match(phrase.id, /^[A-Z]{3}-\d{2}$/);
    assert.ok(phrase.text.trim());
    assert.equal(phrase.status, 'draft');
    assert.ok(['pt-BR', 'en'].includes(phrase.language));
    assert.ok(Object.hasOwn(counts, phrase.classification));
    counts[phrase.classification]++;
  }
  assert.deepEqual(counts, { public: 102, easter_egg: 68, internal_chaos: 85 });
});

test('Alice preserva identidade própria e não carrega personagens globais', async () => {
  const html = await readFile(new URL('../public/alice.html', import.meta.url), 'utf8');
  assert.match(html, /assets\/alice-mark\.svg/);
  assert.doesNotMatch(html, /src="assets\/turtle-mark\.svg"/);
  assert.doesNotMatch(html, /<script src="alice\.js" defer><\/script>/);
  assert.match(html, /data-alice-cat-zone/);
  assert.match(html, /Rosa e preto, azul como acento/);
});

test('Alice mantém exatamente 15 estados sincronizados e 15 entradas de galeria', async () => {
  const html = await readFile(new URL('../public/alice.html', import.meta.url), 'utf8');
  const script = await readFile(new URL('../public/alice-page.js', import.meta.url), 'utf8');
  const stateWallpapers = script.match(/wallpaper:\s*'assets\/alice-wallpapers\/[^']+\.png'/g) ?? [];
  const gallerySlots = html.match(/data-gallery-wallpaper/g) ?? [];
  assert.equal(stateWallpapers.length, 15);
  assert.equal(gallerySlots.length, 15);
  assert.match(script, /heroVisual\?\.prepend\(butterflyPlane\)/);
  assert.match(script, /catZone\?\.append\(cat\)/);
});

test('assets e estados principais da Alice estão acessíveis', async () => {
  await withServer(async base => {
    for (const path of [
      '/alice.html',
      '/alice-page.css',
      '/alice-page.js',
      '/assets/alice-mark.svg',
      '/assets/alice-wallpapers/01_voce_nao_precisa_controlar_tudo.png',
      '/assets/alice-wallpapers/15_hoje_voce_so_precisa_existir_nesse_segundo.png'
    ]) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200, `asset da Alice indisponível: ${path}`);
    }
  });
});

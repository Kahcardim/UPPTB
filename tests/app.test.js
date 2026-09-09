import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
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

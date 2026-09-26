import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPublic = (path) => readFile(new URL('../public/' + path, import.meta.url), 'utf8');

test('HOME CT07 mantém hero compacto e atalhos Turtle', async () => {
  const css = await readPublic('styles.css');
  assert.ok(css.includes('font-size: clamp(2.25rem, 3.5vw, 3.55rem);'));
  assert.ok(css.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'));
  const html = await readPublic('index.html');
  assert.equal((html.match(/<img src="assets\/turtle-mark\.svg" alt="" \/>/g) ?? []).length, 4);
  assert.ok(css.includes('html[data-page="home"] .home-page-links .button img'));
  assert.ok(css.includes('min-height: 3.2rem;'));
});

test('HOME CT08 mantém fóssil compacto, centralizado e canônico', async () => {
  const css = await readPublic('styles.css');
  const html = await readPublic('index.html');
  assert.ok(css.includes('width: min(58rem, calc(100% - 2rem)) !important;'));
  assert.ok(css.includes('text-align: center;'));
  assert.ok(css.includes('max-width: 30ch;'));
  assert.ok(html.includes("Let's rip, dude. Turtle Step. Robin loses. Multi reborn. Site created."));
});

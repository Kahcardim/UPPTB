import { access } from 'node:fs/promises';
import { resolve } from 'node:path';

const required = [
  'dist/index.html',
  'dist/laboratorio-beyblade.html',
  'dist/ingles.html',
  'dist/memorias.html',
  'dist/alice.html',
  'dist/assets/turtles/turtle-01.webp',
  'dist/assets/turtles/turtle-31.webp',
  'dist/assets/alice-states/alice_01.webp',
  'dist/assets/alice-states/alice_30.webp'
];

const missing = [];
for (const relativePath of required) {
  try {
    await access(resolve(process.cwd(), relativePath));
  } catch {
    missing.push(relativePath);
  }
}

if (missing.length) {
  console.error('Build incompleto. Assets runtime ausentes:');
  missing.forEach((path) => console.error(' -', path));
  process.exit(1);
}

console.log('Build runtime assets: OK');

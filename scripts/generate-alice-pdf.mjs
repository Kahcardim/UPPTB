import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { estadosAlice } from '../public/alice-states.js';

const output = resolve(process.cwd(), 'dist/docs/alice-30-estados.pdf');

function sanitize(value) {
  return String(value)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\xFF]/g, '?');
}

function esc(value) {
  return sanitize(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrap(value, max = 86) {
  const words = sanitize(value).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const objects = [];
const add = (body) => { objects.push(body); return objects.length; };
const fontId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
const boldId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
const pageIds = [];

for (const estado of estadosAlice) {
  const lines = [
    ['B', 18, `Alice - Estado ${String(estado.id).padStart(2, '0')}`],
    ['R', 10, `Imagem: ${estado.imagem}`],
    ['R', 10, `Estado: ${estado.estado}`],
    ['R', 10, `Tom: ${estado.tom}`],
    ['B', 12, 'Frases canônicas:']
  ];
  estado.frases.forEach((frase, idx) => {
    const wrapped = wrap(`${idx + 1}. ${frase}`, 82);
    wrapped.forEach((part, partIdx) => lines.push(['R', 10, partIdx ? '   ' + part : part]));
  });

  let y = 790;
  const commands = ['BT'];
  for (const [weight, size, text] of lines) {
    commands.push(`/${weight === 'B' ? 'F2' : 'F1'} ${size} Tf`);
    commands.push(`50 ${y} Td`);
    commands.push(`(${esc(text)}) Tj`);
    commands.push(`-50 -${y} Td`);
    y -= size >= 16 ? 28 : size >= 12 ? 22 : 17;
  }
  commands.push('ET');
  const stream = commands.join('\n');
  const contentId = add(`<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`);
  const pageId = add(`<< /Type /Page /Parent PAGES_REF 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R /F2 ${boldId} 0 R >> >> /Contents ${contentId} 0 R >>`);
  pageIds.push(pageId);
}

const pagesId = add(`<< /Type /Pages /Kids [${pageIds.map((id) => id + ' 0 R').join(' ')}] /Count ${pageIds.length} >>`);
for (const id of pageIds) objects[id - 1] = objects[id - 1].replace('PAGES_REF', String(pagesId));
const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

let pdf = '%PDF-1.4\n%Alice30\n';
const offsets = [0];
objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefOffset = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i += 1) {
  pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

await mkdir(resolve(process.cwd(), 'dist/docs'), { recursive: true });
await writeFile(output, Buffer.from(pdf, 'latin1'));
console.log(`Alice PDF: OK (${estadosAlice.length} estados)`);

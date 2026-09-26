import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { estadosAlice } from '../public/alice-states.js';

const outDir = resolve(process.cwd(), 'dist/docs');
const outFile = resolve(outDir, 'alice-30-estados.pdf');

function latin1(value) {
  return String(value)
    .replaceAll('—', '-')
    .replaceAll('–', '-')
    .replaceAll('…', '...')
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('’', "'")
    .replaceAll('→', '->');
}

function hex(value) {
  return Buffer.from(latin1(value), 'latin1').toString('hex').toUpperCase();
}

function wrap(value, width = 78) {
  const words = latin1(value).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLine(font, size, x, y, value) {
  return `BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm <${hex(value)}> Tj ET\n`;
}

const pageGroups = [];
for (let index = 0; index < estadosAlice.length; index += 4) {
  pageGroups.push(estadosAlice.slice(index, index + 4));
}

const objects = [];
objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

const kids = [];
pageGroups.forEach((group, pageIndex) => {
  const pageId = 5 + pageIndex * 2;
  const contentId = pageId + 1;
  kids.push(`${pageId} 0 R`);

  let y = 800;
  let stream = '';
  if (pageIndex === 0) {
    stream += textLine('F2', 20, 48, y, 'Alice - 30 estados');
    y -= 26;
    stream += textLine('F1', 10, 48, y, 'UPPTB - referencia oficial dos estados visuais e frases associadas');
    y -= 28;
  }

  for (const state of group) {
    stream += textLine('F2', 13, 48, y, `Estado ${String(state.id).padStart(2, '0')} - ${state.estado.replaceAll('-', ' ')}`);
    y -= 16;
    stream += textLine('F1', 9, 48, y, `Imagem: ${state.imagem} | Tom: ${state.tom}`);
    y -= 15;

    for (const phrase of state.frases) {
      const lines = wrap(`• ${phrase}`, 82);
      for (const line of lines) {
        stream += textLine('F1', 9.5, 60, y, line);
        y -= 13;
      }
      y -= 2;
    }
    y -= 10;
  }

  objects[contentId] = `<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}endstream`;
  objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
});

objects[2] = `<< /Type /Pages /Count ${kids.length} /Kids [${kids.join(' ')}] >>`;

let pdf = '%PDF-1.4\n%UPPTB\n';
const offsets = [0];
for (let id = 1; id < objects.length; id += 1) {
  offsets[id] = Buffer.byteLength(pdf, 'ascii');
  pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdf, 'ascii');
pdf += `xref\n0 ${objects.length}\n`;
pdf += '0000000000 65535 f \n';
for (let id = 1; id < objects.length; id += 1) {
  pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

await mkdir(outDir, { recursive: true });
await writeFile(outFile, Buffer.from(pdf, 'latin1'));
console.log(`Alice PDF: OK (${estadosAlice.length} estados -> ${outFile})`);

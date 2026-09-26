import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const publishedDocs = [
  'UPPTB-escopo-e-banco-de-frases.docx',
  'UPPTB-Arquivo-Proibido-Turtle.md',
  'benchmark-gate-1.md',
  'escopo-gate-2.md'
];

function resolveBuildSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: process.cwd(),
      encoding: 'utf8'
    }).trim();
  } catch {
    return 'unknown';
  }
}

const buildSha = resolveBuildSha();

function preserveRuntimeAssets() {
  return {
    name: 'upptb-preserve-runtime-assets',
    closeBundle() {
      // Tartarugas e estados da Alice são escolhidos em runtime. Como seus nomes
      // não aparecem como imports estáticos, o Rollup não consegue descobri-los.
      // Copiamos a árvore de assets explicitamente para o artefato final.
      const source = resolve(process.cwd(), 'public/assets');
      const target = resolve(process.cwd(), 'dist/assets');
      if (existsSync(source)) cpSync(source, target, { recursive: true, force: true });

      // Os documentos publicados passam a fazer parte do próprio artefato
      // validado. Assim o deploy não cria arquivos que o gate nunca viu.
      const docsTarget = resolve(process.cwd(), 'dist/docs');
      mkdirSync(docsTarget, { recursive: true });
      for (const file of publishedDocs) {
        const sourceDoc = resolve(process.cwd(), 'docs', file);
        if (existsSync(sourceDoc)) {
          cpSync(sourceDoc, resolve(docsTarget, file), { force: true });
        }
      }
    }
  };
}

function buildIdentity() {
  return {
    name: 'upptb-build-identity',
    transformIndexHtml() {
      return [{
        tag: 'meta',
        attrs: { name: 'upptb-build-sha', content: buildSha },
        injectTo: 'head'
      }];
    },
    closeBundle() {
      writeFileSync(
        resolve(process.cwd(), 'dist/build.json'),
        JSON.stringify({ sha: buildSha }, null, 2) + '\n'
      );
    }
  };
}

export default defineConfig({
  root: 'public',
  base: './',
  plugins: [preserveRuntimeAssets(), buildIdentity()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'public/index.html'),
        lab: resolve(process.cwd(), 'public/laboratorio-beyblade.html'),
        english: resolve(process.cwd(), 'public/ingles.html'),
        memories: resolve(process.cwd(), 'public/memorias.html'),
        alice: resolve(process.cwd(), 'public/alice.html')
      }
    }
  }
});

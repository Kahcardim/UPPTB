import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { cpSync, existsSync } from 'node:fs';

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
    }
  };
}

export default defineConfig({
  root: 'public',
  base: './',
  plugins: [preserveRuntimeAssets()],
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

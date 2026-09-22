import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'public',
  base: './',
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

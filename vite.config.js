import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: 'public/index.html',
        lab: 'public/laboratorio-beyblade.html',
        english: 'public/ingles.html',
        memories: 'public/memorias.html',
        alice: 'public/alice.html'
      }
    }
  }
});

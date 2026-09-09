import express from 'express';
import { fileURLToPath } from 'node:url';

const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
const docsDirectory = fileURLToPath(new URL('../docs/', import.meta.url));

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/v1/health', (_request, response) => {
    response.json({ status: 'ok', service: 'UPPTB' });
  });

  app.use('/docs', express.static(docsDirectory, {
    dotfiles: 'deny',
    index: false,
    fallthrough: true,
    maxAge: '1h'
  }));

  app.use(express.static(publicDirectory, {
    dotfiles: 'deny',
    index: 'index.html',
    fallthrough: true,
    maxAge: '1h'
  }));

  app.use((_request, response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' } });
  });

  return app;
}

import express from 'express';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/v1/health', (_request, response) => {
    response.json({ status: 'ok', service: 'UPPTB' });
  });

  app.use((_request, response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' } });
  });

  return app;
}

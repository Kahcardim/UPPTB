import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um número inteiro entre 1 e 65535.');
}

const server = createApp().listen(port, host, () => {
  console.log(`UPPTB disponível em http://${host}:${port}/api/v1/health`);
});
server.on('error', (error) => {
  console.error(`Não foi possível iniciar o servidor: ${error.code ?? 'UNKNOWN'}`);
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    const timeout = setTimeout(() => process.exit(1), 5000).unref();
    server.close(() => {
      clearTimeout(timeout);
      process.exitCode = 0;
    });
  });
}

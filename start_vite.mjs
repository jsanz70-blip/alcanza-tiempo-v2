import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function start() {
  const server = await createServer({
    root: __dirname,
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  });
  await server.listen();
  server.printUrls();
}

start().catch(err => {
  console.error('Failed to start vite:', err);
  process.exit(1);
});

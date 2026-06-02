const { createServer } = require('vite');
const path = require('path');

async function start() {
  const server = await createServer({
    root: path.resolve(__dirname),
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

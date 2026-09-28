import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
const app = JSON.parse(fs.readFileSync(new URL('../app.json', import.meta.url), 'utf8'));

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.UI_HOST || '127.0.0.1',
    port: Number(process.env.UI_PORT || app.port),
    strictPort: true,
    proxy: { '/api': `http://127.0.0.1:${process.env.API_PORT || app.apiPort}` },
  },
  preview: { host: process.env.UI_HOST || '127.0.0.1' },
});

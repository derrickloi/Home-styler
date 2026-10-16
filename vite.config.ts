import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, Plugin } from 'vite';

const currentDir = import.meta.dirname ?? fileURLToPath(new URL('.', import.meta.url));

function onemapApiPlugin(): Plugin {
  return {
    name: 'onemap-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || '';
        const decodedUrl = decodeURIComponent(rawUrl);
        if (rawUrl.startsWith('/api') || decodedUrl.startsWith('/api')) {
          try {
            const { default: handler } = await import('./api/onemap.js');
            return handler(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || '';
        const decodedUrl = decodeURIComponent(rawUrl);
        if (rawUrl.startsWith('/api') || decodedUrl.startsWith('/api')) {
          try {
            const { default: handler } = await import('./api/onemap.js');
            return handler(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), onemapApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(currentDir, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/leaflet/')) {
              return 'vendor-leaflet';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
  };
});

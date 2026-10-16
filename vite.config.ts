import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, Plugin } from 'vite';

const currentDir = import.meta.dirname ?? fileURLToPath(new URL('.', import.meta.url));

function onemapApiPlugin(): Plugin {
  const handleApi = async (req: any, res: any, next: any) => {
    const rawUrl = req.url || '';
    const decodedUrl = decodeURIComponent(rawUrl);
    if (rawUrl.startsWith('/api') || decodedUrl.startsWith('/api')) {
      if (rawUrl.startsWith('/api/health') || decodedUrl.startsWith('/api/health')) {
        try {
          const { default: handler } = await import('./api/health.ts');
          return handler(req, res);
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Health check error' }));
          return;
        }
      }
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
  };

  return {
    name: 'onemap-api-middleware',
    configureServer(server) {
      server.middlewares.use(handleApi);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApi);
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
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

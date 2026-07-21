import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';

// Helper to find all HTML files dynamically
function getHtmlFiles(dir: string, fileList: Record<string, string> = {}): Record<string, string> {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = resolve(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git' && file !== '.vercel') {
        getHtmlFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.html')) {
      let name = fullPath.replace(__dirname, '').replace(/\\/g, '/').substring(1).replace('.html', '');
      fileList[name] = fullPath;
    }
  }
  return fileList;
}

// URL rewrite map - mirrors what vercel.json used to do
const URL_REWRITES: Record<string, string> = {
  '/':       '/user-app/pages/login.html',
  '/login':  '/user-app/pages/login.html',
  '/home':   '/user-app/pages/home.html',
  '/admin':  '/admin-app/pages/login.html',
};

export default defineConfig({
  plugins: [
    {
      name: 'url-rewrite-middleware',
      configureServer(server) {
        // Add middleware BEFORE Vite's own handlers
        server.middlewares.use(function (req: IncomingMessage, res: ServerResponse, next: () => void) {
          const rawUrl = req.url ?? '/';
          // Strip query string for matching
          const pathname = rawUrl.split('?')[0].replace(/\/$/, '') || '/';

          if (URL_REWRITES[pathname]) {
            // Rewrite the URL so Vite serves the correct HTML file
            const qs = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
            req.url = URL_REWRITES[pathname] + qs;
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: getHtmlFiles(__dirname)
    }
  }
});

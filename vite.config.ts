import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Helper to find all HTML files dynamically
function getHtmlFiles(dir, fileList = {}) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = resolve(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git' && file !== '.vercel') {
        getHtmlFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.html')) {
      // Use relative path as the key name
      let name = fullPath.replace(__dirname, '').replace(/\\/g, '/').substring(1).replace('.html', '');
      // E.g. user-app/pages/login
      fileList[name] = fullPath;
    }
  }
  return fileList;
}

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    build: {
      rollupOptions: {
        input: getHtmlFiles(__dirname)
      }
    }
  };
});

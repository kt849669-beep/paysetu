const fs = require('fs');
const path = require('path');

const domain = 'https://app-showpay.in';
const pagesDir = path.join(__dirname, 'user-app', 'pages');
const sitemapFile = path.join(__dirname, 'public', 'sitemap.xml');

// Public pages to include in the sitemap
const includePages = ['login.html', 'home.html'];

function generateSitemap() {
  const currentDate = new Date().toISOString();
  
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add the root domain (index.html)
  sitemapContent += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  includePages.forEach(page => {
    if (fs.existsSync(path.join(pagesDir, page))) {
      sitemapContent += `  <url>\n    <loc>${domain}/user-app/pages/${page}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${page === 'login.html' ? '0.9' : '0.8'}</priority>\n  </url>\n`;
    }
  });

  sitemapContent += `</urlset>`;

  fs.writeFileSync(sitemapFile, sitemapContent, 'utf8');
  console.log(`Sitemap generated successfully at ${sitemapFile}`);
}

generateSitemap();

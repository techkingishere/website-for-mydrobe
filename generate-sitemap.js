// generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path'); // Import path module

// Define paths relative to the script location
const publicPath = path.resolve(__dirname, 'public');
const sitemapPath = path.join(publicPath, 'sitemap.xml');

(async () => {
  // Ensure public directory exists (optional, createWriteStream usually handles it)
  // const fs = require('fs');
  // if (!fs.existsSync(publicPath)) {
  //   fs.mkdirSync(publicPath, { recursive: true });
  // }

  const sitemap = new SitemapStream({ hostname: 'https://mydrobe.co' });

  // --- TODO: Replace these with your actual app routes! ---
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 }); // Assuming '/' is LoginPage? Or maybe '/app'?
  sitemap.write({ url: '/app', changefreq: 'daily', priority: 0.9 });
  sitemap.write({ url: '/app/search', changefreq: 'weekly', priority: 0.8 });
  sitemap.write({ url: '/app/create', changefreq: 'monthly', priority: 0.7 }); // Drobes page
  sitemap.write({ url: '/app/messages', changefreq: 'monthly', priority: 0.6 });
  sitemap.write({ url: '/app/profile', changefreq: 'monthly', priority: 0.6 });
  sitemap.write({ url: '/app/settings', changefreq: 'monthly', priority: 0.5 });
  // Add any other important static pages

  sitemap.end();

  try {
    const data = await streamToPromise(sitemap);
    createWriteStream(sitemapPath).write(data.toString());
    console.log(`Sitemap generated successfully at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
})(); 
// generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream, existsSync, mkdirSync } = require('fs');
const path = require('path'); // Import path module

// Define paths relative to the script location
const distPath = path.resolve(__dirname, 'dist');
const sitemapPath = path.join(distPath, 'sitemap.xml');

(async () => {
  // Ensure dist directory exists (Vite should create it, but check just in case)
  if (!existsSync(distPath)) {
    mkdirSync(distPath, { recursive: true });
    console.log(`Created dist directory: ${distPath}`)
  }

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
    process.exit(1); // Exit with error code if sitemap fails
  }
})(); 
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

  // --- List Publicly Indexable Pages --- 
  // Root page (Login Page)
  sitemap.write({ url: '/', changefreq: 'monthly', priority: 0.7 }); 
  
  // Add other PUBLIC pages here if they exist (e.g., /about, /contact, /public-profile/:id)
  // sitemap.write({ url: '/about', changefreq: 'yearly', priority: 0.5 });

  // NOTE: We generally don't include routes requiring login (like /app/*) 
  // as Google cannot access their content for indexing.

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
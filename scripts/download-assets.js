/**
 * PrintMedia Image & File Downloader
 * Downloads all images and PDF files from the current printmedia.fi website
 * 
 * Run: node scripts/download-assets.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Base URL for the website
const BASE_URL = 'https://www.printmedia.fi';

// All images to download
const assets = {
  // Logos
  logos: [
    '/images/logo.svg',
    '/images/logos/docan_logo2.jpg',
    '/images/logos/GCC_Logo.png',
    '/images/logos/j-wei-logo.png',
    '/images/logos/fayon-logo.png',
    '/images/logos/jetbest_sahkoposti.jpg',
    '/images/logos/sai-flexi-logo.png',
  ],
  
  // General images
  images: [
    '/images/xrite_logo.jpg',
    '/images/tulostimien_tarvikkeet.jpg',
    '/images/PrintMedia_-_Hinnasto_2023_kuva.png',
  ],
  
  // Product images - Roll ups
  rollups: [
    '/images/tuotekuvat/spyro2.jpg',
    '/images/tuotekuvat/export_uusi_laukku.jpg',
    '/images/tuotekuvat/luxury_uusi_laukku.jpg',
    '/images/tuotekuvat/deluxe_1_uusi_kuva_laukku.jpg',
    '/images/tuotekuvat/mini_roll_up.jpg',
  ],
  
  // Product images - Trade show tables
  tables: [
    '/images/tuotekuvat/promopyt_1_uusi_kuva_1.jpg',
    '/images/tuotekuvat/promopyt_2_uusi_kuva_1.jpg',
    '/images/tuotekuvat/promopyt_4.jpg',
  ],
  
  // Product images - Trade show walls
  walls: [
    '/images/tuotekuvat/suora_messuseina.jpg',
    '/images/tuotekuvat/kaareva_280_x_230.jpg',
  ],
  
  // Product images - Accessories
  accessories: [
    '/images/tuotekuvat/turvaviivain_tersreunalla.jpg',
    '/images/tuotekuvat/turvaviivain_leikkurilla.jpg',
    '/images/tuotekuvat/bungee-ball.jpg',
    '/images/tuotekuvat/bungee-koukku.jpg',
    '/images/tuotekuvat/bannerclip.jpg',
  ],
  
  // Device images
  devices: [
    '/images/devices/docan_h3000r_m10_574x.png',
    '/images/devices/RXII_132_400.png',
    '/images/devices/J5-132.jpg',
    '/images/fayon/fayon-1600se.png',
    '/images/tuotekuvat/cb03ii_500px_500x.jpg',
    '/images/tuotekuvat/tools_600px_600x.png',
  ],
  
  // PDF files
  pdfs: [
    '/images/Esitteet-hinnastot-asiakirjat/PrintMedia_-_HINNASTO_2023_V2.pdf',
    '/images/Esitteet-hinnastot-asiakirjat/RXII-esite.pdf',
    '/images/Esitteet-hinnastot-asiakirjat/JaguarV-esite.pdf',
    '/images/docs/Docan-esite.pdf',
    '/images/docs/CB03II-esite.pdf',
    '/images/docs/CB08II-esite.pdf',
    '/images/docs/ecosolmax_vs._jbnew-eco.pdf',
    '/images/docs/ss21_vs_jbss21.pdf',
    '/images/docs/ghs_ss21_safety_data_sheet_fi.pdf',
    '/images/docs/new_eco_ink_msds_fi.pdf',
    '/images/docs/hinnasto2022-tulostusmateriaalit.pdf',
  ]
};

// Output directories mapping
const outputDirs = {
  logos: 'public/images/logos',
  images: 'public/images',
  rollups: 'public/images/products/rollups',
  tables: 'public/images/products/tables',
  walls: 'public/images/products/walls',
  accessories: 'public/images/products/accessories',
  devices: 'public/images/devices',
  pdfs: 'public/files',
};

/**
 * Download a single file
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(destPath);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });

      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Get filename from URL path
 */
function getFileName(urlPath) {
  return path.basename(urlPath);
}

/**
 * Download all assets
 */
async function downloadAllAssets() {
  console.log('🚀 Starting PrintMedia asset download...\n');
  
  let successCount = 0;
  let failCount = 0;
  const failed = [];

  for (const [category, urls] of Object.entries(assets)) {
    const outputDir = outputDirs[category];
    console.log(`\n📁 Downloading ${category} to ${outputDir}/`);
    console.log('─'.repeat(50));

    for (const urlPath of urls) {
      const fullUrl = BASE_URL + urlPath;
      const fileName = getFileName(urlPath);
      const destPath = path.join(process.cwd(), outputDir, fileName);

      try {
        await downloadFile(fullUrl, destPath);
        console.log(`  ✅ ${fileName}`);
        successCount++;
      } catch (err) {
        console.log(`  ❌ ${fileName} - ${err.message}`);
        failed.push({ url: fullUrl, error: err.message });
        failCount++;
      }

      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 DOWNLOAD SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    failed.forEach(f => console.log(`   - ${f.url}: ${f.error}`));
  }

  console.log('\n✨ Download complete!');
}

// Create assets manifest for the new website
async function createAssetsManifest() {
  const manifest = {
    generated: new Date().toISOString(),
    baseUrl: '/images',
    assets: {}
  };

  for (const [category, urls] of Object.entries(assets)) {
    manifest.assets[category] = urls.map(urlPath => ({
      original: BASE_URL + urlPath,
      local: outputDirs[category].replace('public', '') + '/' + getFileName(urlPath),
      filename: getFileName(urlPath)
    }));
  }

  const manifestPath = path.join(process.cwd(), 'content', 'assets-manifest.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📄 Created assets manifest: ${manifestPath}`);
}

// Main execution
async function main() {
  try {
    await downloadAllAssets();
    await createAssetsManifest();
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();

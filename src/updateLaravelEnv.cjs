const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, 'C:/xampp/htdocs/freeclass/.env');

// Ambil URL dari getApiUrl.js
const getApiUrlPath = path.resolve(__dirname, './getApiUrl.js');
const getApiUrlContent = fs.readFileSync(getApiUrlPath, 'utf8');
const match = getApiUrlContent.match(/'(.+?)'/);
const apiUrl = match?.[1];

if (!apiUrl) {
  console.error('❌ Gagal mengambil URL dari getApiUrl.js');
  process.exit(1);
}

try {
  // Update APP_URL di Laravel .env
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/APP_URL=.*/g, `APP_URL=${apiUrl}`);
  fs.writeFileSync(envPath, envContent);

  // Update api_url.json di FreeClassWeb/public
  const apiJsonPath = path.resolve(__dirname, 'C:/xampp/htdocs/freeclass/public/api_url.json');
  fs.writeFileSync(apiJsonPath, JSON.stringify({ url: `${apiUrl}/api` }, null, 2));

  console.log(`✅ APP_URL Laravel diubah ke ${apiUrl}`);
  console.log(`✅ public/api_url.json diperbarui.`);
} catch (err) {
  console.error('❌ Gagal update Laravel:', err.message);
}

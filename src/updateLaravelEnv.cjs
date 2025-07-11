// src/updateLaravelEnv.cjs
const fs = require('fs');
const path = require('path');

// Ambil URL dari getApiUrl.js
const getApiUrlPath = path.resolve(__dirname, './getApiUrl.js');
const getApiUrlContent = fs.readFileSync(getApiUrlPath, 'utf8');
const match = getApiUrlContent.match(/'(.+?)'/);
const apiUrl = match?.[1];

if (!apiUrl) {
  console.error('❌ Gagal mengambil URL dari getApiUrl.js');
  process.exit(1);
}

// Laravel paths
const envPath = 'C:/xampp/htdocs/freeclass/.env';
const apiJsonPath = 'C:/xampp/htdocs/freeclass/public/api_url.json';

try {
  // Update APP_URL di Laravel
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/APP_URL=.*/g, `APP_URL=${apiUrl}`);
  fs.writeFileSync(envPath, envContent);

  // Update public/api_url.json
  const apiJson = { url: `${apiUrl}/api` };
  fs.writeFileSync(apiJsonPath, JSON.stringify(apiJson, null, 2));

  console.log(`✅ APP_URL Laravel diubah ke ${apiUrl}`);
  console.log(`✅ public/api_url.json diperbarui.`);
} catch (err) {
  console.error('❌ Gagal update Laravel:', err.message);
}

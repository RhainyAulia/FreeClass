const fs = require('fs');
const path = require('path');

const { getApiUrl } = require('./getApiUrl.node.cjs');
const apiUrl = getApiUrl();

if (!apiUrl) {
  console.error('❌ Gagal mengambil URL dari getApiUrl.node.cjs');
  process.exit(1);
}

// Laravel .env
const envPath = path.resolve('C:/xampp/htdocs/freeclass/.env');
let envContent = fs.readFileSync(envPath, 'utf8');
envContent = envContent.replace(/APP_URL=.*/g, `APP_URL=${apiUrl}`);
fs.writeFileSync(envPath, envContent);

// Laravel public/api_url.json
fs.writeFileSync(
  path.resolve('C:/xampp/htdocs/freeclass/public/api_url.json'),
  JSON.stringify({ url: `${apiUrl}/api` }, null, 2)
);

console.log(`✅ APP_URL Laravel diubah ke ${apiUrl}`);
console.log(`✅ public/api_url.json diperbarui.`);

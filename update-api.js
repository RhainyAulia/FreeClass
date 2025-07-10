// FreeClassApp/tools/updateLaravelEnv.js
const os = require('os');
const fs = require('fs');
const path = require('path');

// Cari IP lokal
const interfaces = os.networkInterfaces();
let ip = null;

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ip = iface.address;
    }
  }
}

if (!ip) {
  console.error('❌ Gagal mendapatkan IP lokal.');
  process.exit(1);
}

const baseUrl = `http://${ip}:8000`;

//Directory path ke file .env Laravel
const laravelEnvPath = path.resolve('C:/xampp/htdocs/freeclass/.env');

// Update APP_URL
let envContent = fs.readFileSync(laravelEnvPath, 'utf8');
envContent = envContent.replace(/APP_URL=.*/g, `APP_URL=${baseUrl}`);
fs.writeFileSync(laravelEnvPath, envContent);

console.log(`✅ APP_URL Laravel berhasil diubah ke: ${baseUrl}`);

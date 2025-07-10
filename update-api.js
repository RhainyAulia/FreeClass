const os = require('os');
const fs = require('fs');
const path = require('path');

// Ambil IP lokal otomatis
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

const apiUrl = `http://${ip}:8000`;
const content = `export const getApiUrl = () => '${apiUrl}';\n`;
const filePath = path.join(__dirname, 'src', 'getApiUrl.js');

fs.writeFileSync(filePath, content);
console.log(`✅ Base URL berhasil diubah ke: ${apiUrl}`);

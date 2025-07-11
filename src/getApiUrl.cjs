//Script untuk mendapatkan URL API lokal dan menyimpannya untuk React Native dan Node.js

const os = require('os');
const fs = require('fs');
const path = require('path');

// Deteksi IP lokal
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

// Update untuk React Native
const rnPath = path.resolve(__dirname, './getApiUrl.js');
fs.writeFileSync(rnPath, `export function getApiUrl() { return '${apiUrl}'; }\n`);

// Simpan juga untuk Node.js (untuk updateLaravelEnv.cjs)
const nodePath = path.resolve(__dirname, './getApiUrl.node.cjs');
fs.writeFileSync(nodePath, `module.exports = { getApiUrl: () => '${apiUrl}' };\n`);

console.log(`✅ Base URL berhasil diubah ke: ${apiUrl}`);

// updateApiUrl.js
const fs = require('fs');
const axios = require('axios');

const ENV_FILE = './env.js';

async function updateApiUrl() {
  try {
    const response = await axios.get('http://127.0.0.1:4040/api/tunnels');
    const tunnels = response.data.tunnels;

    const httpsTunnel = tunnels.find(t => t.public_url.startsWith('https'));
    if (!httpsTunnel) {
      console.error('❌ Tidak menemukan HTTPS tunnel.');
      return;
    }

    const apiUrl = `${httpsTunnel.public_url}/api`;

    const content = `export const API_URL = '${apiUrl}';\n`;

    fs.writeFileSync(ENV_FILE, content);
    console.log('✅ API_URL berhasil diperbarui ke:', apiUrl);
  } catch (err) {
    console.error('❌ Gagal mengupdate API_URL:', err.message);
  }
}

updateApiUrl();
// Export the function for potential reuse
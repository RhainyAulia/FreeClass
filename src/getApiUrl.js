let API_URL = '';

export const getApiUrl = async () => {
  if (API_URL) return API_URL;

  try {
    const res = await fetch('https://6afaf54354d1.ngrok-free.app/api_url.json');
    const json = await res.json();
    API_URL = json.url;
    console.log('📦 API_URL dari api_url.json:', API_URL); // ← LOG WAJIB
    return API_URL;
  } catch (err) {
    console.error('❌ Gagal fetch api_url.json:', err);
    return '';
  }
};

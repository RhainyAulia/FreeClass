export const getApiUrl = async () => {
  try {
    const timestamp = Date.now(); // anti-cache
    const res = await fetch('https://74e2853fb6be.ngrok-free.app');
    const json = await res.json();
    console.log('📦 API_URL dari api_url.json:', json.url);
    return json.url;
  } catch (err) {
    console.error('❌ Gagal fetch api_url.json:', err.message);
    return '';
  }
};

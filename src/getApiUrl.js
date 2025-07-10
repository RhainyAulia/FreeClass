export const getApiUrl = async () => {
  try {
    const timestamp = Date.now(); // anti-cache
    const res = await fetch(`https://546e3c0559a3.ngrok-free.app/api_url.json?${timestamp}`);
    const json = await res.json();
    console.log('📦 API_URL dari api_url.json:', json.url);
    return json.url;
  } catch (err) {
    console.error('❌ Gagal fetch api_url.json:', err.message);
    return '';
  }
};

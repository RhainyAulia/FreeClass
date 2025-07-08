let API_URL = '';

export const getApiUrl = async () => {
  if (API_URL) return API_URL;

  try {
    const res = await fetch('https://xxxx.ngrok-free.app/api_url.json');
    const json = await res.json();
    API_URL = json.url;
    return API_URL;
  } catch (err) {
    console.error('Gagal ambil API URL:', err.message);
    return 'https://xxxx.ngrok-free.app/api'; // fallback manual
  }
};

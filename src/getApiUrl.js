export const getApiUrl = () => 'http://192.168.222.223:8000';
if (typeof module !== 'undefined') module.exports = { getApiUrl: getApiUrl() };
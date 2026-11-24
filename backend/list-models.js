require('dotenv').config();
(async () => {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', {
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }
  });
  const data = await res.json();
  if (!res.ok) return console.log('ERROR', res.status, JSON.stringify(data).slice(0, 300));
  data.models
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .forEach(m => console.log(m.name.replace('models/', '')));
})();
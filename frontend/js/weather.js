// ===================== WEATHER (real backend API) =====================

async function loadWeather(){
  const loading = document.getElementById('weather-loading');
  const content = document.getElementById('weather-content');
  loading.style.display='block'; content.style.display='none';
  try{
    const res = await fetch(`${API_BASE}/weather/current`);
    const data = await res.json();
    if(!res.ok){ throw new Error(hiMsg(data.message)); }
    document.getElementById('w-temp').textContent = Math.round(data.temperature)+'°';
    document.getElementById('w-desc').textContent = data.description;
    document.getElementById('w-feels').textContent = Math.round(data.feelsLike)+'°C';
    document.getElementById('w-humidity').textContent = data.humidity+'%';
    document.getElementById('w-wind').textContent = data.windSpeed+' मी/से';
    loading.style.display='none'; content.style.display='block';
  }catch(err){
    loading.textContent = 'मौसम की जानकारी नहीं मिल पाई — कृपया थोड़ी देर बाद कोशिश करें।';
  }
}

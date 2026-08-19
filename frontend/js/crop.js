// ===================== CROP RECOMMENDATION (real backend API) =====================

async function recommendCrops(){
  const season = document.getElementById('crop-season').value;
  const soil = document.getElementById('crop-soil').value;
  const el = document.getElementById('crop-result');
  el.innerHTML = '<div class="empty">Loading...</div>';
  try{
    const res = await fetch(`${API_BASE}/crop/recommend?season=${season}&soil=${soil}&region=Gorakhpur`);
    const data = await res.json();
    if(!res.ok){ el.innerHTML = `<div class="empty">${data.message}</div>`; return; }
    el.innerHTML = data.recommendedCrops.map(c=>`<span class="crop-chip">${c}</span>`).join('');
  }catch(err){
    el.innerHTML = '<div class="empty">Backend se connect nahi ho paya</div>';
  }
}

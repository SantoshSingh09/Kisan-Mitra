// ===================== GPS LOCATION (detect once, persist everywhere) =====================
// Location ek baar detect hone ke baad localStorage mein save ho jati hai,
// taaki har page pe dobara "Detect" na dabana pade — jaisa login token
// sabhi pages pe yaad rehta hai, waisi hi location bhi yaad rahegi.

function saveLocation(data){
  localStorage.setItem('km_location', JSON.stringify(data));
}

function getSavedLocation(){
  const raw = localStorage.getItem('km_location');
  return raw ? JSON.parse(raw) : null;
}

// Call this once when any page loads — it fills the topbar pill
// (and the dashboard detail card, if present) from saved data.
function restoreLocationUI(){
  const saved = getSavedLocation();
  if(!saved) return;

  const pill = document.getElementById('loc-pill');
  const txt = document.getElementById('loc-text');
  if(txt) txt.textContent = saved.village;
  if(pill) pill.classList.add('detected');

  const summaryCard = document.getElementById('loc-summary-card');
  if(summaryCard){
    summaryCard.style.display = 'block';
    document.getElementById('dash-village').textContent = saved.village;
    document.getElementById('dash-tehsil').textContent = saved.tehsil;
    document.getElementById('dash-mandi').textContent = saved.nearestMandi;
    document.getElementById('dash-soil').textContent = saved.soilType;
  }
}

function detectLocation(){
  const pill=document.getElementById('loc-pill'), txt=document.getElementById('loc-text');
  if(!navigator.geolocation){ txt.textContent="GPS available nahi hai"; return; }
  txt.textContent="Detect ho raha hai...";

  navigator.geolocation.getCurrentPosition(async function(pos){
    const lat=pos.coords.latitude, lon=pos.coords.longitude;
    try{
      const res = await fetch(`${API_BASE}/location/reverse?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Location fetch failed');

      const locationData = {
        village: data.village,
        tehsil: data.tehsil,
        nearestMandi: data.nearestMandi,
        soilType: data.soilType
      };
      saveLocation(locationData);
      restoreLocationUI();
    }catch(err){
      txt.textContent = "Location detail fetch nahi ho paya";
    }
  }, function(){ txt.textContent="Permission nahi mili"; });
}
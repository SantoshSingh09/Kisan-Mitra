// ===================== GPS LOCATION (high accuracy, detect once, persist) =====================
// enableHighAccuracy:true tells the browser to use the device's actual GPS
// chip (not just WiFi/network-based estimation), giving a much more precise
// location — especially useful on phones. It can take a few seconds longer.

function saveLocation(data){ localStorage.setItem('km_location', JSON.stringify(data)); }
function getSavedLocation(){
  const raw = localStorage.getItem('km_location');
  return raw ? JSON.parse(raw) : null;
}

function restoreLocationUI(){
  const saved = getSavedLocation();
  if(!saved) return;
  const pill = document.getElementById('loc-pill');
  const txt = document.getElementById('loc-text');
  if(txt) txt.textContent = saved.village + (saved.accuracy ? ` (±${Math.round(saved.accuracy)}m)` : '');
  if(pill) pill.classList.add('detected');

  const summaryCard = document.getElementById('loc-summary-card');
  if(summaryCard){
    summaryCard.style.display = 'block';
    document.getElementById('dash-village').textContent = saved.village;
    document.getElementById('dash-tehsil').textContent = saved.tehsil;
    document.getElementById('dash-mandi').textContent = saved.nearestMandi;
    document.getElementById('dash-soil').textContent = saved.soilType;
    const accEl = document.getElementById('dash-accuracy');
    if(accEl) accEl.textContent = saved.accuracy ? `±${Math.round(saved.accuracy)} meters` : '—';
  }
}

function detectLocation(){
  const pill=document.getElementById('loc-pill'), txt=document.getElementById('loc-text');
  if(!navigator.geolocation){ txt.textContent="GPS not available"; return; }
  txt.textContent="Detecting via GPS (may take a few seconds)...";

  navigator.geolocation.getCurrentPosition(
    async function(pos){
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = pos.coords.accuracy; // in meters — lower is more precise

      try{
        const res = await fetch(`${API_BASE}/location/reverse?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Location fetch failed');

        saveLocation({
          village: data.village, tehsil: data.tehsil,
          nearestMandi: data.nearestMandi, soilType: data.soilType,
          lat, lon, accuracy
        });
        restoreLocationUI();
      }catch(err){
        txt.textContent = "Could not fetch location details";
      }
    },
    function(err){
      if(err.code === 1) txt.textContent = "Permission denied";
      else if(err.code === 2) txt.textContent = "Position unavailable";
      else if(err.code === 3) txt.textContent = "Request timed out — try again";
      else txt.textContent = "Could not detect location";
    },
    {
      enableHighAccuracy: true,  // use real GPS chip, not just network/WiFi estimate
      timeout: 15000,            // wait up to 15 seconds for a precise fix
      maximumAge: 0              // never use a cached/old position
    }
  );
}
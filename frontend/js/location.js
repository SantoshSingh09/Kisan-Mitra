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
  if(txt) txt.textContent = hiPlace(saved.village) + (saved.accuracy ? ` (±${Math.round(saved.accuracy)}m)` : '');
  if(pill) pill.classList.add('detected');

  const summaryCard = document.getElementById('loc-summary-card');
  if(summaryCard){
    summaryCard.style.display = 'block';
    document.getElementById('dash-village').textContent = hiPlace(saved.village);
    document.getElementById('dash-tehsil').textContent = hiPlace(saved.tehsil);
    document.getElementById('dash-mandi').textContent = hiPlace(saved.nearestMandi);
    document.getElementById('dash-soil').textContent = hiSoil(saved.soilType);
    const accEl = document.getElementById('dash-accuracy');
    if(accEl) accEl.textContent = saved.accuracy ? `±${Math.round(saved.accuracy)} मीटर` : '—';
  }
}

function detectLocation(){
  const pill=document.getElementById('loc-pill'), txt=document.getElementById('loc-text');
  if(!navigator.geolocation){ txt.textContent="इस फ़ोन/ब्राउज़र में GPS उपलब्ध नहीं है"; return; }
  txt.textContent="GPS से स्थान खोजा जा रहा है (कुछ सेकंड लग सकते हैं)...";

  navigator.geolocation.getCurrentPosition(
    async function(pos){
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = pos.coords.accuracy; // in meters — lower is more precise

      try{
        const res = await fetch(`${API_BASE}/location/reverse?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if(!res.ok) throw new Error(hiMsg(data.message));

        saveLocation({
          village: data.village, tehsil: data.tehsil,
          nearestMandi: data.nearestMandi, soilType: data.soilType,
          lat, lon, accuracy
        });
        restoreLocationUI();
      }catch(err){
        txt.textContent = "स्थान की जानकारी नहीं मिल पाई";
      }
    },
    function(err){
      if(err.code === 1) txt.textContent = "स्थान की अनुमति नहीं दी गई";
      else if(err.code === 2) txt.textContent = "स्थान पता नहीं चल पाया";
      else if(err.code === 3) txt.textContent = "समय समाप्त हो गया — दोबारा कोशिश करें";
      else txt.textContent = "स्थान पता नहीं चल पाया";
    },
    {
      enableHighAccuracy: true,  // use real GPS chip, not just network/WiFi estimate
      timeout: 15000,            // wait up to 15 seconds for a precise fix
      maximumAge: 0              // never use a cached/old position
    }
  );
}
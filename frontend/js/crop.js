// ===================== CROP RECOMMENDATION + DETAILS =====================

async function recommendCrops() {
  const season = document.getElementById('crop-season').value;
  const soil = document.getElementById('crop-soil').value;
  const el = document.getElementById('crop-result');
  document.getElementById('crop-detail-panel').style.display = 'none';
  el.innerHTML = '<div class="empty">Loading...</div>';
  try {
    const res = await fetch(`${API_BASE}/crop/recommend?season=${season}&soil=${soil}&region=Gorakhpur`);
    const data = await res.json();
    if (!res.ok) { el.innerHTML = `<div class="empty">${data.message}</div>`; return; }
    el.innerHTML = data.recommendedCrops.map(c =>
      `<span class="crop-chip" style="cursor:pointer;" onclick="showCropDetail('${c}')">${c}</span>`
    ).join('');
  } catch (err) {
    el.innerHTML = '<div class="empty">Could not connect to backend</div>';
  }
}

async function showCropDetail(cropName) {
  const panel = document.getElementById('crop-detail-panel');
  panel.style.display = 'block';
  panel.innerHTML = '<div class="empty">Loading...</div>';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  try {
    const res = await fetch(`${API_BASE}/crop/details?name=${encodeURIComponent(cropName)}`);
    const data = await res.json();
    if (!res.ok) {
      panel.innerHTML = `<h3>${cropName}</h3><div class="empty">${data.message}</div>`;
      return;
    }
    panel.innerHTML = `
      <h3>${data.cropName}</h3>
      <div class="crop-detail-grid">
        <div><div class="k">Seed rate</div><div class="v">${data.seedRate}</div></div>
        <div><div class="k">Sowing time</div><div class="v">${data.sowingTime}</div></div>
        <div><div class="k">Weeding / hoeing</div><div class="v">${data.weedingTime}</div></div>
        <div><div class="k">Harvest time</div><div class="v">${data.harvestTime}</div></div>
      </div>
      <div class="crop-problems">
        <div class="k" style="margin-bottom:6px;">Common problems</div>
        ${data.problems.map(p => `<span class="problem-chip">${p}</span>`).join('')}
      </div>
      <div class="crop-note">General guidance — exact figures vary by variety and local conditions. Confirm with your local Krishi Vigyan Kendra before sowing.</div>
    `;
  } catch (err) {
    panel.innerHTML = '<div class="empty">Could not connect to backend</div>';
  }
}
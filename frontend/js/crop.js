const cropNameHindi = {
  "Gehu":"गेहूं","Dhan":"धान","Ganna":"गन्ना","Makka":"मक्का","Chana":"चना","Arhar":"अरहर",
  "Sarso":"सरसों","Matar":"मटर","Moong":"मूंग","Urad":"उड़द","Soybean":"सोयाबीन","Til":"तिल",
  "Jute":"जूट","Bajra":"बाजरा","Jau":"जौ","Masoor":"मसूर","Alsi":"अलसी","Bhindi":"भिंडी",
  "Baingan":"बैंगन","Lauki":"लौकी","Tori":"तोरी","Karela":"करेला","Palak":"पालक","Methi":"मेथी",
  "Dhaniya":"धनिया","Gobi (Phool)":"फूल गोभी","Patta Gobi":"पत्ता गोभी","Gajar":"गाजर","Mooli":"मूली",
  "Kheera":"खीरा","Tarbuz":"तरबूज़","Kharbuja":"खरबूजा","Kaddu":"कद्दू"
};

async function recommendCrops(){
  const season = document.getElementById('crop-season').value;
  const soil = document.getElementById('crop-soil').value;
  const el = document.getElementById('crop-result');
  document.getElementById('crop-detail-panel').style.display = 'none';
  el.innerHTML = '<div class="empty">लोड हो रहा है...</div>';
  try{
    fetch(`${API_BASE}/crop/recommend?season=${season}&soil=${soil}`)
    const data = await res.json();
    if(!res.ok){ el.innerHTML = `<div class="empty">${hiMsg(data.message)}</div>`; return; }
    el.innerHTML = data.recommendedCrops.map(c=>
      `<span class="crop-chip" style="cursor:pointer;" onclick="showCropDetail('${c}')">${cropNameHindi[c] || c}</span>`
    ).join('');
  }catch(err){
    el.innerHTML = '<div class="empty">बैकएंड से जुड़ नहीं पाया</div>';
  }
}

async function showCropDetail(cropName){
  const panel = document.getElementById('crop-detail-panel');
  panel.style.display = 'block';
  panel.innerHTML = '<div class="empty">लोड हो रहा है...</div>';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  try{
    const res = await fetch(`${API_BASE}/crop/details?name=${encodeURIComponent(cropName)}`);
    const data = await res.json();
    const hindiName = cropNameHindi[cropName] || cropName;
    if(!res.ok){
      panel.innerHTML = `<h3>${hindiName}</h3><div class="empty">${hiMsg(data.message)}</div>`;
      return;
    }
    panel.innerHTML = `
      <h3>${hindiName}</h3>
      <div class="crop-detail-grid">
        <div><div class="k">बीज दर</div><div class="v">${data.seedRate}</div></div>
        <div><div class="k">बुवाई का समय</div><div class="v">${data.sowingTime}</div></div>
        <div><div class="k">गुड़ाई/निराई</div><div class="v">${data.weedingTime}</div></div>
        <div><div class="k">कटाई का समय</div><div class="v">${data.harvestTime}</div></div>
      </div>
      <div class="crop-problems">
        <div class="k" style="margin-bottom:6px;">सामान्य समस्याएं</div>
        ${data.problems.map(p=>`<span class="problem-chip">${p}</span>`).join('')}
      </div>
      <div class="crop-note">यह सामान्य जानकारी है — सटीक आंकड़े किस्म और स्थानीय परिस्थिति के अनुसार बदल सकते हैं। बुवाई से पहले स्थानीय कृषि विज्ञान केंद्र से सलाह लें।</div>
    `;
  }catch(err){
    panel.innerHTML = '<div class="empty">बैकएंड से जुड़ नहीं पाया</div>';
  }
}
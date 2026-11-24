// ===================== MANDI BHAV (demo data, Hindi labels) =====================
// Internally keyed in English (matches backend's nearestMandi value for
// auto-selecting the farmer's nearest mandi) — but everything shown to
// the user is translated to Hindi via the name-maps below.

const mandiNameHindi = {
  "Gorakhpur Mandi": "गोरखपुर मंडी",
  "Varanasi Mandi": "वाराणसी मंडी",
  "Lucknow Mandi": "लखनऊ मंडी",
  "Kanpur Mandi": "कानपुर मंडी",
  "Agra Mandi": "आगरा मंडी",
  "Meerut Mandi": "मेरठ मंडी",
  "Prayagraj Mandi": "प्रयागराज मंडी",
  "Bareilly Mandi": "बरेली मंडी",
  "Moradabad Mandi": "मुरादाबाद मंडी",
  "Jhansi Mandi": "झांसी मंडी"
};

const cropNameHindi = {
  "Gehu":"गेहूं","Dhan (Chawal)":"धान (चावल)","Makka":"मक्का","Ganna":"गन्ना","Chana":"चना",
  "Arhar":"अरहर","Sarso":"सरसों","Aloo":"आलू","Pyaz":"प्याज़","Tamatar":"टमाटर","Bhindi":"भिंडी",
  "Baingan":"बैंगन","Gobi (Phool)":"फूल गोभी","Lauki":"लौकी","Lahsun":"लहसुन","Gajar":"गाजर",
  "Moong":"मूंग","Urad":"उड़द","Mooli":"मूली","Palak":"पालक","Matar":"मटर","Masoor":"मसूर",
  "Bajra":"बाजरा","Jau":"जौ","Til":"तिल"
};

const mandiData = {
  "Gorakhpur Mandi": [
    ["Gehu","2440–2600"],["Dhan (Chawal)","2330–2500"],["Makka","2180–2300"],["Ganna","350–380"],
    ["Chana","5200–5450"],["Arhar","9800–10200"],["Sarso","5600–5850"],["Aloo","1480–1580"],
    ["Pyaz","1000–1080"],["Tamatar","1450–1550"],["Bhindi","1800–2000"],["Baingan","1200–1400"],
    ["Gobi (Phool)","1300–1500"],["Lauki","800–950"],["Lahsun","6500–7200"],["Gajar","1600–1800"]
  ],
  "Varanasi Mandi": [
    ["Dhan (Chawal)","2250–2400"],["Gehu","2420–2580"],["Moong","7800–8200"],["Urad","8500–8900"],
    ["Tamatar","1400–1550"],["Baingan","1150–1350"],["Bhindi","1750–1950"],["Lauki","750–900"],
    ["Pyaz","980–1060"],["Aloo","1450–1550"],["Mooli","700–850"],["Palak","600–750"]
  ],
  "Lucknow Mandi": [
    ["Gehu","2450–2610"],["Dhan (Chawal)","2300–2480"],["Chana","5250–5500"],["Aloo","1500–1600"],
    ["Pyaz","1020–1100"],["Tamatar","1480–1580"],["Matar","3200–3500"],["Baingan","1200–1400"],
    ["Bhindi","1850–2050"],["Gajar","1650–1850"],["Mooli","720–870"],["Palak","620–770"]
  ],
  "Kanpur Mandi": [
    ["Gehu","2430–2590"],["Dhan (Chawal)","2280–2450"],["Chana","5200–5450"],["Masoor","6200–6500"],
    ["Aloo","1460–1570"],["Pyaz","1000–1080"],["Tamatar","1420–1530"],["Arhar","9700–10100"],
    ["Sarso","5550–5800"],["Moong","7700–8100"]
  ],
  "Agra Mandi": [
    ["Aloo","1350–1480"],["Gehu","2440–2600"],["Sarso","5600–5900"],["Bajra","2100–2250"],
    ["Matar","3150–3450"],["Gobi (Phool)","1250–1450"],["Gajar","1550–1750"],["Mooli","680–830"],
    ["Tamatar","1400–1500"],["Pyaz","980–1060"]
  ],
  "Meerut Mandi": [
    ["Ganna","355–385"],["Gehu","2460–2620"],["Dhan (Chawal)","2300–2470"],["Sarso","5650–5900"],
    ["Aloo","1470–1580"],["Pyaz","1010–1090"],["Tamatar","1430–1540"],["Bajra","2150–2300"],
    ["Jau","2100–2250"]
  ],
  "Prayagraj Mandi": [
    ["Gehu","2420–2580"],["Dhan (Chawal)","2250–2420"],["Chana","5150–5400"],["Masoor","6150–6450"],
    ["Matar","3100–3400"],["Aloo","1440–1550"],["Pyaz","990–1070"],["Tamatar","1400–1500"]
  ],
  "Bareilly Mandi": [
    ["Gehu","2440–2600"],["Dhan (Chawal)","2270–2440"],["Ganna","345–375"],["Sarso","5600–5850"],
    ["Aloo","1460–1570"],["Pyaz","1000–1080"],["Matar","3150–3450"],["Makka","2190–2310"]
  ],
  "Moradabad Mandi": [
    ["Ganna","350–380"],["Gehu","2450–2610"],["Dhan (Chawal)","2280–2450"],["Sarso","5620–5870"],
    ["Aloo","1470–1580"],["Pyaz","1010–1090"],["Matar","3200–3500"],["Makka","2180–2300"]
  ],
  "Jhansi Mandi": [
    ["Chana","5300–5550"],["Til","9500–10000"],["Moong","7800–8200"],["Urad","8500–8900"],
    ["Jau","2100–2250"],["Gehu","2400–2560"],["Sarso","5550–5800"],["Arhar","9700–10100"]
  ]
};

// Populates the mandi dropdown (Hindi labels) and shows the table for the selected mandi.
function renderMandi(){
  const select = document.getElementById('mandi-select');
  if(!select) return;

  select.innerHTML = '';
  Object.keys(mandiData).forEach(name=>{
    const opt = document.createElement('option');
    opt.value = name;                             // internal value stays English (for matching)
    opt.textContent = mandiNameHindi[name] || name; // shown text is Hindi
    select.appendChild(opt);
  });

  // Default to the farmer's nearest mandi (from saved location), if known.
  const saved = (typeof getSavedLocation === 'function') ? getSavedLocation() : null;
  if(saved && saved.nearestMandi && mandiData[saved.nearestMandi]){
    select.value = saved.nearestMandi;
  }

  renderSelectedMandi();
}

function renderSelectedMandi(){
  const select = document.getElementById('mandi-select');
  const tbody = document.getElementById('mandi-prices');
  if(!select || !tbody) return;

  const chosen = select.value;
  const rows = mandiData[chosen] || [];
  tbody.innerHTML = rows.map(r=>
    `<tr><td>${cropNameHindi[r[0]] || r[0]}</td><td class="range">₹${r[1]}</td></tr>`
  ).join('');
}
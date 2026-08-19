// ===================== MANDI BHAV (demo/sample data) =====================
// Backend API integration hui thi, lekin Agmarknet ka data Gorakhpur/UP ke
// liye inconsistent tha (kabhi milta, kabhi nahi) — isliye demo data use
// kar rahe hain jisme har mandi mein zyada variety dikhayi gayi hai.

const mandiData = {
  "mandi-gkp": [
    ["Gehu", "2440–2600"], ["Dhan (Chawal)", "2330–2500"], ["Makka", "2180–2300"],["Chana", "5200–5450"], ["Arhar", "9800–10200"],
    ["Sarso", "5600–5850"], ["Aloo", "1480–1580"], ["Pyaz", "1000–1080"],
    ["Tamatar", "1450–1550"], ["Bhindi", "1800–2000"], ["Baingan", "1200–1400"],
    ["Patta Gobi", "900–1100"], ["Gobi (Phool)", "1300–1500"], ["Lauki", "800–950"],
    ["Kheera", "1000–1150"], ["Mirch (Hari)", "2800–3200"], ["Lahsun", "6500–7200"],
    ["Adrak", "4500–5000"], ["Gajar", "1600–1800"], ["Mooli", "700–850"]
  ],
  "mandi-sehjanwa": [
    ["Gehu", "2460–2615"], ["Dhan (Chawal)", "2180–2240"], ["Makka", "2180–2220"],
    ["Masoor", "6200–6500"], ["Matar", "3200–3500"], ["Jau", "2100–2250"],
    ["Aloo", "1450–1560"], ["Pyaz", "980–1050"], ["Tamatar", "1400–1500"],
    ["Baingan", "1150–1350"], ["Palak", "600–750"], ["Dhaniya (Patti)", "3500–4000"],
    ["Kaddu", "700–850"], ["Shimla Mirch", "2200–2500"]
  ],
  "mandi-chorichora": [
    ["Gehu", "2400–2410"], ["Dhan (Chawal)", "2200–2350"], ["Moong", "7800–8200"],
    ["Urad", "8500–8900"], ["Til", "9500–10000"], ["Soybean", "4200–4450"],
    ["Aloo", "1500–1600"], ["Pyaz", "1020–1100"], ["Tamatar", "1500–1600"],
    ["Bhindi", "1750–1950"], ["Gajar", "1550–1750"], ["Mooli", "750–900"],
    ["Kheera", "950–1100"]
  ]
};

function renderMandi(){
  Object.keys(mandiData).forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = mandiData[id].map(r=>`<tr><td>${r[0]}</td><td class="range">₹${r[1]}</td></tr>`).join('');
  });
}
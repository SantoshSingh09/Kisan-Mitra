// ===================== SHARED CONFIG & AUTH STORAGE =====================
// Every page includes this file first. Because this is now a multi-page
// site (each click loads a new HTML page), we can't keep the login token
// in a plain JS variable — it would be lost on every page change.
// Instead we store it in the browser's localStorage, which survives
// page navigation and reloads.

const API_BASE = 'http://localhost:5000/api';

function saveSession(token, user) {
  localStorage.setItem('km_token', token);
  localStorage.setItem('km_user', JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem('km_token');
}

function getUser() {
  const raw = localStorage.getItem('km_user');
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  localStorage.removeItem('km_token');
  localStorage.removeItem('km_user');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

// Call this at the top of every page that requires login.
// If there's no token, it sends the user back to the login page.
function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  const user = getUser();
  const nameEl = document.getElementById('user-name-display');
  if (nameEl && user) { nameEl.textContent = user.name; }
  return true;
}

function doLogout() {
  clearSession();
  window.location.href = 'index.html';
}

// ===================== HINDI HELPERS (sab pages mein use hote hain) =====================
const HI_CROPS = {
  "Gehu": "गेहूं", "Dhan": "धान", "Dhan (Chawal)": "धान (चावल)", "Ganna": "गन्ना", "Makka": "मक्का", "Chana": "चना", "Arhar": "अरहर",
  "Sarso": "सरसों", "Matar": "मटर", "Moong": "मूंग", "Urad": "उड़द", "Soybean": "सोयाबीन", "Til": "तिल", "Jute": "जूट",
  "Bajra": "बाजरा", "Jau": "जौ", "Masoor": "मसूर", "Alsi": "अलसी", "Aloo": "आलू", "Pyaz": "प्याज़", "Tamatar": "टमाटर",
  "Bhindi": "भिंडी", "Baingan": "बैंगन", "Lauki": "लौकी", "Tori": "तोरी", "Karela": "करेला", "Palak": "पालक", "Methi": "मेथी",
  "Dhaniya": "धनिया", "Dhaniya (Patti)": "धनिया (पत्ती)", "Gobi (Phool)": "फूल गोभी", "Patta Gobi": "पत्ता गोभी",
  "Gajar": "गाजर", "Mooli": "मूली", "Kheera": "खीरा", "Tarbuz": "तरबूज़", "Kharbuja": "खरबूजा", "Kaddu": "कद्दू",
  "Mirch (Hari)": "हरी मिर्च", "Shimla Mirch": "शिमला मिर्च", "Lahsun": "लहसुन", "Adrak": "अदरक"
};
const HI_SEASONS = { "kharif": "खरीफ", "rabi": "रबी", "zaid": "ज़ायद" };
const HI_SOILS = { "alluvial": "जलोढ़", "clayey": "चिकनी", "sandy": "बलुई", "alluvial-clayey": "जलोढ़-चिकनी" };
const HI_PLACES = {
  "gorakhpur": "गोरखपुर", "sadar": "सदर", "sadar (gorakhpur city)": "सदर (गोरखपुर शहर)", "chauri chaura": "चौरी चौरा",
  "sahjanwa": "सहजनवा", "khajni": "खजनी", "campierganj": "कैम्पियरगंज", "bansgaon": "बांसगांव", "gola": "गोला", "pipraich": "पिपराइच",
  "gorakhpur mandi": "गोरखपुर मंडी", "sehjanwa mandi": "सहजनवा मंडी", "chorichora mandi": "चौरीचौरा मंडी", "unknown location": "अज्ञात स्थान"
};
const HI_EXPENSE = { "Beej": "बीज", "Khaad": "खाद", "Pesticide": "कीटनाशक", "Mazdoori": "मज़दूरी", "Diesel/Bijli": "डीज़ल/बिजली", "Anya": "अन्य" };
const HI_ROLES = { "admin": "एडमिन", "user": "किसान" };

function hiCrop(n) { return HI_CROPS[n] || n; }
function hiSeason(n) { return HI_SEASONS[String(n || '').toLowerCase()] || n || ''; }
function hiSoil(n) { return HI_SOILS[String(n || '').toLowerCase()] || n || ''; }
function hiPlace(n) { return HI_PLACES[String(n || '').toLowerCase()] || n || ''; }
function hiExpense(n) { return HI_EXPENSE[n] || n; }

// Backend ke (angrezi) message ko Hindi mein badalta hai. Jo message list mein nahi hota use bhi Hindi general message deta hai.
const HI_MESSAGES = {
  'Access token missing. Please login.': 'कृपया पहले लॉगिन करें',
  'Invalid or expired token': 'लॉगिन की अवधि समाप्त हो गई, कृपया दोबारा लॉगिन करें',
  'Admin access required': 'यह पेज सिर्फ़ एडमिन के लिए है',
  'All fields are required': 'सभी जानकारी भरना ज़रूरी है',
  'Name, phone and password are required': 'नाम, फ़ोन और पासवर्ड ज़रूरी हैं',
  'This phone number is already registered': 'यह फ़ोन नंबर पहले से पंजीकृत है',
  'Signup successful': 'साइन अप सफल रहा',
  'Login successful': 'लॉगिन सफल रहा',
  'Incorrect password': 'पासवर्ड गलत है',
  'User not found': 'उपयोगकर्ता नहीं मिला',
  'Name is required': 'नाम ज़रूरी है',
  'Profile updated successfully': 'प्रोफाइल सफलतापूर्वक सहेजी गई',
  'Error fetching profile': 'प्रोफाइल लोड करने में समस्या आई',
  'Error updating profile': 'प्रोफाइल सहेजने में समस्या आई',
  'Current and new password are both required': 'पुराना और नया पासवर्ड दोनों ज़रूरी हैं',
  'New password must be at least 6 characters': 'नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
  'Current password is incorrect': 'पुराना पासवर्ड गलत है',
  'Password changed successfully': 'पासवर्ड सफलतापूर्वक बदला गया',
  'Error hashing new password': 'पासवर्ड बदलने में समस्या आई',
  'Error hashing password': 'पासवर्ड सहेजने में समस्या आई',
  'Error updating password': 'पासवर्ड बदलने में समस्या आई',
  'Error verifying current password': 'पुराना पासवर्ड जांचने में समस्या आई',
  'Crop name is required': 'फसल का नाम ज़रूरी है',
  'Crop added successfully': 'फसल जोड़ी गई',
  'Crop deleted successfully': 'फसल हटा दी गई',
  'Crop not found': 'फसल नहीं मिली',
  'Error adding crop': 'फसल जोड़ने में समस्या आई',
  'Error deleting crop': 'फसल हटाने में समस्या आई',
  'Error fetching crops': 'फसलें लोड करने में समस्या आई',
  'Error fetching crop data': 'फसल की जानकारी लोड करने में समस्या आई',
  'Expense added successfully': 'खर्च जोड़ दिया गया',
  'Expense deleted successfully': 'खर्च हटा दिया गया',
  'Expense not found': 'खर्च नहीं मिला',
  'Error adding expense': 'खर्च जोड़ने में समस्या आई',
  'Error deleting expense': 'खर्च हटाने में समस्या आई',
  'Error fetching expenses': 'खर्च लोड करने में समस्या आई',
  'Sale added successfully': 'कमाई जोड़ दी गई',
  'Sale deleted successfully': 'कमाई हटा दी गई',
  'Sale not found': 'कमाई की एंट्री नहीं मिली',
  'Error adding sale': 'कमाई जोड़ने में समस्या आई',
  'Error deleting sale': 'कमाई हटाने में समस्या आई',
  'Error fetching sales': 'कमाई लोड करने में समस्या आई',
  'cropId, quantity and rate are required': 'फसल, मात्रा और दर ज़रूरी हैं',
  'cropId, type and amount are required': 'फसल, खर्च का प्रकार और राशि ज़रूरी हैं',
  'season and soil query parameters are required': 'मौसम और मिट्टी चुनना ज़रूरी है',
  'No recommendation found for this combination': 'इस मौसम और मिट्टी के लिए अभी कोई सुझाव उपलब्ध नहीं है',
  'Error fetching recommendation': 'सुझाव लोड करने में समस्या आई',
  'name query parameter is required': 'फसल का नाम ज़रूरी है',
  'Detailed info not available yet for this crop': 'इस फसल की विस्तृत जानकारी अभी उपलब्ध नहीं है',
  'Weather API key is not configured': 'मौसम सेवा अभी चालू नहीं है',
  'Error fetching weather data': 'मौसम की जानकारी नहीं मिल पाई',
  'Error parsing weather data': 'मौसम की जानकारी पढ़ने में समस्या आई',
  'Mandi API key is not configured': 'मंडी भाव सेवा अभी चालू नहीं है',
  'Error fetching mandi data': 'मंडी भाव नहीं मिल पाए',
  'lat and lon query parameters are required': 'स्थान की जानकारी ज़रूरी है',
  'Error fetching location details': 'स्थान की जानकारी नहीं मिल पाई',
  'Error looking up user data': 'उपयोगकर्ता की जानकारी लोड करने में समस्या आई',
  'Error fetching users': 'उपयोगकर्ता लोड करने में समस्या आई',
  'Error deleting user': 'उपयोगकर्ता हटाने में समस्या आई',
  'User and all their data deleted successfully': 'उपयोगकर्ता और उसका पूरा डेटा हटा दिया गया',
  'Entry added successfully': 'एंट्री जोड़ दी गई',
  'Entry deleted successfully': 'एंट्री हटा दी गई',
  'Entry not found': 'एंट्री नहीं मिली',
  'Error adding entry': 'एंट्री जोड़ने में समस्या आई',
  'Error deleting entry': 'एंट्री हटाने में समस्या आई',
  'Image is required': 'पहले पत्ते की फोटो चुनें',
  'Only JPEG, PNG or WebP images are supported': 'सिर्फ़ JPEG, PNG या WebP फोटो चलेगी',
  'Invalid image or image larger than 4 MB': 'फोटो सही नहीं है या 4 MB से बड़ी है',
  'Could not analyse this image. Please upload a clear leaf photo.': 'इस फोटो की जांच नहीं हो पाई। कृपया पत्ते की साफ़ फोटो डालें',
  'Disease analysis service error. Please try again.': 'रोग जांच सेवा में समस्या आई, कृपया दोबारा कोशिश करें',
  'Unexpected response from analysis service': 'जांच सेवा से गलत जवाब मिला, कृपया दोबारा कोशिश करें',
  'Free daily/minute limit reached. Please try again in a few minutes.': 'जांच की मुफ़्त सीमा पूरी हो गई है, कुछ मिनट बाद दोबारा कोशिश करें',
  'Analysis timed out. Please try again.': 'जांच में बहुत समय लग गया, कृपया दोबारा कोशिश करें',
  'Could not reach analysis service.': 'जांच सेवा से जुड़ नहीं पाए, कृपया दोबारा कोशिश करें',
  'GEMINI_API_KEY is not configured on the server': 'रोग जांच सेवा अभी चालू नहीं है (सर्वर पर API key नहीं लगी)'
};
function hiMsg(msg) {
  if (!msg) return 'कुछ गड़बड़ हो गई, कृपया दोबारा कोशिश करें';
  msg = String(msg);
  if (HI_MESSAGES[msg]) return HI_MESSAGES[msg];
  const key = Object.keys(HI_MESSAGES).find(k => msg.startsWith(k));
  if (key) return HI_MESSAGES[key] + msg.slice(key.length);
  if (/[ऀ-ॿ]/.test(msg)) return msg;
  console.warn('Untranslated message:', msg);
  return 'कुछ गड़बड़ हो गई, कृपया दोबारा कोशिश करें';
}

// ===================== JILA + BLOCK DATA =====================
const DISTRICTS = [
  {
    "key": "Gorakhpur",
    "hi": "गोरखपुर",
    "blocks": [
      {
        "key": "Bansgaon",
        "hi": "बांसगांव"
      },
      {
        "key": "Barhalganj",
        "hi": "बड़हलगंज"
      },
      {
        "key": "Belghat",
        "hi": "बेलघाट"
      },
      {
        "key": "Bhathat",
        "hi": "भटहट"
      },
      {
        "key": "Brahmpur",
        "hi": "ब्रह्मपुर"
      },
      {
        "key": "Campierganj",
        "hi": "कैम्पियरगंज"
      },
      {
        "key": "Chargawa",
        "hi": "चरगांवा"
      },
      {
        "key": "Gagaha",
        "hi": "गगहा"
      },
      {
        "key": "Gola",
        "hi": "गोला"
      },
      {
        "key": "Jungle Kaudia",
        "hi": "जंगल कौड़िया"
      },
      {
        "key": "Kauriram",
        "hi": "कौड़ीराम"
      },
      {
        "key": "Khajni",
        "hi": "खजनी"
      },
      {
        "key": "Khorabar",
        "hi": "खोराबार"
      },
      {
        "key": "Pali",
        "hi": "पाली"
      },
      {
        "key": "Pipraich",
        "hi": "पिपराइच"
      },
      {
        "key": "Piprauli",
        "hi": "पिपरौली"
      },
      {
        "key": "Sahjanwa",
        "hi": "सहजनवा"
      },
      {
        "key": "Sardarnagar",
        "hi": "सरदारनगर"
      },
      {
        "key": "Uruwa",
        "hi": "उरुवा"
      }
    ]
  },
  {
    "key": "Maharajganj",
    "hi": "महराजगंज",
    "blocks": [
      {
        "key": "Bridgmanganj",
        "hi": "बृजमनगंज"
      },
      {
        "key": "Dhani",
        "hi": "धानी"
      },
      {
        "key": "Ghughali",
        "hi": "घुघली"
      },
      {
        "key": "Laxmipur",
        "hi": "लक्ष्मीपुर"
      },
      {
        "key": "Maharajganj",
        "hi": "महराजगंज"
      },
      {
        "key": "Mithaura",
        "hi": "मिठौरा"
      },
      {
        "key": "Nichlaul",
        "hi": "निचलौल"
      },
      {
        "key": "Paniyara",
        "hi": "पनियरा"
      },
      {
        "key": "Partawal",
        "hi": "परतावल"
      },
      {
        "key": "Pharenda",
        "hi": "फरेंदा"
      },
      {
        "key": "Ratanpur",
        "hi": "रतनपुर"
      },
      {
        "key": "Siswa",
        "hi": "सिसवा"
      }
    ]
  },
  {
    "key": "Kushinagar",
    "hi": "कुशीनगर",
    "blocks": [
      {
        "key": "Bishunpura",
        "hi": "बिशुनपुरा"
      },
      {
        "key": "Dudahi",
        "hi": "दुदही"
      },
      {
        "key": "Fazilnagar",
        "hi": "फाजिलनगर"
      },
      {
        "key": "Hata",
        "hi": "हाटा"
      },
      {
        "key": "Kaptanganj",
        "hi": "कप्तानगंज"
      },
      {
        "key": "Kasaya",
        "hi": "कसया (कुशीनगर)"
      },
      {
        "key": "Khadda",
        "hi": "खड्डा"
      },
      {
        "key": "Motichak",
        "hi": "मोतीचक"
      },
      {
        "key": "Nebua Naurangia",
        "hi": "नेबुआ नौरंगिया"
      },
      {
        "key": "Padrauna",
        "hi": "पडरौना"
      },
      {
        "key": "Ramkola",
        "hi": "रामकोला"
      },
      {
        "key": "Seorahi",
        "hi": "सेवरही"
      },
      {
        "key": "Sukrauli",
        "hi": "सुकरौली"
      },
      {
        "key": "Tamkuhi Raj",
        "hi": "तमकुही राज"
      }
    ]
  },
  {
    "key": "Deoria",
    "hi": "देवरिया",
    "blocks": [
      {
        "key": "Baitalpur",
        "hi": "बैतालपुर"
      },
      {
        "key": "Bankata",
        "hi": "बनकटा"
      },
      {
        "key": "Barhaj",
        "hi": "बरहज"
      },
      {
        "key": "Bhagalpur",
        "hi": "भागलपुर"
      },
      {
        "key": "Bhaluani",
        "hi": "भलुअनी"
      },
      {
        "key": "Bhatni",
        "hi": "भटनी"
      },
      {
        "key": "Bhatpar Rani",
        "hi": "भाटपार रानी"
      },
      {
        "key": "Deoria Sadar",
        "hi": "देवरिया सदर"
      },
      {
        "key": "Desai Deoria",
        "hi": "देसाई देवरिया"
      },
      {
        "key": "Gauri Bazar",
        "hi": "गौरी बाजार"
      },
      {
        "key": "Lar",
        "hi": "लार"
      },
      {
        "key": "Pathar Dewa",
        "hi": "पथरदेवा"
      },
      {
        "key": "Rampur Karkhana",
        "hi": "रामपुर कारखाना"
      },
      {
        "key": "Rudrapur",
        "hi": "रुद्रपुर"
      },
      {
        "key": "Salempur",
        "hi": "सलेमपुर"
      },
      {
        "key": "Tarkulwa",
        "hi": "तरकुलवा"
      }
    ]
  },
  {
    "key": "Sant Kabir Nagar",
    "hi": "संत कबीर नगर",
    "blocks": [
      {
        "key": "Baghauli",
        "hi": "बघौली"
      },
      {
        "key": "Belhar Kala",
        "hi": "बेलहर कलां"
      },
      {
        "key": "Hainsar Bazar",
        "hi": "हैंसर बाजार"
      },
      {
        "key": "Khalilabad",
        "hi": "खलीलाबाद"
      },
      {
        "key": "Mehdawal",
        "hi": "मेहदावल"
      },
      {
        "key": "Nathnagar",
        "hi": "नाथनगर"
      },
      {
        "key": "Pauli",
        "hi": "पौली"
      },
      {
        "key": "Santha",
        "hi": "सांथा"
      },
      {
        "key": "Semariyawan",
        "hi": "सेमरियावां"
      }
    ]
  },
  {
    "key": "Basti",
    "hi": "बस्ती",
    "blocks": [
      {
        "key": "Bahadurpur",
        "hi": "बहादुरपुर"
      },
      {
        "key": "Bankati",
        "hi": "बनकटी"
      },
      {
        "key": "Basti",
        "hi": "बस्ती"
      },
      {
        "key": "Dubauliya",
        "hi": "दुबौलिया"
      },
      {
        "key": "Gaur",
        "hi": "गौर"
      },
      {
        "key": "Harraiya",
        "hi": "हर्रैया"
      },
      {
        "key": "Kaptanganj",
        "hi": "कप्तानगंज"
      },
      {
        "key": "Kudaraha",
        "hi": "कुदरहा"
      },
      {
        "key": "Paras Rampur",
        "hi": "परसरामपुर"
      },
      {
        "key": "Ramnagar",
        "hi": "रामनगर"
      },
      {
        "key": "Rudauli",
        "hi": "रुधौली"
      },
      {
        "key": "Saltaua Gopal Pur",
        "hi": "सल्टौआ गोपालपुर"
      },
      {
        "key": "Sau Ghat",
        "hi": "सौघाट"
      },
      {
        "key": "Vikram Jot",
        "hi": "विक्रमजोत"
      }
    ]
  },
  {
    "key": "Mau",
    "hi": "मऊ",
    "blocks": [
      {
        "key": "Badraon",
        "hi": "बड़राव"
      },
      {
        "key": "Dohri Ghat",
        "hi": "दोहरीघाट"
      },
      {
        "key": "Fatehpur Madaun",
        "hi": "फतेहपुर मंडाव"
      },
      {
        "key": "Ghosi",
        "hi": "घोसी"
      },
      {
        "key": "Kopaganj",
        "hi": "कोपागंज"
      },
      {
        "key": "Mohammadabad Gohana",
        "hi": "मोहम्मदाबाद गोहना"
      },
      {
        "key": "Pardaha",
        "hi": "परदहा"
      },
      {
        "key": "Ranipur",
        "hi": "रानीपुर"
      },
      {
        "key": "Ratanpura",
        "hi": "रतनपुरा"
      }
    ]
  }
];

function districtHi(key) { const d = DISTRICTS.find(x => x.key === key); return d ? d.hi : hiPlace(key); }
function blockHi(districtKey, blockKey) {
  const d = DISTRICTS.find(x => x.key === districtKey);
  const b = d && d.blocks.find(x => x.key === blockKey);
  return b ? b.hi : hiPlace(blockKey);
}
// "ब्लॉक, जिला" jaisa Hindi text (purane users ke liye jinke paas block nahi hai, sirf jila/tehsil dikhta hai)
function placeLabelHi(districtKey, blockKey) {
  if (!districtKey && !blockKey) return '—';
  const dist = districtKey ? districtHi(districtKey) : '';
  return blockKey ? blockHi(districtKey, blockKey) + (dist ? ', ' + dist : '') : dist;
}
function fillDistrictSelect(sel, selected) {
  sel.innerHTML = '<option value="">जिला चुनें</option>' +
    DISTRICTS.map(d => `<option value="${d.key}">${d.hi}</option>`).join('');
  if (selected) sel.value = selected;
}
function fillBlockSelect(blockSel, districtKey, selected) {
  const d = DISTRICTS.find(x => x.key === districtKey);
  if (!d) {
    blockSel.innerHTML = '<option value="">पहले जिला चुनें</option>';
    blockSel.disabled = true;
    return;
  }
  blockSel.innerHTML = '<option value="">ब्लॉक चुनें</option>' +
    d.blocks.map(b => `<option value="${b.key}">${b.hi}</option>`).join('');
  blockSel.disabled = false;
  if (selected) blockSel.value = selected;
}
// Do dropdown jodta hai: jila badalne par block ki list badal jati hai
function setupDistrictBlock(districtSel, blockSel, selDistrict, selBlock) {
  fillDistrictSelect(districtSel, selDistrict);
  fillBlockSelect(blockSel, districtSel.value, selBlock);
  districtSel.onchange = () => fillBlockSelect(blockSel, districtSel.value);
}

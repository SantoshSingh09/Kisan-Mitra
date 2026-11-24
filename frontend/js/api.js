// ===================== SHARED CONFIG & AUTH STORAGE =====================
// Every page includes this file first. Because this is now a multi-page
// site (each click loads a new HTML page), we can't keep the login token
// in a plain JS variable — it would be lost on every page change.
// Instead we store it in the browser's localStorage, which survives
// page navigation and reloads.

const API_BASE = 'http://localhost:5000/api';

function saveSession(token, user){
  localStorage.setItem('km_token', token);
  localStorage.setItem('km_user', JSON.stringify(user));
}

function getToken(){
  return localStorage.getItem('km_token');
}

function getUser(){
  const raw = localStorage.getItem('km_user');
  return raw ? JSON.parse(raw) : null;
}

function clearSession(){
  localStorage.removeItem('km_token');
  localStorage.removeItem('km_user');
}

function authHeaders(){
  return { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + getToken() };
}

// Call this at the top of every page that requires login.
// If there's no token, it sends the user back to the login page.
function requireAuth(){
  if(!getToken()){
    window.location.href = 'login.html';
    return false;
  }
  const user = getUser();
  const nameEl = document.getElementById('user-name-display');
  if(nameEl && user){ nameEl.textContent = user.name; }
  return true;
}

function doLogout(){
  clearSession();
  window.location.href = 'index.html';
}

// ===================== HINDI HELPERS (sab pages mein use hote hain) =====================
const HI_CROPS = {
  "Gehu":"गेहूं","Dhan":"धान","Dhan (Chawal)":"धान (चावल)","Ganna":"गन्ना","Makka":"मक्का","Chana":"चना","Arhar":"अरहर",
  "Sarso":"सरसों","Matar":"मटर","Moong":"मूंग","Urad":"उड़द","Soybean":"सोयाबीन","Til":"तिल","Jute":"जूट",
  "Bajra":"बाजरा","Jau":"जौ","Masoor":"मसूर","Alsi":"अलसी","Aloo":"आलू","Pyaz":"प्याज़","Tamatar":"टमाटर",
  "Bhindi":"भिंडी","Baingan":"बैंगन","Lauki":"लौकी","Tori":"तोरी","Karela":"करेला","Palak":"पालक","Methi":"मेथी",
  "Dhaniya":"धनिया","Dhaniya (Patti)":"धनिया (पत्ती)","Gobi (Phool)":"फूल गोभी","Patta Gobi":"पत्ता गोभी",
  "Gajar":"गाजर","Mooli":"मूली","Kheera":"खीरा","Tarbuz":"तरबूज़","Kharbuja":"खरबूजा","Kaddu":"कद्दू",
  "Mirch (Hari)":"हरी मिर्च","Shimla Mirch":"शिमला मिर्च","Lahsun":"लहसुन","Adrak":"अदरक"
};
const HI_SEASONS = { "kharif":"खरीफ", "rabi":"रबी", "zaid":"ज़ायद" };
const HI_SOILS = { "alluvial":"जलोढ़", "clayey":"चिकनी", "sandy":"बलुई", "alluvial-clayey":"जलोढ़-चिकनी" };
const HI_PLACES = {
  "gorakhpur":"गोरखपुर","sadar":"सदर","sadar (gorakhpur city)":"सदर (गोरखपुर शहर)","chauri chaura":"चौरी चौरा",
  "sahjanwa":"सहजनवा","khajni":"खजनी","campierganj":"कैम्पियरगंज","bansgaon":"बांसगांव","gola":"गोला","pipraich":"पिपराइच",
  "gorakhpur mandi":"गोरखपुर मंडी","sehjanwa mandi":"सहजनवा मंडी","chorichora mandi":"चौरीचौरा मंडी","unknown location":"अज्ञात स्थान"
};
const HI_EXPENSE = { "Beej":"बीज","Khaad":"खाद","Pesticide":"कीटनाशक","Mazdoori":"मज़दूरी","Diesel/Bijli":"डीज़ल/बिजली","Anya":"अन्य" };
const HI_ROLES = { "admin":"एडमिन", "user":"किसान" };

function hiCrop(n){ return HI_CROPS[n] || n; }
function hiSeason(n){ return HI_SEASONS[String(n||'').toLowerCase()] || n || ''; }
function hiSoil(n){ return HI_SOILS[String(n||'').toLowerCase()] || n || ''; }
function hiPlace(n){ return HI_PLACES[String(n||'').toLowerCase()] || n || ''; }
function hiExpense(n){ return HI_EXPENSE[n] || n; }

// Backend ke (angrezi) message ko Hindi mein badalta hai. Jo message list mein nahi hota use bhi Hindi general message deta hai.
const HI_MESSAGES = {
  'Access token missing. Please login.':'कृपया पहले लॉगिन करें',
  'Invalid or expired token':'लॉगिन की अवधि समाप्त हो गई, कृपया दोबारा लॉगिन करें',
  'Admin access required':'यह पेज सिर्फ़ एडमिन के लिए है',
  'All fields are required':'सभी जानकारी भरना ज़रूरी है',
  'Name, phone and password are required':'नाम, फ़ोन और पासवर्ड ज़रूरी हैं',
  'This phone number is already registered':'यह फ़ोन नंबर पहले से पंजीकृत है',
  'Signup successful':'साइन अप सफल रहा',
  'Login successful':'लॉगिन सफल रहा',
  'Incorrect password':'पासवर्ड गलत है',
  'User not found':'उपयोगकर्ता नहीं मिला',
  'Name is required':'नाम ज़रूरी है',
  'Profile updated successfully':'प्रोफाइल सफलतापूर्वक सहेजी गई',
  'Error fetching profile':'प्रोफाइल लोड करने में समस्या आई',
  'Error updating profile':'प्रोफाइल सहेजने में समस्या आई',
  'Current and new password are both required':'पुराना और नया पासवर्ड दोनों ज़रूरी हैं',
  'New password must be at least 6 characters':'नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
  'Current password is incorrect':'पुराना पासवर्ड गलत है',
  'Password changed successfully':'पासवर्ड सफलतापूर्वक बदला गया',
  'Error hashing new password':'पासवर्ड बदलने में समस्या आई',
  'Error hashing password':'पासवर्ड सहेजने में समस्या आई',
  'Error updating password':'पासवर्ड बदलने में समस्या आई',
  'Error verifying current password':'पुराना पासवर्ड जांचने में समस्या आई',
  'Crop name is required':'फसल का नाम ज़रूरी है',
  'Crop added successfully':'फसल जोड़ी गई',
  'Crop deleted successfully':'फसल हटा दी गई',
  'Crop not found':'फसल नहीं मिली',
  'Error adding crop':'फसल जोड़ने में समस्या आई',
  'Error deleting crop':'फसल हटाने में समस्या आई',
  'Error fetching crops':'फसलें लोड करने में समस्या आई',
  'Error fetching crop data':'फसल की जानकारी लोड करने में समस्या आई',
  'Expense added successfully':'खर्च जोड़ दिया गया',
  'Expense deleted successfully':'खर्च हटा दिया गया',
  'Expense not found':'खर्च नहीं मिला',
  'Error adding expense':'खर्च जोड़ने में समस्या आई',
  'Error deleting expense':'खर्च हटाने में समस्या आई',
  'Error fetching expenses':'खर्च लोड करने में समस्या आई',
  'Sale added successfully':'कमाई जोड़ दी गई',
  'Sale deleted successfully':'कमाई हटा दी गई',
  'Sale not found':'कमाई की एंट्री नहीं मिली',
  'Error adding sale':'कमाई जोड़ने में समस्या आई',
  'Error deleting sale':'कमाई हटाने में समस्या आई',
  'Error fetching sales':'कमाई लोड करने में समस्या आई',
  'cropId, quantity and rate are required':'फसल, मात्रा और दर ज़रूरी हैं',
  'cropId, type and amount are required':'फसल, खर्च का प्रकार और राशि ज़रूरी हैं',
  'season and soil query parameters are required':'मौसम और मिट्टी चुनना ज़रूरी है',
  'No recommendation found for this combination':'इस मौसम और मिट्टी के लिए अभी कोई सुझाव उपलब्ध नहीं है',
  'Error fetching recommendation':'सुझाव लोड करने में समस्या आई',
  'name query parameter is required':'फसल का नाम ज़रूरी है',
  'Detailed info not available yet for this crop':'इस फसल की विस्तृत जानकारी अभी उपलब्ध नहीं है',
  'Weather API key is not configured':'मौसम सेवा अभी चालू नहीं है',
  'Error fetching weather data':'मौसम की जानकारी नहीं मिल पाई',
  'Error parsing weather data':'मौसम की जानकारी पढ़ने में समस्या आई',
  'Mandi API key is not configured':'मंडी भाव सेवा अभी चालू नहीं है',
  'Error fetching mandi data':'मंडी भाव नहीं मिल पाए',
  'lat and lon query parameters are required':'स्थान की जानकारी ज़रूरी है',
  'Error fetching location details':'स्थान की जानकारी नहीं मिल पाई',
  'Error looking up user data':'उपयोगकर्ता की जानकारी लोड करने में समस्या आई',
  'Error fetching users':'उपयोगकर्ता लोड करने में समस्या आई',
  'Error deleting user':'उपयोगकर्ता हटाने में समस्या आई',
  'User and all their data deleted successfully':'उपयोगकर्ता और उसका पूरा डेटा हटा दिया गया',
  'Entry added successfully':'एंट्री जोड़ दी गई',
  'Entry deleted successfully':'एंट्री हटा दी गई',
  'Entry not found':'एंट्री नहीं मिली',
  'Error adding entry':'एंट्री जोड़ने में समस्या आई',
  'Error deleting entry':'एंट्री हटाने में समस्या आई',
  'Image is required':'पहले पत्ते की फोटो चुनें',
  'Only JPEG, PNG or WebP images are supported':'सिर्फ़ JPEG, PNG या WebP फोटो चलेगी',
  'Invalid image or image larger than 4 MB':'फोटो सही नहीं है या 4 MB से बड़ी है',
  'Could not analyse this image. Please upload a clear leaf photo.':'इस फोटो की जांच नहीं हो पाई। कृपया पत्ते की साफ़ फोटो डालें',
  'Disease analysis service error. Please try again.':'रोग जांच सेवा में समस्या आई, कृपया दोबारा कोशिश करें',
  'Unexpected response from analysis service':'जांच सेवा से गलत जवाब मिला, कृपया दोबारा कोशिश करें',
  'Free daily/minute limit reached. Please try again in a few minutes.':'जांच की मुफ़्त सीमा पूरी हो गई है, कुछ मिनट बाद दोबारा कोशिश करें',
  'Analysis timed out. Please try again.':'जांच में बहुत समय लग गया, कृपया दोबारा कोशिश करें',
  'Could not reach analysis service.':'जांच सेवा से जुड़ नहीं पाए, कृपया दोबारा कोशिश करें',
  'GEMINI_API_KEY is not configured on the server':'रोग जांच सेवा अभी चालू नहीं है (सर्वर पर API key नहीं लगी)'
};
function hiMsg(msg){
  if(!msg) return 'कुछ गड़बड़ हो गई, कृपया दोबारा कोशिश करें';
  msg = String(msg);
  if(HI_MESSAGES[msg]) return HI_MESSAGES[msg];
  const key = Object.keys(HI_MESSAGES).find(k => msg.startsWith(k));
  if(key) return HI_MESSAGES[key] + msg.slice(key.length);
  if(/[ऀ-ॿ]/.test(msg)) return msg;
  console.warn('Untranslated message:', msg);
  return 'कुछ गड़बड़ हो गई, कृपया दोबारा कोशिश करें';
}
// Uttar Pradesh ke saare 75 jile aur 828 block (source: LGD - lgdirectory.gov.in).
// Block ke Hindi naam auto-transliteration se bane hain; galat ho to yahin "hi" badal dein.
const DISTRICTS = [
 {"key":"Agra","hi":"आगरा","blocks":[{"key":"Achhnera","hi":"अछनेरा"},{"key":"Akola","hi":"अकोला"},{"key":"Bah","hi":"बह"},{"key":"Barauli Ahir","hi":"बरौली अहिर"},{"key":"Bichpuri","hi":"बिचपुरी"},{"key":"Etmadpur","hi":"एतमदपुर"},{"key":"Fatehabad","hi":"फतेहआबाद"},{"key":"Fatehpur Sikri","hi":"फतेहपुर सिकरी"},{"key":"Jagner","hi":"जगनेर"},{"key":"Jaitpur Kalan","hi":"जैतपुर कलां"},{"key":"Khandauli","hi":"खंदौली"},{"key":"Kheragarh","hi":"खेरागढ़"},{"key":"Pinahat","hi":"पिनहत"},{"key":"Saiyan","hi":"सैयन"},{"key":"Shamsabad","hi":"शंसआबाद"}]},
 {"key":"Aligarh","hi":"अलीगढ़","blocks":[{"key":"Akrabad","hi":"अकरआबाद"},{"key":"Atrauli","hi":"अतरौली"},{"key":"Bijauli","hi":"बिजौली"},{"key":"Chandaus","hi":"चंदौस"},{"key":"Dhanipur","hi":"धनीपुर"},{"key":"Gangiri","hi":"गंगिरी"},{"key":"Gonda","hi":"गोंदा"},{"key":"Iglas","hi":"इगलस"},{"key":"Jawan Sikanderpur","hi":"जवन सिकंदेरपुर"},{"key":"Khair","hi":"खैर"},{"key":"Lodha","hi":"लोधा"},{"key":"Tappal","hi":"तप्पल"}]},
 {"key":"Ambedkar Nagar","hi":"अंबेडकर नगर","blocks":[{"key":"Akbarpur","hi":"अकबरपुर"},{"key":"Baskhari","hi":"बसखरी"},{"key":"Bhiti","hi":"भिती"},{"key":"Bhiyawan","hi":"भियवन"},{"key":"Jahangir Ganj","hi":"जहंगिर गंज"},{"key":"Jalal Pur","hi":"जलल पुर"},{"key":"Katehari","hi":"कतेहरी"},{"key":"Ram Nagar","hi":"राम नगर"},{"key":"Tanda","hi":"टांडा"}]},
 {"key":"Amethi","hi":"अमेठी","blocks":[{"key":"Amethi","hi":"अमेथी"},{"key":"Bahadurpur","hi":"बहदुरपुर"},{"key":"Bhadar","hi":"भदर"},{"key":"Bhetua","hi":"भेतुअ"},{"key":"Gauriganj","hi":"गौरीगंज"},{"key":"Jagdishpur","hi":"जगदिशपुर"},{"key":"Jamo","hi":"जमो"},{"key":"Musafir Khana","hi":"मुसफिर खना"},{"key":"Sangrampur","hi":"संगरमपुर"},{"key":"Shahgarh","hi":"शहगढ़"},{"key":"Shukul Bazar","hi":"शुकुल बाज़ार"},{"key":"Singhpur","hi":"सिंघपुर"},{"key":"Tiloi","hi":"तिलॉय"}]},
 {"key":"Amroha","hi":"अमरोहा","blocks":[{"key":"Amroha","hi":"अंरोहा"},{"key":"Dhanaura","hi":"धनौरा"},{"key":"Gajraula","hi":"गजरौला"},{"key":"Gangeshwari","hi":"गंगेशवरी"},{"key":"Hasanpur","hi":"हसनपुर"},{"key":"Joya","hi":"जोया"}]},
 {"key":"Auraiya","hi":"औरैया","blocks":[{"key":"Achchalda","hi":"अच्चलदा"},{"key":"Ajitmal","hi":"अजितमल"},{"key":"Auraiya","hi":"औरैया"},{"key":"Bhagyanagar","hi":"भगयानगर"},{"key":"Bidhuna","hi":"बिधुना"},{"key":"Erwa Katra","hi":"एरवा कतरा"},{"key":"Sahar","hi":"सहर"}]},
 {"key":"Ayodhya","hi":"अयोध्या","blocks":[{"key":"Amaniganj","hi":"अमनीगंज"},{"key":"Bikapur","hi":"बिकापुर"},{"key":"Hariyangatanganj","hi":"हरियंगतनगंज"},{"key":"Masodha","hi":"मसोधा"},{"key":"Maya Bazar","hi":"मया बाज़ार"},{"key":"Milkipur","hi":"मिलकीपुर"},{"key":"Mawai","hi":"मवै"},{"key":"Pura Bazar","hi":"पुरा बाज़ार"},{"key":"Rudauli","hi":"रुदौली"},{"key":"Sohawal","hi":"सोहवल"},{"key":"Tarun","hi":"तरुन"}]},
 {"key":"Azamgarh","hi":"आज़मगढ़","blocks":[{"key":"Ahiraula","hi":"अहिरौला"},{"key":"Atraulia","hi":"अतरौलिअ"},{"key":"Azmatgarh","hi":"अजमतगढ़"},{"key":"Bilariyaganj","hi":"बिलरियागंज"},{"key":"Haraiya","hi":"हरैया"},{"key":"Jahanaganj","hi":"जहनागंज"},{"key":"Koilsa","hi":"कॉयलसा"},{"key":"Lalganj","hi":"ललगंज"},{"key":"Mahrajganj","hi":"महरजगंज"},{"key":"Martinganj","hi":"मरतिनगंज"},{"key":"Mehnagar","hi":"मेहनगर"},{"key":"Mirzapur","hi":"मिरजापुर"},{"key":"Mohammadpur","hi":"मोहम्मदपुर"},{"key":"Palhana","hi":"पलहना"},{"key":"Palhani","hi":"पलहनी"},{"key":"Pawai","hi":"पवै"},{"key":"Phulpur","hi":"फुलपुर"},{"key":"Rani Ki Sarai","hi":"रनी की सराय"},{"key":"Sathiyaon","hi":"सथियाओन"},{"key":"Tahbarpur","hi":"तहबरपुर"},{"key":"Tarwa","hi":"तरवा"},{"key":"Thekma","hi":"थेकमा"}]},
 {"key":"Baghpat","hi":"बागपत","blocks":[{"key":"Baghpat","hi":"बघपत"},{"key":"Baraut","hi":"बरौत"},{"key":"Binauli","hi":"बिनौली"},{"key":"Chhaprauli","hi":"छपरौली"},{"key":"Khekra","hi":"खेकरा"},{"key":"Pilana","hi":"पिलना"}]},
 {"key":"Bahraich","hi":"बहराइच","blocks":[{"key":"Balaha","hi":"बलहा"},{"key":"Chitaura","hi":"चितौरा"},{"key":"Huzoorpur","hi":"हुजूरपुर"},{"key":"Jarwal","hi":"जरवल"},{"key":"Kaisarganj","hi":"कैसरगंज"},{"key":"Mahasi","hi":"महसी"},{"key":"Mihinpurwa","hi":"मिहिनपुरवा"},{"key":"Nawabganj","hi":"नवबगंज"},{"key":"Payagpur","hi":"पयगपुर"},{"key":"Phakharpur","hi":"फखरपुर"},{"key":"Risia","hi":"रिसिअ"},{"key":"Shivpur","hi":"शिवपुर"},{"key":"Tejwapur","hi":"तेजवापुर"},{"key":"Visheshwarganj","hi":"विशेशवरगंज"}]},
 {"key":"Ballia","hi":"बलिया","blocks":[{"key":"Bairia","hi":"बैरिअ"},{"key":"Bansdih","hi":"बंसदिह"},{"key":"Belhari","hi":"बेलहरी"},{"key":"Beruarbari","hi":"बेरुअरबरी"},{"key":"Chilkahar","hi":"चिलकहर"},{"key":"Dubhar","hi":"दुभर"},{"key":"Garwar","hi":"गरवर"},{"key":"Hanumanganj","hi":"हनुमनगंज"},{"key":"Maniar","hi":"मनिअर"},{"key":"Murlichhapra","hi":"मुरलिछपरा"},{"key":"Nagra","hi":"नगरा"},{"key":"Navanagar","hi":"नवानगर"},{"key":"Pandah","hi":"पंदह"},{"key":"Rasra","hi":"रसरा"},{"key":"Reoti","hi":"रेओती"},{"key":"Siar","hi":"सिअर"},{"key":"Sohanv","hi":"सोहंव"}]},
 {"key":"Balrampur","hi":"बलरामपुर","blocks":[{"key":"Balrampur","hi":"बलरमपुर"},{"key":"Gaindas Bujurg","hi":"गैंदस बुजुर्ग"},{"key":"Gaisri","hi":"गैसरी"},{"key":"Harriya Satgharwa","hi":"हर्रिया सतघरवा"},{"key":"Pachpedwa","hi":"पचपेदवा"},{"key":"Rehera Bazaar","hi":"रेहेरा बजार"},{"key":"Shriduttganj","hi":"श्रिदुत्तगंज"},{"key":"Tulsipur","hi":"तुलसीपुर"},{"key":"Utraula","hi":"उतरौला"}]},
 {"key":"Banda","hi":"बांदा","blocks":[{"key":"Baberu","hi":"बबेरू"},{"key":"Badokhar Khurd","hi":"बदोखर खुर्द"},{"key":"Bisanda","hi":"बिसंदा"},{"key":"Jaspura","hi":"जसपुरा"},{"key":"Kamasin","hi":"कमसिन"},{"key":"Mahuva","hi":"महुवा"},{"key":"Naraini","hi":"नरैनी"},{"key":"Tindwari","hi":"तिंदवरी"}]},
 {"key":"Barabanki","hi":"बाराबंकी","blocks":[{"key":"Bani Kodar","hi":"बनी कोदर"},{"key":"Banki","hi":"बंकी"},{"key":"Dariyabad","hi":"दरियआबाद"},{"key":"Dewa","hi":"देवा"},{"key":"Fatehpur","hi":"फतेहपुर"},{"key":"Haidargarh","hi":"हैदरगढ़"},{"key":"Harakh","hi":"हरख"},{"key":"Masauli","hi":"मसौली"},{"key":"Nindaura","hi":"निंदौरा"},{"key":"Puredalai","hi":"पुरेदलै"},{"key":"Ramnagar","hi":"रमनगर"},{"key":"Sidhaur","hi":"सिधौर"},{"key":"Sirauli Gauspur","hi":"सिरौली गौसपुर"},{"key":"Suratganj","hi":"सुरतगंज"},{"key":"Trivediganj","hi":"त्रिवेदीगंज"}]},
 {"key":"Bareilly","hi":"बरेली","blocks":[{"key":"Aalampur Jafarabad","hi":"आलमपुर जफरआबाद"},{"key":"Baheri","hi":"बहेरी"},{"key":"Bhadpura","hi":"भदपुरा"},{"key":"Bhojipura","hi":"भोजिपुरा"},{"key":"Bhuta","hi":"भुता"},{"key":"Bithiri Chainpur","hi":"बिथिरी चैनपुर"},{"key":"Damkhauda","hi":"दंखौदा"},{"key":"Faridpur","hi":"फरिदपुर"},{"key":"Fatehganj West","hi":"फतेहगंज वेस्त"},{"key":"Kyara","hi":"क्यरा"},{"key":"Majhgawan","hi":"मझगवन"},{"key":"Mirganj","hi":"मिरगंज"},{"key":"Nawabganj","hi":"नवबगंज"},{"key":"Ramnagar","hi":"रमनगर"},{"key":"Shergarh","hi":"शेरगढ़"}]},
 {"key":"Basti","hi":"बस्ती","blocks":[{"key":"Bahadurpur","hi":"बहादुरपुर"},{"key":"Bankati","hi":"बनकटी"},{"key":"Basti","hi":"बस्ती"},{"key":"Dubauliya","hi":"दुबौलिया"},{"key":"Gaur","hi":"गौर"},{"key":"Harraiya","hi":"हर्रैया"},{"key":"Kaptanganj","hi":"कप्तानगंज"},{"key":"Kudaraha","hi":"कुदरहा"},{"key":"Paras Rampur","hi":"परसरामपुर"},{"key":"Ramnagar","hi":"रामनगर"},{"key":"Rudauli","hi":"रुधौली"},{"key":"Saltaua Gopal Pur","hi":"सल्टौआ गोपालपुर"},{"key":"Sau Ghat","hi":"सौघाट"},{"key":"Vikram Jot","hi":"विक्रमजोत"}]},
 {"key":"Bhadohi","hi":"भदोही","blocks":[{"key":"Abhauli","hi":"अभौली"},{"key":"Aurai","hi":"औरै"},{"key":"Bhadohi","hi":"भदोही"},{"key":"Deegh","hi":"दीघ"},{"key":"Gyanpur","hi":"ग्यनपुर"},{"key":"Suriyavan","hi":"सुरियवन"}]},
 {"key":"Bijnor","hi":"बिजनौर","blocks":[{"key":"Afzalgarh","hi":"अफजलगढ़"},{"key":"Budhanpur Seohara","hi":"बुधनपुर सेओहरा"},{"key":"Dhampur","hi":"धमपुर"},{"key":"Haldaur(khari Jhalu)","hi":"हलदौर खरी झलू"},{"key":"Jalilpur","hi":"जलिलपुर"},{"key":"Kiratpur","hi":"किरतपुर"},{"key":"Kotwali","hi":"कोतवली"},{"key":"Mohammedpur Deomal","hi":"मोहम्मेदपुर देओमल"},{"key":"Najibabad","hi":"नजिबआबाद"},{"key":"Nehtaur","hi":"नेहतौर"},{"key":"Noorpur","hi":"नूरपुर"}]},
 {"key":"Budaun","hi":"बदायूं","blocks":[{"key":"Ambiapur","hi":"अंबिअपुर"},{"key":"Asafpur","hi":"असफपुर"},{"key":"Bisauli","hi":"बिसौली"},{"key":"Dahgavan","hi":"दहगवन"},{"key":"Dataganj","hi":"दतागंज"},{"key":"Islamnagar","hi":"इसलमनगर"},{"key":"Jagat","hi":"जगत"},{"key":"Mion","hi":"मिओन"},{"key":"Qadar Chowk","hi":"कदर चौक"},{"key":"Sahaswan","hi":"सहसवन"},{"key":"Salarpur","hi":"सलरपुर"},{"key":"Samrer","hi":"संरेर"},{"key":"Ujhani","hi":"उझनी"},{"key":"Usawan","hi":"उसवन"},{"key":"Wazirganj","hi":"वजिरगंज"}]},
 {"key":"Bulandshahr","hi":"बुलंदशहर","blocks":[{"key":"Agauta","hi":"अगौता"},{"key":"Anupshahr","hi":"अनुपशहर"},{"key":"Araniya","hi":"अरनिया"},{"key":"Bhawan Bahadur Nagar","hi":"भवन बहदुर नगर"},{"key":"Bulandshahr","hi":"बुलंदशहर"},{"key":"Danpur","hi":"दनपुर"},{"key":"Dibai","hi":"दिबै"},{"key":"Gulaothi","hi":"गुलाओथी"},{"key":"Jahangirabad","hi":"जहंगिरआबाद"},{"key":"Khurja","hi":"खुरजा"},{"key":"Lakhaothi","hi":"लखाओथी"},{"key":"Pahasu","hi":"पहसू"},{"key":"Shikarpur","hi":"शिकरपुर"},{"key":"Sikandrabad","hi":"सिकंदरआबाद"},{"key":"Syana","hi":"स्यना"},{"key":"Unchagaon","hi":"उंचागांव"}]},
 {"key":"Chandauli","hi":"चंदौली","blocks":[{"key":"Berahani","hi":"बेरहनी"},{"key":"Chahniya","hi":"चहनिया"},{"key":"Chakiya","hi":"चकिया"},{"key":"Chandauli","hi":"चंदौली"},{"key":"Dhanapur","hi":"धनापुर"},{"key":"Naugarh","hi":"नौगढ़"},{"key":"Niyamatabad","hi":"नियमतआबाद"},{"key":"Sahabganj","hi":"सहबगंज"},{"key":"Sakaldiha","hi":"सकलदिहा"}]},
 {"key":"Chitrakoot","hi":"चित्रकूट","blocks":[{"key":"Karwi","hi":"करवी"},{"key":"Manikpur","hi":"मनिकपुर"},{"key":"Mau","hi":"मऊ"},{"key":"Pahari","hi":"पहरी"},{"key":"Ramnagar","hi":"रमनगर"}]},
 {"key":"Deoria","hi":"देवरिया","blocks":[{"key":"Baitalpur","hi":"बैतालपुर"},{"key":"Bankata","hi":"बनकटा"},{"key":"Barhaj","hi":"बरहज"},{"key":"Bhagalpur","hi":"भागलपुर"},{"key":"Bhaluani","hi":"भलुअनी"},{"key":"Bhatni","hi":"भटनी"},{"key":"Bhatpar Rani","hi":"भाटपार रानी"},{"key":"Deoria Sadar","hi":"देवरिया सदर"},{"key":"Desai Deoria","hi":"देसाई देवरिया"},{"key":"Gauri Bazar","hi":"गौरी बाजार"},{"key":"Lar","hi":"लार"},{"key":"Pathar Dewa","hi":"पथरदेवा"},{"key":"Rampur Karkhana","hi":"रामपुर कारखाना"},{"key":"Rudrapur","hi":"रुद्रपुर"},{"key":"Salempur","hi":"सलेमपुर"},{"key":"Tarkalua","hi":"तरकलुअ"}]},
 {"key":"Etah","hi":"एटा","blocks":[{"key":"Aliganj","hi":"अलिगंज"},{"key":"Awagarh","hi":"अवागढ़"},{"key":"Jaithara","hi":"जैथरा"},{"key":"Jalesar","hi":"जलेसर"},{"key":"Marehra","hi":"मरेहरा"},{"key":"Nidhauli Kalan","hi":"निधौली कलां"},{"key":"Sakit","hi":"सकित"},{"key":"Shitalpur","hi":"शितलपुर"}]},
 {"key":"Etawah","hi":"इटावा","blocks":[{"key":"Barhpura","hi":"बरहपुरा"},{"key":"Basrehar","hi":"बसरेहर"},{"key":"Bharthana","hi":"भरथना"},{"key":"Chakarnagar","hi":"चकरनगर"},{"key":"Jaswantnagar","hi":"जसवंतनगर"},{"key":"Mahewa","hi":"महेवा"},{"key":"Sefai","hi":"सेफै"},{"key":"Takha","hi":"तखा"}]},
 {"key":"Farrukhabad","hi":"फर्रुखाबाद","blocks":[{"key":"Barhpur","hi":"बरहपुर"},{"key":"Kaimganj","hi":"कैमगंज"},{"key":"Kamalganj","hi":"कमलगंज"},{"key":"Mohamdabad","hi":"मोहंदआबाद"},{"key":"Nawabganj","hi":"नवबगंज"},{"key":"Rajepur","hi":"रजेपुर"},{"key":"Shamsabad","hi":"शंसआबाद"}]},
 {"key":"Fatehpur","hi":"फतेहपुर","blocks":[{"key":"Airayan","hi":"ऐरयन"},{"key":"Amauli","hi":"अमौली"},{"key":"Asothar","hi":"असोथर"},{"key":"Bahua","hi":"बहुअ"},{"key":"Bhitaura","hi":"भितौरा"},{"key":"Devmai","hi":"देवमै"},{"key":"Dhata","hi":"धता"},{"key":"Haswa","hi":"हसवा"},{"key":"Hathgaon","hi":"हथगांव"},{"key":"Khajuha","hi":"खजुहा"},{"key":"Malwan","hi":"मलवन"},{"key":"Telyani","hi":"तेलयनी"},{"key":"Vijayipur","hi":"विजयीपुर"}]},
 {"key":"Firozabad","hi":"फिरोजाबाद","blocks":[{"key":"Araon","hi":"अराओन"},{"key":"Eka","hi":"एका"},{"key":"Firozabad","hi":"फिरोजआबाद"},{"key":"Hathwant","hi":"हथवंत"},{"key":"Jasrana","hi":"जसरना"},{"key":"Madanpur","hi":"मदनपुर"},{"key":"Narkhi","hi":"नरखी"},{"key":"Shikohabad","hi":"शिकोहआबाद"},{"key":"Tundla","hi":"तुंदला"}]},
 {"key":"Gautam Buddha Nagar","hi":"गौतम बुद्ध नगर","blocks":[{"key":"Bisrakh","hi":"बिसरख"},{"key":"Dadri","hi":"ददरी"},{"key":"Dankaur","hi":"दंकौर"},{"key":"Jewar","hi":"जेवर"}]},
 {"key":"Ghaziabad","hi":"गाज़ियाबाद","blocks":[{"key":"Bhojpur","hi":"भोजपुर"},{"key":"Loni","hi":"लोनी"},{"key":"Muradnagar","hi":"मुरदनगर"},{"key":"Rajapur","hi":"रजापुर"}]},
 {"key":"Ghazipur","hi":"गाज़ीपुर","blocks":[{"key":"Bhadaura","hi":"भदौरा"},{"key":"Bhanwarkol","hi":"भंवरकोल"},{"key":"Devkali","hi":"देवकली"},{"key":"Ghazipur","hi":"घजीपुर"},{"key":"Jakhania","hi":"जखनिअ"},{"key":"Karanda","hi":"करंदा"},{"key":"Kasimabad","hi":"कसिमआबाद"},{"key":"Manihari","hi":"मनिहरी"},{"key":"Mardah","hi":"मरदह"},{"key":"Mohammadabad","hi":"मोहम्मदआबाद"},{"key":"Revatipur","hi":"रेवतीपुर"},{"key":"Sadat","hi":"सदत"},{"key":"Saidpur","hi":"सैदपुर"},{"key":"Varachakwar","hi":"वरचकवर"},{"key":"Virno","hi":"विरनो"},{"key":"Zamania","hi":"जमनिअ"}]},
 {"key":"Gonda","hi":"गोंडा","blocks":[{"key":"Babhanjot","hi":"बभंजोत"},{"key":"Belsar","hi":"बेलसर"},{"key":"Chhapia","hi":"छपिअ"},{"key":"Colonelganj","hi":"कोलोनेलगंज"},{"key":"Haldharmau","hi":"हलधरमौ"},{"key":"Itiathok","hi":"इतिअथोक"},{"key":"Jhanjhari","hi":"झंझरी"},{"key":"Katra Bazar","hi":"कतरा बाज़ार"},{"key":"Mankapur","hi":"मंकापुर"},{"key":"Mujehana","hi":"मुजेहना"},{"key":"Nawabganj","hi":"नवबगंज"},{"key":"Pandri Kripal","hi":"पंदरी क्रिपल"},{"key":"Paraspur","hi":"परसपुर"},{"key":"Rupaideeh","hi":"रुपैदीह"},{"key":"Tarabganj","hi":"तरबगंज"},{"key":"Wazirganj","hi":"वजिरगंज"}]},
 {"key":"Gorakhpur","hi":"गोरखपुर","blocks":[{"key":"Bansgaon","hi":"बांसगांव"},{"key":"Barhalganj","hi":"बड़हलगंज"},{"key":"Belghat","hi":"बेलघाट"},{"key":"Bharohiya","hi":"भरोहिया"},{"key":"Bhathat","hi":"भटहट"},{"key":"Brahmpur","hi":"ब्रह्मपुर"},{"key":"Campierganj","hi":"कैम्पियरगंज"},{"key":"Chargawan","hi":"चरगवन"},{"key":"Gagaha","hi":"गगहा"},{"key":"Gola","hi":"गोला"},{"key":"Jangal Kaudia","hi":"जंगल कौड़िया"},{"key":"Kauri Ram","hi":"कौरी राम"},{"key":"Khajni","hi":"खजनी"},{"key":"Khorabar","hi":"खोराबार"},{"key":"Pali","hi":"पाली"},{"key":"Pipraich","hi":"पिपराइच"},{"key":"Piprauli","hi":"पिपरौली"},{"key":"Sahjanawa","hi":"सहजनवा"},{"key":"Sardarnagar","hi":"सरदारनगर"},{"key":"Uruwa","hi":"उरुवा"}]},
 {"key":"Hamirpur","hi":"हमीरपुर","blocks":[{"key":"Gohand","hi":"गोहंद"},{"key":"Kurara","hi":"कुररा"},{"key":"Maudaha","hi":"मौदहा"},{"key":"Muskara","hi":"मुसकरा"},{"key":"Rath","hi":"रथ"},{"key":"Sarila","hi":"सरिला"},{"key":"Sumerpur","hi":"सुमेरपुर"}]},
 {"key":"Hapur","hi":"हापुड़","blocks":[{"key":"Dhaulana","hi":"धौलना"},{"key":"Garh Mukteshwar","hi":"गढ़ मुक्तेशवर"},{"key":"Hapur","hi":"हापुर"},{"key":"Simbhawali","hi":"सिंभवली"}]},
 {"key":"Hardoi","hi":"हरदोई","blocks":[{"key":"Ahirori","hi":"अहिरोरी"},{"key":"Bawan","hi":"बवन"},{"key":"Behendar","hi":"बेहेंदर"},{"key":"Bharawan","hi":"भरवन"},{"key":"Bharkhani","hi":"भरखनी"},{"key":"Bilgram","hi":"बिलगरम"},{"key":"Hariyawan","hi":"हरियवन"},{"key":"Harpalpur","hi":"हरपलपुर"},{"key":"Kachauna","hi":"कचौना"},{"key":"Kothawan","hi":"कोथवन"},{"key":"Madhoganj","hi":"मधोगंज"},{"key":"Mallawan","hi":"मल्लवन"},{"key":"Pihani","hi":"पिहनी"},{"key":"Sandi","hi":"संदी"},{"key":"Sandila","hi":"संदिला"},{"key":"Shahabad","hi":"शहआबाद"},{"key":"Sursa","hi":"सुरसा"},{"key":"Tandiyawan","hi":"तंदियवन"},{"key":"Todarpur","hi":"तोदरपुर"}]},
 {"key":"Hathras","hi":"हाथरस","blocks":[{"key":"Hasayan","hi":"हसयन"},{"key":"Hathras","hi":"हथरस"},{"key":"Mursan","hi":"मुरसन"},{"key":"Sadabad","hi":"सदआबाद"},{"key":"Sasni","hi":"ससनी"},{"key":"Sehpau","hi":"सेहपौ"},{"key":"Sikandrarao","hi":"सिकंदरराओ"}]},
 {"key":"Jalaun","hi":"जालौन","blocks":[{"key":"Dakore","hi":"दकोरे"},{"key":"Jalaun","hi":"जलौन"},{"key":"Kadaura","hi":"कदौरा"},{"key":"Konch","hi":"कोंच"},{"key":"Kuthaund","hi":"कुथौंद"},{"key":"Madhogarh","hi":"मधोगढ़"},{"key":"Maheva","hi":"महेवा"},{"key":"Nadigaon","hi":"नदीगांव"},{"key":"Rampura","hi":"रामपुरा"}]},
 {"key":"Jaunpur","hi":"जौनपुर","blocks":[{"key":"Badla Pur","hi":"बदला पुर"},{"key":"Baksha","hi":"बकशा"},{"key":"Barasathi","hi":"बरसथी"},{"key":"Dharma Pur","hi":"धरमा पुर"},{"key":"Dobhi","hi":"दोभी"},{"key":"Jalal Pur","hi":"जलल पुर"},{"key":"Karanja Kala","hi":"करंजा कला"},{"key":"Kerakat","hi":"केरकत"},{"key":"Khuthan","hi":"खुथन"},{"key":"Machchali Shahar","hi":"मच्चली शहर"},{"key":"Maharaj Ganj","hi":"महरज गंज"},{"key":"Mariyahu","hi":"मरियहू"},{"key":"Mufti Ganj","hi":"मुफती गंज"},{"key":"Mungra Badshah Pur","hi":"मुंगरा बदशह पुर"},{"key":"Ram Nagar","hi":"राम नगर"},{"key":"Ram Pur","hi":"राम पुर"},{"key":"Shah Ganj","hi":"शह गंज"},{"key":"Sikrara","hi":"सिकररा"},{"key":"Sirkoni","hi":"सिरकोनी"},{"key":"Suitha Kala","hi":"सुइथा कला"},{"key":"Sujan Ganj","hi":"सुजन गंज"}]},
 {"key":"Jhansi","hi":"झांसी","blocks":[{"key":"Babina","hi":"बबिना"},{"key":"Badagaon","hi":"बदागांव"},{"key":"Bamaur","hi":"बमौर"},{"key":"Bangra","hi":"बंगरा"},{"key":"Chirgaon","hi":"चिरगांव"},{"key":"Gursarai","hi":"गुरसराय"},{"key":"Mauranipur","hi":"मौरनीपुर"},{"key":"Moth","hi":"मोथ"}]},
 {"key":"Kannauj","hi":"कन्नौज","blocks":[{"key":"Chhibramau","hi":"छिबरमौ"},{"key":"Gughrapur","hi":"गुघरापुर"},{"key":"Haseran","hi":"हसेरन"},{"key":"Jalalabad","hi":"जललआबाद"},{"key":"Kannauj","hi":"कन्नौज"},{"key":"Saurikh","hi":"सौरिख"},{"key":"Talgram","hi":"तलगरम"},{"key":"Umarda","hi":"उमरदा"}]},
 {"key":"Kanpur Dehat","hi":"कानपुर देहात","blocks":[{"key":"Akbarpur","hi":"अकबरपुर"},{"key":"Amrodha","hi":"अंरोधा"},{"key":"Derapur","hi":"देरापुर"},{"key":"Jhinjhak","hi":"झिंझक"},{"key":"Maitha","hi":"मैथा"},{"key":"Malasa","hi":"मलसा"},{"key":"Rajpur","hi":"रजपुर"},{"key":"Rasulabad","hi":"रसुलआबाद"},{"key":"Sandalpur","hi":"संदलपुर"},{"key":"Sarbankhera","hi":"सरबनखेड़ा"}]},
 {"key":"Kanpur Nagar","hi":"कानपुर नगर","blocks":[{"key":"Bhitargaon","hi":"भितरगांव"},{"key":"Bilhaur","hi":"बिलहौर"},{"key":"Chaubeypur","hi":"चौबेयपुर"},{"key":"Ghatampur","hi":"घतमपुर"},{"key":"Kakwan","hi":"ककवन"},{"key":"Kalyanpur","hi":"कलयनपुर"},{"key":"Patara","hi":"पतरा"},{"key":"Sarsol","hi":"सरसोल"},{"key":"Shivrajpur","hi":"शिवरजपुर"},{"key":"Vidhunu","hi":"विधुनू"}]},
 {"key":"Kasganj","hi":"कासगंज","blocks":[{"key":"Amanpur","hi":"अमनपुर"},{"key":"Ganj Dundwara","hi":"गंज दुंदवरा"},{"key":"Kasganj","hi":"कसगंज"},{"key":"Patiyali","hi":"पतियली"},{"key":"Sahawar","hi":"सहवर"},{"key":"Sidhpura","hi":"सिधपुरा"},{"key":"Soron","hi":"सोरोन"}]},
 {"key":"Kaushambi","hi":"कौशांबी","blocks":[{"key":"Chail","hi":"चैल"},{"key":"Kara","hi":"करा"},{"key":"Kaushambi","hi":"कौशंबी"},{"key":"Manjhanpur","hi":"मंझनपुर"},{"key":"Mooratganj","hi":"मूरतगंज"},{"key":"Nevada","hi":"नेवदा"},{"key":"Sarsawan","hi":"सरसवन"},{"key":"Sirathu","hi":"सिरथू"}]},
 {"key":"Kushinagar","hi":"कुशीनगर","blocks":[{"key":"Dudhahi","hi":"दुधही"},{"key":"Fazilnagar","hi":"फाजिलनगर"},{"key":"Hata","hi":"हाटा"},{"key":"Kaptainganj","hi":"कप्तैनगंज"},{"key":"Kasaya","hi":"कसया (कुशीनगर)"},{"key":"Khadda","hi":"खड्डा"},{"key":"Kubernath","hi":"कुबेरनथ"},{"key":"Motichak","hi":"मोतीचक"},{"key":"Nebua Naurangia","hi":"नेबुआ नौरंगिया"},{"key":"Padrauna","hi":"पडरौना"},{"key":"Ramkola","hi":"रामकोला"},{"key":"Seorahi","hi":"सेवरही"},{"key":"Sukrauli","hi":"सुकरौली"},{"key":"Tamkuhiraj","hi":"तंकुहिरज"},{"key":"Vishunpura","hi":"विशुनपुरा"}]},
 {"key":"Lakhimpur Kheri","hi":"लखीमपुर खीरी","blocks":[{"key":"Bankeyganj","hi":"बंकेयगंज"},{"key":"Behjam","hi":"बेहजम"},{"key":"Bijuwa","hi":"बिजुवा"},{"key":"Dhaurhara","hi":"धौरहरा"},{"key":"Isanagar","hi":"इसानगर"},{"key":"Kumbhigola","hi":"कुंभिगोला"},{"key":"Lakhimpur","hi":"लखिमपुर"},{"key":"Mitauli","hi":"मितौली"},{"key":"Mohammadi","hi":"मोहम्मदी"},{"key":"Nakaha","hi":"नकहा"},{"key":"Nighasan","hi":"निघसन"},{"key":"Palia","hi":"पलिअ"},{"key":"Pasgawan","hi":"पसगवन"},{"key":"Phoolbehar","hi":"फूलबेहर"},{"key":"Ramia Behar","hi":"रमिअ बेहर"}]},
 {"key":"Lalitpur","hi":"ललितपुर","blocks":[{"key":"Bar","hi":"बर"},{"key":"Birdha","hi":"बिरधा"},{"key":"Jakhaura","hi":"जखौरा"},{"key":"Mandawara","hi":"मंदवरा"},{"key":"Mehroni","hi":"मेहरोनी"},{"key":"Talbehat","hi":"तलबेहत"}]},
 {"key":"Lucknow","hi":"लखनऊ","blocks":[{"key":"Bakshi-ka-talab","hi":"बकशी-का-तलब"},{"key":"Chinhat","hi":"चिंहत"},{"key":"Gosaiganj","hi":"गोसैगंज"},{"key":"Kakori","hi":"ककोरी"},{"key":"Mal","hi":"मल"},{"key":"Malihabad","hi":"मलिहआबाद"},{"key":"Mohanlalganj","hi":"मोहंललगंज"},{"key":"Sarojaninagar","hi":"सरोजनीनगर"}]},
 {"key":"Maharajganj","hi":"महराजगंज","blocks":[{"key":"Bridgemanganj","hi":"ब्रिदगेमनगंज"},{"key":"Dhani","hi":"धानी"},{"key":"Ghughli","hi":"घुघली"},{"key":"Lakshmipur","hi":"लकशमीपुर"},{"key":"Mahrajganj","hi":"महरजगंज"},{"key":"Mithaura","hi":"मिठौरा"},{"key":"Nautanwa","hi":"नौतंवा"},{"key":"Nichlaul","hi":"निचलौल"},{"key":"Paniyara","hi":"पनियरा"},{"key":"Partawal","hi":"परतावल"},{"key":"Pharenda","hi":"फरेंदा"},{"key":"Siswa","hi":"सिसवा"}]},
 {"key":"Mahoba","hi":"महोबा","blocks":[{"key":"Charkhari","hi":"चरखरी"},{"key":"Jaitpur","hi":"जैतपुर"},{"key":"Kabrai","hi":"कबरै"},{"key":"Panwari","hi":"पंवरी"}]},
 {"key":"Mainpuri","hi":"मैनपुरी","blocks":[{"key":"Barnahal","hi":"बरनहल"},{"key":"Bewar","hi":"बेवर"},{"key":"Ghiror","hi":"घिरोर"},{"key":"Jageer","hi":"जगीर"},{"key":"Karhal","hi":"करहल"},{"key":"Kishni","hi":"किशनी"},{"key":"Kuraoli","hi":"कुराओली"},{"key":"Mainpuri","hi":"मैनपुरी"},{"key":"Sultanganj","hi":"सुलतनगंज"}]},
 {"key":"Mathura","hi":"मथुरा","blocks":[{"key":"Baldeo","hi":"बलदेओ"},{"key":"Chaumuha","hi":"चौमुहा"},{"key":"Chhata","hi":"छता"},{"key":"Farah","hi":"फरह"},{"key":"Govardhan","hi":"गोवरधन"},{"key":"Mat","hi":"मत"},{"key":"Mathura","hi":"मथुरा"},{"key":"Nandgaon","hi":"नंदगांव"},{"key":"Nohjhil","hi":"नोहझिल"},{"key":"Raya","hi":"रया"}]},
 {"key":"Mau","hi":"मऊ","blocks":[{"key":"Badraon","hi":"बड़राव"},{"key":"Dohri Ghat","hi":"दोहरीघाट"},{"key":"Fatehpur Madaun","hi":"फतेहपुर मंडाव"},{"key":"Ghosi","hi":"घोसी"},{"key":"Kopaganj","hi":"कोपागंज"},{"key":"Mohammadabad Gohana","hi":"मोहम्मदाबाद गोहना"},{"key":"Pardaha","hi":"परदहा"},{"key":"Ranipur","hi":"रानीपुर"},{"key":"Ratanpura","hi":"रतनपुरा"}]},
 {"key":"Meerut","hi":"मेरठ","blocks":[{"key":"Daurala","hi":"दौरला"},{"key":"Hastinapur","hi":"हस्तिनापुर"},{"key":"Janikhurd","hi":"जनीखुर्द"},{"key":"Kharkhoda","hi":"खरखोदा"},{"key":"Machra","hi":"मचरा"},{"key":"Mawana Kalan","hi":"मवना कलां"},{"key":"Meerut","hi":"मीरुत"},{"key":"Parikshitgarh","hi":"परिकशितगढ़"},{"key":"Rajpura","hi":"रजपुरा"},{"key":"Rohta","hi":"रोहता"},{"key":"Sardhana","hi":"सरधना"},{"key":"Sarurpur Khurd","hi":"सरुरपुर खुर्द"}]},
 {"key":"Mirzapur","hi":"मिर्ज़ापुर","blocks":[{"key":"Chhanvey","hi":"छंवेय"},{"key":"Hallia","hi":"हल्लिअ"},{"key":"Jamalpur","hi":"जमलपुर"},{"key":"Kon","hi":"कोन"},{"key":"Lalganj","hi":"ललगंज"},{"key":"Majhawa","hi":"मझवा"},{"key":"Nagar (city)","hi":"नगर कितय"},{"key":"Narainpur","hi":"नरैनपुर"},{"key":"Pahari","hi":"पहरी"},{"key":"Patehra","hi":"पतेहरा"},{"key":"Rajgarh","hi":"रजगढ़"},{"key":"Shikhar","hi":"शिखर"}]},
 {"key":"Moradabad","hi":"मुरादाबाद","blocks":[{"key":"Bhagatpur Tanda","hi":"भगतपुर टांडा"},{"key":"Bilari","hi":"बिलरी"},{"key":"Chhajlet","hi":"छजलेत"},{"key":"Dilari","hi":"दिलरी"},{"key":"Kundarki","hi":"कुंदरकी"},{"key":"Moradabad","hi":"मोरदआबाद"},{"key":"Munda Pandey","hi":"मुंदा पंदेय"},{"key":"Thakurdwara","hi":"थकुरदवरा"}]},
 {"key":"Muzaffarnagar","hi":"मुज़फ्फरनगर","blocks":[{"key":"Baghara","hi":"बघरा"},{"key":"Budhana","hi":"बुधना"},{"key":"Charthawal","hi":"चरथवल"},{"key":"Jansath","hi":"जंसथ"},{"key":"Khatauli","hi":"खतौली"},{"key":"Morna","hi":"मोरना"},{"key":"Muzaffarnagar","hi":"मुजफ्फरनगर"},{"key":"Purkaji","hi":"पुरकजी"},{"key":"Shahpur","hi":"शहपुर"}]},
 {"key":"Pilibhit","hi":"पीलीभीत","blocks":[{"key":"Amariya","hi":"अमरिया"},{"key":"Barkhera","hi":"बरखेड़ा"},{"key":"Bilsanda","hi":"बिलसंदा"},{"key":"Bisalpur","hi":"बिसलपुर"},{"key":"Lalaurikhera","hi":"ललौरीखेड़ा"},{"key":"Marori","hi":"मरोरी"},{"key":"Puranpur","hi":"पुरनपुर"}]},
 {"key":"Pratapgarh","hi":"प्रतापगढ़","blocks":[{"key":"Aspur Deosara","hi":"असपुर देओसरा"},{"key":"Baba Belkharnath Dham","hi":"बाबा बेलखरनाथ धाम"},{"key":"Babaganj","hi":"बबागंज"},{"key":"Bihar","hi":"बिहर"},{"key":"Gaura","hi":"गौरा"},{"key":"Kalakankar","hi":"कलकंकर"},{"key":"Kunda","hi":"कुंदा"},{"key":"Lakshamanpur","hi":"लकशमनपुर"},{"key":"Lalganj","hi":"ललगंज"},{"key":"Magraura","hi":"मगरौरा"},{"key":"Mandhata","hi":"मंधता"},{"key":"Patti","hi":"पत्ती"},{"key":"Pratapgarh (sadar)","hi":"प्रतपगढ़ सदर"},{"key":"Rampur Sanramgarh","hi":"रमपुर संरमगढ़"},{"key":"Sandwa Chandrika","hi":"संदवा चंदरिका"},{"key":"Sangipur","hi":"संगीपुर"},{"key":"Shivgarh","hi":"शिवगढ़"}]},
 {"key":"Prayagraj","hi":"प्रयागराज","blocks":[{"key":"Bahadurpur","hi":"बहदुरपुर"},{"key":"Bahria","hi":"बहरिअ"},{"key":"Bhagwatpur","hi":"भगवतपुर"},{"key":"Chaka","hi":"चका"},{"key":"Dhanupur","hi":"धनूपुर"},{"key":"Handia","hi":"हंदिअ"},{"key":"Holagarh","hi":"होलागढ़"},{"key":"Jasra","hi":"जसरा"},{"key":"Karchhana","hi":"करछना"},{"key":"Kaudhiyara","hi":"कौधियरा"},{"key":"Kaurihar","hi":"कौरिहर"},{"key":"Koraon","hi":"कोराओन"},{"key":"Manda","hi":"मंदा"},{"key":"Mauaima","hi":"मौऐमा"},{"key":"Meja","hi":"मेजा"},{"key":"Phulpur","hi":"फुलपुर"},{"key":"Pratappur","hi":"प्रतपपुर"},{"key":"Sahson","hi":"सहसोन"},{"key":"Saidabad","hi":"सैदआबाद"},{"key":"Shankargarh","hi":"शंकरगढ़"},{"key":"Soraon","hi":"सोराओन"},{"key":"Sringverpur Dham","hi":"स्रिंगवेरपुर धाम"},{"key":"Uruwan","hi":"उरुवन"}]},
 {"key":"Raebareli","hi":"रायबरेली","blocks":[{"key":"Amawan","hi":"अमवन"},{"key":"Bachharawan","hi":"बछरवन"},{"key":"Chhatoh","hi":"छतोह"},{"key":"Dalmau","hi":"दलमौ"},{"key":"Deenshah Gaura","hi":"दींशह गौरा"},{"key":"Dih","hi":"दिह"},{"key":"Harchandpur","hi":"हरचंदपुर"},{"key":"Jagatpur","hi":"जगतपुर"},{"key":"Khiron","hi":"खिरोन"},{"key":"Lalganj","hi":"ललगंज"},{"key":"Mahrajganj","hi":"महरजगंज"},{"key":"Rahi","hi":"रही"},{"key":"Rohania","hi":"रोहनिअ"},{"key":"Salon","hi":"सलोन"},{"key":"Sareni","hi":"सरेनी"},{"key":"Sataon","hi":"सताओन"},{"key":"Shivgarh","hi":"शिवगढ़"},{"key":"Unchahar","hi":"उंचहर"}]},
 {"key":"Rampur","hi":"रामपुर","blocks":[{"key":"Bilaspur","hi":"बिलसपुर"},{"key":"Chamraon","hi":"चंराओन"},{"key":"Milak","hi":"मिलक"},{"key":"Saidnagar","hi":"सैदनगर"},{"key":"Shahabad","hi":"शहआबाद"},{"key":"Suar","hi":"सुअर"}]},
 {"key":"Saharanpur","hi":"सहारनपुर","blocks":[{"key":"Ballia Kheri","hi":"बल्लिअ खेरी"},{"key":"Deoband","hi":"देओबंद"},{"key":"Gangoh","hi":"गंगोह"},{"key":"Muzaffarabad","hi":"मुजफ्फरआबाद"},{"key":"Nagal","hi":"नगल"},{"key":"Nakur","hi":"नकुर"},{"key":"Nanauta","hi":"ननौता"},{"key":"Puwarka","hi":"पुवरका"},{"key":"Rampur Maniharan","hi":"रमपुर मनिहरन"},{"key":"Sadauli Qadeem","hi":"सदौली कदीम"},{"key":"Sarsawan","hi":"सरसवन"}]},
 {"key":"Sambhal","hi":"संभल","blocks":[{"key":"Asmauli","hi":"असमौली"},{"key":"Bahjoi","hi":"बहजॉय"},{"key":"Baniyakhera","hi":"बनियाखेड़ा"},{"key":"Gunnaur","hi":"गुन्नौर"},{"key":"Junawai","hi":"जुनवै"},{"key":"Panwasa","hi":"पंवसा"},{"key":"Rajpura","hi":"रजपुरा"},{"key":"Sambhal","hi":"संभल"}]},
 {"key":"Sant Kabir Nagar","hi":"संत कबीर नगर","blocks":[{"key":"Baghauli","hi":"बघौली"},{"key":"Belhar Kala","hi":"बेलहर कलां"},{"key":"Hainsar Bazar","hi":"हैंसर बाजार"},{"key":"Khalilabad","hi":"खलीलाबाद"},{"key":"Mehdawal","hi":"मेहदावल"},{"key":"Nath Nagar","hi":"नाथ नगर"},{"key":"Pauli","hi":"पौली"},{"key":"Santha","hi":"सांथा"},{"key":"Semariyawan","hi":"सेमरियावां"}]},
 {"key":"Shahjahanpur","hi":"शाहजहांपुर","blocks":[{"key":"Banda","hi":"बंदा"},{"key":"Bhawal Khera","hi":"भवल खेड़ा"},{"key":"Dadrol","hi":"ददरोल"},{"key":"Jaitipur","hi":"जैतीपुर"},{"key":"Jalalabad","hi":"जललआबाद"},{"key":"Kalan","hi":"कलां"},{"key":"Kanth","hi":"कंथ"},{"key":"Khudaganj Katra","hi":"खुदागंज कतरा"},{"key":"Khutar","hi":"खुतर"},{"key":"Madnapur","hi":"मदनापुर"},{"key":"Mirzapur","hi":"मिरजापुर"},{"key":"Nigohi","hi":"निगोही"},{"key":"Powayan","hi":"पोवयन"},{"key":"Sindhauli","hi":"सिंधौली"},{"key":"Tilhar","hi":"तिलहर"}]},
 {"key":"Shamli","hi":"शामली","blocks":[{"key":"Kairana","hi":"कैरना"},{"key":"Kandhla","hi":"कंधला"},{"key":"Shamli","hi":"शंली"},{"key":"Thana Bhawan","hi":"थना भवन"},{"key":"Un","hi":"उन"}]},
 {"key":"Shravasti","hi":"श्रावस्ती","blocks":[{"key":"Ekona","hi":"एकोना"},{"key":"Gilaula","hi":"गिलौला"},{"key":"Hariharpur Rani","hi":"हरिहरपुर रनी"},{"key":"Jamunaha","hi":"जमुनहा"},{"key":"Sirsiya","hi":"सिरसिया"}]},
 {"key":"Siddharth Nagar","hi":"सिद्धार्थनगर","blocks":[{"key":"Bansi","hi":"बंसी"},{"key":"Barhni","hi":"बरहनी"},{"key":"Bhanwapur","hi":"भंवापुर"},{"key":"Birdpur","hi":"बिरदपुर"},{"key":"Domariyaganj","hi":"दोमरियागंज"},{"key":"Itwa","hi":"इतवा"},{"key":"Jogia","hi":"जोगिअ"},{"key":"Khesraha","hi":"खेसरहा"},{"key":"Khuniyaon","hi":"खुनियाओन"},{"key":"Lotan","hi":"लोतन"},{"key":"Mithwal","hi":"मिथवल"},{"key":"Naugarh","hi":"नौगढ़"},{"key":"Shoharatgarh","hi":"शोहरतगढ़"},{"key":"Uska Bazar","hi":"उसका बाज़ार"}]},
 {"key":"Sitapur","hi":"सीतापुर","blocks":[{"key":"Ailiya","hi":"ऐलिया"},{"key":"Behta","hi":"बेहता"},{"key":"Biswan","hi":"बिसवन"},{"key":"Gondlamau","hi":"गोंदलमौ"},{"key":"Hargaon","hi":"हरगांव"},{"key":"Kasmanda","hi":"कसमंदा"},{"key":"Khairabad","hi":"खैरआबाद"},{"key":"Laharpur","hi":"लहरपुर"},{"key":"Machhrehta","hi":"मछरेहता"},{"key":"Mahmudabad","hi":"महमुदआबाद"},{"key":"Maholi","hi":"महोली"},{"key":"Misrikh","hi":"मिसरिख"},{"key":"Pahala","hi":"पहला"},{"key":"Parsendi","hi":"परसेंदी"},{"key":"Pisawan","hi":"पिसवन"},{"key":"Rampur Mathura","hi":"रमपुर मथुरा"},{"key":"Reusa","hi":"रेउसा"},{"key":"Sakran","hi":"सकरन"},{"key":"Sidhauli","hi":"सिधौली"}]},
 {"key":"Sonbhadra","hi":"सोनभद्र","blocks":[{"key":"Babhani","hi":"बभनी"},{"key":"Chatra","hi":"चतरा"},{"key":"Chopan","hi":"चोपन"},{"key":"Dudhi","hi":"दुधी"},{"key":"Ghorawal","hi":"घोरवल"},{"key":"Karma","hi":"करमा"},{"key":"Kone","hi":"कोने"},{"key":"Myorpur","hi":"म्योरपुर"},{"key":"Nagwa","hi":"नगवा"},{"key":"Robertsganj","hi":"रोबेरतसगंज"}]},
 {"key":"Sultanpur","hi":"सुल्तानपुर","blocks":[{"key":"Akhand Nagar","hi":"अखंद नगर"},{"key":"Baldirai","hi":"बलदिरै"},{"key":"Bhadaiya","hi":"भदैया"},{"key":"Dhanpatganj","hi":"धानपतगंज"},{"key":"Dostpur","hi":"दोस्तपुर"},{"key":"Dubepur","hi":"दुबेपुर"},{"key":"Jaisinghpur","hi":"जैसिंघपुर"},{"key":"Kadipur","hi":"कदीपुर"},{"key":"Karaudikala","hi":"करौदिकला"},{"key":"Kurebhar","hi":"कुरेभर"},{"key":"Kurwar","hi":"कुरवर"},{"key":"Lambhua","hi":"लंभुअ"},{"key":"Motigarpur","hi":"मोतिगरपुर"},{"key":"P.p.kamaicha","hi":"प प कमैचा"}]},
 {"key":"Unnao","hi":"उन्नाव","blocks":[{"key":"Asoha","hi":"असोहा"},{"key":"Auras","hi":"औरस"},{"key":"Bangarmau","hi":"बंगरमौ"},{"key":"Bichhiya","hi":"बिछिया"},{"key":"Bighapur","hi":"बिघापुर"},{"key":"Fatehpur Chaurasi","hi":"फतेहपुर चौरसी"},{"key":"Ganj Moradabad","hi":"गंज मोरदआबाद"},{"key":"Hasanganj","hi":"हसनगंज"},{"key":"Hilauli","hi":"हिलौली"},{"key":"Mianganj","hi":"मिअनगंज"},{"key":"Nawabganj","hi":"नवबगंज"},{"key":"Purwa","hi":"पुरवा"},{"key":"Safipur","hi":"सफीपुर"},{"key":"Sikandarpur Karan","hi":"सिकंदरपुर करन"},{"key":"Sikandarpur Sarausi","hi":"सिकंदरपुर सरौसी"},{"key":"Sumerpur","hi":"सुमेरपुर"}]},
 {"key":"Varanasi","hi":"वाराणसी","blocks":[{"key":"Arajiline","hi":"अरजिलिने"},{"key":"Baragaon","hi":"बरागांव"},{"key":"Chiraigaon","hi":"चिरैगांव"},{"key":"Cholapur","hi":"चोलापुर"},{"key":"Harahua","hi":"हरहुअ"},{"key":"Kashi Vidyapeeth","hi":"कशी विदयपीथ"},{"key":"Pindra","hi":"पिंदरा"},{"key":"Sevapuri","hi":"सेवपुरी"}]}
];

function districtHi(key){ const d = DISTRICTS.find(x => x.key === key); return d ? d.hi : hiPlace(key); }
function blockHi(districtKey, blockKey){
  const d = DISTRICTS.find(x => x.key === districtKey);
  const b = d && d.blocks.find(x => x.key === blockKey);
  return b ? b.hi : hiPlace(blockKey);
}
// "ब्लॉक, जिला" jaisa Hindi text (purane users ke liye jinke paas block nahi hai, sirf jila/tehsil dikhta hai)
function placeLabelHi(districtKey, blockKey){
  if(!districtKey && !blockKey) return '—';
  const dist = districtKey ? districtHi(districtKey) : '';
  return blockKey ? blockHi(districtKey, blockKey) + (dist ? ', ' + dist : '') : dist;
}
function fillDistrictSelect(sel, selected){
  sel.innerHTML = '<option value="">जिला चुनें</option>' +
    DISTRICTS.map(d => `<option value="${d.key}">${d.hi}</option>`).join('');
  if(selected) sel.value = selected;
}
function fillBlockSelect(blockSel, districtKey, selected){
  const d = DISTRICTS.find(x => x.key === districtKey);
  if(!d){
    blockSel.innerHTML = '<option value="">पहले जिला चुनें</option>';
    blockSel.disabled = true;
    return;
  }
  blockSel.innerHTML = '<option value="">ब्लॉक चुनें</option>' +
    d.blocks.map(b => `<option value="${b.key}">${b.hi} (${b.key})</option>`).join('');
  blockSel.disabled = false;
  if(selected) blockSel.value = selected;
}
// Do dropdown jodta hai: jila badalne par block ki list badal jati hai
function setupDistrictBlock(districtSel, blockSel, selDistrict, selBlock){
  fillDistrictSelect(districtSel, selDistrict);
  fillBlockSelect(blockSel, districtSel.value, selBlock);
  districtSel.onchange = () => fillBlockSelect(blockSel, districtSel.value);
}

const { findRecommendation } = require('../models/CropLookup');

function recommendCrops(req, res) {
  const { season, soil, region } = req.query;
  if (!season || !soil) {
    return res.status(400).json({ message: 'season and soil query parameters are required' });
  }
  const selectedRegion = region || 'Gorakhpur';
  findRecommendation(selectedRegion, season.toLowerCase(), soil.toLowerCase(), (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching recommendation' });
    if (!row) return res.status(404).json({ message: 'No recommendation found for this combination' });
    res.json({
      region: row.region,
      season: row.season,
      soilType: row.soil_type,
      recommendedCrops: row.recommended_crops.split(',')
    });
  });
}

// Static reference data — general agronomic guidance per crop (Hindi mein, kisan ke liye).
// Note: exact figures vary by variety, region, and season; this is
// general guidance, not a substitute for local Krishi Vigyan Kendra advice.
const cropDetailsData = {
  "Gehu": {"seedRate": "40-50 किग्रा/एकड़", "sowingTime": "मध्य नवंबर से मध्य दिसंबर", "weedingTime": "पहली निराई 25-30 दिन पर, ज़रूरत हो तो दूसरी 45-50 दिन पर", "problems": ["रतुआ (फफूंद रोग)", "माहू (एफिड)", "कंडुआ रोग (लूज़ स्मट)"], "harvestTime": "बुवाई के 110-120 दिन बाद (मार्च-अप्रैल)"},
  "Dhan": {"seedRate": "नर्सरी के लिए 8-10 किग्रा/एकड़, सीधी बुवाई में 20-25 किग्रा", "sowingTime": "नर्सरी जून में, रोपाई जुलाई में", "weedingTime": "2-3 बार निराई; पहली रोपाई के 15-20 दिन बाद", "problems": ["झोंका रोग (ब्लास्ट)", "तना छेदक", "भूरा फुदका"], "harvestTime": "किस्म के अनुसार 120-150 दिन"},
  "Makka": {"seedRate": "8-10 किग्रा/एकड़", "sowingTime": "जून-जुलाई (खरीफ) या अक्टूबर-नवंबर (रबी)", "weedingTime": "पहली निराई 20-25 दिन पर, दूसरी 40 दिन पर", "problems": ["तना छेदक", "फॉल आर्मीवर्म (सैनिक कीट)", "पत्ती झुलसा"], "harvestTime": "90-110 दिन"},
  "Ganna": {"seedRate": "25-30 क्विंटल टुकड़े (सेट)/एकड़ (3 आंख वाले टुकड़े)", "sowingTime": "फरवरी-मार्च (बसंत) या अक्टूबर (शरद)", "weedingTime": "30 से 90 दिन के बीच 2-3 बार निराई-गुड़ाई", "problems": ["लाल सड़न (रेड रॉट)", "तना छेदक कीट", "दीमक"], "harvestTime": "10-12 महीने"},
  "Chana": {"seedRate": "35-40 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "30-35 दिन पर एक निराई", "problems": ["उकठा रोग (विल्ट)", "फली छेदक"], "harvestTime": "90-120 दिन"},
  "Arhar": {"seedRate": "6-8 किग्रा/एकड़", "sowingTime": "जून-जुलाई", "weedingTime": "पहली 20-25 दिन पर, दूसरी 45 दिन पर", "problems": ["फली छेदक", "उकठा रोग (विल्ट)"], "harvestTime": "150-180 दिन"},
  "Sarso": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "15-20 दिन पर निराई के साथ पौधों की छंटाई", "problems": ["माहू (एफिड)", "सफ़ेद रतुआ"], "harvestTime": "110-140 दिन"},
  "Matar": {"seedRate": "30-35 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "25-30 दिन पर एक निराई", "problems": ["चूर्णिल आसिता (पाउडरी मिल्ड्यू)", "फली छेदक"], "harvestTime": "70-90 दिन"},
  "Moong": {"seedRate": "8-10 किग्रा/एकड़", "sowingTime": "मार्च-अप्रैल (ज़ायद) या जुलाई (खरीफ)", "weedingTime": "20-25 दिन पर एक निराई", "problems": ["पीला मोज़ेक वायरस", "सफ़ेद मक्खी"], "harvestTime": "60-70 दिन"},
  "Urad": {"seedRate": "8-10 किग्रा/एकड़", "sowingTime": "जून-जुलाई", "weedingTime": "20-25 दिन पर एक निराई", "problems": ["पीला मोज़ेक वायरस", "सफ़ेद मक्खी"], "harvestTime": "70-90 दिन"},
  "Soybean": {"seedRate": "25-30 किग्रा/एकड़", "sowingTime": "जून-जुलाई", "weedingTime": "पहली 20-25 दिन पर, दूसरी 40 दिन पर", "problems": ["गर्डल बीटल (तना मक्खी)", "रतुआ"], "harvestTime": "95-110 दिन"},
  "Til": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "जून-जुलाई", "weedingTime": "20-25 दिन पर एक निराई", "problems": ["फिलोडी रोग", "पत्ती लपेटक कीट"], "harvestTime": "85-95 दिन"},
  "Jute": {"seedRate": "2-2.5 किग्रा/एकड़", "sowingTime": "मार्च-अप्रैल", "weedingTime": "पहली 20-25 दिन पर, पौधों की छंटाई भी ज़रूरी", "problems": ["तना घुन", "सेमीलूपर (अर्ध-कुंडलक इल्ली)"], "harvestTime": "रेशे के लिए 120-150 दिन"},
  "Bajra": {"seedRate": "3-4 किग्रा/एकड़", "sowingTime": "जून-जुलाई", "weedingTime": "पहली 20 दिन पर, दूसरी 35 दिन पर", "problems": ["मृदुरोमिल आसिता (डाउनी मिल्ड्यू)", "तना छेदक"], "harvestTime": "75-90 दिन"},
  "Jau": {"seedRate": "35-40 किग्रा/एकड़", "sowingTime": "नवंबर", "weedingTime": "30-35 दिन पर एक निराई", "problems": ["रतुआ", "माहू (एफिड)"], "harvestTime": "120-135 दिन"},
  "Masoor": {"seedRate": "12-15 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "30 दिन पर एक निराई", "problems": ["उकठा रोग (विल्ट)", "माहू (एफिड)"], "harvestTime": "110-130 दिन"},
  "Alsi": {"seedRate": "6-8 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "25-30 दिन पर एक निराई", "problems": ["रतुआ", "माहू (एफिड)"], "harvestTime": "120-140 दिन"},
  "Bhindi": {"seedRate": "3-4 किग्रा/एकड़", "sowingTime": "फरवरी-मार्च और जून-जुलाई", "weedingTime": "पहली 15-20 दिन पर, उसके बाद खेत खरपतवार-मुक्त रखें", "problems": ["पीली शिरा मोज़ेक वायरस", "फल छेदक", "माहू (एफिड)"], "harvestTime": "45-50 दिन में तुड़ाई शुरू, कई हफ्तों तक चलती है"},
  "Baingan": {"seedRate": "150-200 ग्राम/एकड़ (नर्सरी में तैयार पौध)", "sowingTime": "नर्सरी जून-जुलाई या नवंबर-दिसंबर में", "weedingTime": "रोपाई के 20 दिन बाद पहली, फिर हर 3-4 हफ्ते पर", "problems": ["फल एवं तना छेदक", "जीवाणु मुरझा रोग (बैक्टीरियल विल्ट)"], "harvestTime": "रोपाई के 70-80 दिन बाद"},
  "Lauki": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "फरवरी-मार्च और जून-जुलाई", "weedingTime": "पहले 30 दिन खेत खरपतवार-मुक्त रखें", "problems": ["फल मक्खी", "चूर्णिल आसिता (पाउडरी मिल्ड्यू)"], "harvestTime": "55-65 दिन"},
  "Tori": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "फरवरी-मार्च और जून-जुलाई", "weedingTime": "पहले 30 दिन खेत खरपतवार-मुक्त रखें", "problems": ["फल मक्खी", "चूर्णिल आसिता (पाउडरी मिल्ड्यू)"], "harvestTime": "55-65 दिन"},
  "Karela": {"seedRate": "2-2.5 किग्रा/एकड़", "sowingTime": "फरवरी-मार्च और जून-जुलाई", "weedingTime": "पहले 30 दिन बहुत ज़रूरी हैं", "problems": ["फल मक्खी", "चूर्णिल आसिता (पाउडरी मिल्ड्यू)"], "harvestTime": "55-60 दिन"},
  "Palak": {"seedRate": "8-10 किग्रा/एकड़", "sowingTime": "पूरे साल, सबसे अच्छा अक्टूबर-फरवरी", "weedingTime": "हर कटाई के बाद हल्की निराई", "problems": ["पत्ती धब्बा रोग", "माहू (एफिड)"], "harvestTime": "पहली कटाई 25-30 दिन पर, फिर हर 15-20 दिन पर"},
  "Methi": {"seedRate": "10-12 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "20 दिन पर एक निराई", "problems": ["चूर्णिल आसिता (पाउडरी मिल्ड्यू)", "माहू (एफिड)"], "harvestTime": "पत्तियों के लिए 25-30 दिन, बीज के लिए 90-100 दिन"},
  "Dhaniya": {"seedRate": "8-10 किग्रा/एकड़", "sowingTime": "अक्टूबर-नवंबर", "weedingTime": "25-30 दिन पर एक निराई", "problems": ["चूर्णिल आसिता (पाउडरी मिल्ड्यू)", "माहू (एफिड)"], "harvestTime": "पत्तियों के लिए 30-40 दिन, बीज के लिए 100-120 दिन"},
  "Gobi (Phool)": {"seedRate": "300-400 ग्राम/एकड़ (नर्सरी में तैयार पौध)", "sowingTime": "नर्सरी सितंबर-अक्टूबर में", "weedingTime": "रोपाई के 20-25 दिन बाद पहली निराई", "problems": ["काला सड़न रोग (ब्लैक रॉट)", "माहू (एफिड)", "गोभी की इल्ली"], "harvestTime": "रोपाई के 70-90 दिन बाद"},
  "Patta Gobi": {"seedRate": "300-400 ग्राम/एकड़ (नर्सरी में तैयार पौध)", "sowingTime": "नर्सरी सितंबर-अक्टूबर में", "weedingTime": "रोपाई के 20-25 दिन बाद पहली निराई", "problems": ["काला सड़न रोग (ब्लैक रॉट)", "माहू (एफिड)", "गोभी की इल्ली"], "harvestTime": "रोपाई के 70-90 दिन बाद"},
  "Gajar": {"seedRate": "3-4 किग्रा/एकड़", "sowingTime": "सितंबर-अक्टूबर", "weedingTime": "पहली 25-30 दिन पर (पौधों की छंटाई भी ज़रूरी)", "problems": ["पत्ती झुलसा", "माहू (एफिड)"], "harvestTime": "90-110 दिन"},
  "Mooli": {"seedRate": "4-5 किग्रा/एकड़", "sowingTime": "पूरे साल, सबसे अच्छा अक्टूबर-नवंबर", "weedingTime": "15-20 दिन पर एक हल्की निराई", "problems": ["माहू (एफिड)", "पिस्सू भृंग (फ्ली बीटल)"], "harvestTime": "40-60 दिन"},
  "Kheera": {"seedRate": "1-1.5 किग्रा/एकड़", "sowingTime": "फरवरी-मार्च और जून-जुलाई", "weedingTime": "पहले 30 दिन खेत खरपतवार-मुक्त रखें", "problems": ["फल मक्खी", "मृदुरोमिल आसिता (डाउनी मिल्ड्यू)"], "harvestTime": "50-60 दिन"},
  "Tarbuz": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "जनवरी-फरवरी", "weedingTime": "पहले 30-40 दिन बहुत ज़रूरी हैं", "problems": ["फल मक्खी", "फ्यूज़ेरियम उकठा रोग"], "harvestTime": "80-90 दिन"},
  "Kharbuja": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "जनवरी-फरवरी", "weedingTime": "पहले 30-40 दिन बहुत ज़रूरी हैं", "problems": ["फल मक्खी", "फ्यूज़ेरियम उकठा रोग"], "harvestTime": "80-90 दिन"},
  "Kaddu": {"seedRate": "1.5-2 किग्रा/एकड़", "sowingTime": "फरवरी-मार्च और जून-जुलाई", "weedingTime": "पहले 30 दिन बहुत ज़रूरी हैं", "problems": ["फल मक्खी", "चूर्णिल आसिता (पाउडरी मिल्ड्यू)"], "harvestTime": "90-110 दिन"}
};

function getCropDetails(req, res) {
  const name = req.query.name;
  if (!name) return res.status(400).json({ message: 'name query parameter is required' });

  const details = cropDetailsData[name];
  if (!details) {
    return res.status(404).json({ message: 'Detailed info not available yet for this crop' });
  }
  res.json({ cropName: name, ...details });
}

module.exports = { recommendCrops, getCropDetails };
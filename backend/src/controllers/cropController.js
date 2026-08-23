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

// Static reference data — general agronomic guidance per crop.
// Note: exact figures vary by variety, region, and season; this is
// general guidance, not a substitute for local Krishi Vigyan Kendra advice.
const cropDetailsData = {
  "Gehu": { seedRate: "40-50 kg/acre", sowingTime: "Mid Nov - Mid Dec", weedingTime: "First weeding at 25-30 days, second at 45-50 days if needed", problems: ["Rust (fungal disease)", "Aphids", "Loose smut"], harvestTime: "110-120 days after sowing (March-April)" },
  "Dhan": { seedRate: "8-10 kg/acre (nursery), 20-25 kg for direct sowing", sowingTime: "Nursery in June, transplant in July", weedingTime: "2-3 weedings; first at 15-20 days after transplanting", problems: ["Blast disease", "Stem borer", "Brown plant hopper"], harvestTime: "120-150 days depending on variety" },
  "Makka": { seedRate: "8-10 kg/acre", sowingTime: "June-July (Kharif) or Oct-Nov (Rabi)", weedingTime: "First weeding at 20-25 days, second at 40 days", problems: ["Stem borer", "Fall armyworm", "Leaf blight"], harvestTime: "90-110 days" },
  "Ganna": { seedRate: "25-30 quintal setts/acre (3-bud cuttings)", sowingTime: "Feb-March (spring) or October (autumn)", weedingTime: "2-3 weedings/hoeings between 30-90 days", problems: ["Red rot", "Stem borers", "Termite"], harvestTime: "10-12 months" },
  "Chana": { seedRate: "35-40 kg/acre", sowingTime: "October-November", weedingTime: "One weeding at 30-35 days", problems: ["Wilt disease", "Pod borer"], harvestTime: "90-120 days" },
  "Arhar": { seedRate: "6-8 kg/acre", sowingTime: "June-July", weedingTime: "First at 20-25 days, second at 45 days", problems: ["Pod borer", "Wilt disease"], harvestTime: "150-180 days" },
  "Sarso": { seedRate: "1.5-2 kg/acre", sowingTime: "October-November", weedingTime: "One weeding-cum-thinning at 15-20 days", problems: ["Aphids", "White rust"], harvestTime: "110-140 days" },
  "Matar": { seedRate: "30-35 kg/acre", sowingTime: "October-November", weedingTime: "One weeding at 25-30 days", problems: ["Powdery mildew", "Pod borer"], harvestTime: "70-90 days" },
  "Moong": { seedRate: "8-10 kg/acre", sowingTime: "March-April (Zaid) or July (Kharif)", weedingTime: "One weeding at 20-25 days", problems: ["Yellow mosaic virus", "Whitefly"], harvestTime: "60-70 days" },
  "Urad": { seedRate: "8-10 kg/acre", sowingTime: "June-July", weedingTime: "One weeding at 20-25 days", problems: ["Yellow mosaic virus", "Whitefly"], harvestTime: "70-90 days" },
  "Soybean": { seedRate: "25-30 kg/acre", sowingTime: "June-July", weedingTime: "First at 20-25 days, second at 40 days", problems: ["Girdle beetle", "Rust"], harvestTime: "95-110 days" },
  "Til": { seedRate: "1.5-2 kg/acre", sowingTime: "June-July", weedingTime: "One weeding at 20-25 days", problems: ["Phyllody disease", "Leaf webber"], harvestTime: "85-95 days" },
  "Jute": { seedRate: "2-2.5 kg/acre", sowingTime: "March-April", weedingTime: "First at 20-25 days, thinning also needed", problems: ["Stem weevil", "Semilooper"], harvestTime: "120-150 days (for fiber)" },
  "Bajra": { seedRate: "3-4 kg/acre", sowingTime: "June-July", weedingTime: "First at 20 days, second at 35 days", problems: ["Downy mildew", "Stem borer"], harvestTime: "75-90 days" },
  "Jau": { seedRate: "35-40 kg/acre", sowingTime: "November", weedingTime: "One weeding at 30-35 days", problems: ["Rust", "Aphids"], harvestTime: "120-135 days" },
  "Masoor": { seedRate: "12-15 kg/acre", sowingTime: "October-November", weedingTime: "One weeding at 30 days", problems: ["Wilt disease", "Aphids"], harvestTime: "110-130 days" },
  "Alsi": { seedRate: "6-8 kg/acre", sowingTime: "October-November", weedingTime: "One weeding at 25-30 days", problems: ["Rust", "Aphids"], harvestTime: "120-140 days" },
  "Bhindi": { seedRate: "3-4 kg/acre", sowingTime: "Feb-March and June-July", weedingTime: "First at 15-20 days, keep field weed-free after", problems: ["Yellow vein mosaic virus", "Fruit borer", "Aphids"], harvestTime: "Picking starts 45-50 days, continues for weeks" },
  "Baingan": { seedRate: "150-200 gm/acre (nursery raised)", sowingTime: "Nursery June-July or Nov-Dec", weedingTime: "First at 20 days after transplant, then every 3-4 weeks", problems: ["Fruit and shoot borer", "Bacterial wilt"], harvestTime: "70-80 days after transplanting" },
  "Lauki": { seedRate: "1.5-2 kg/acre", sowingTime: "Feb-March and June-July", weedingTime: "Keep weed-free for first 30 days", problems: ["Fruit fly", "Powdery mildew"], harvestTime: "55-65 days" },
  "Tori": { seedRate: "1.5-2 kg/acre", sowingTime: "Feb-March and June-July", weedingTime: "Keep weed-free for first 30 days", problems: ["Fruit fly", "Powdery mildew"], harvestTime: "55-65 days" },
  "Karela": { seedRate: "2-2.5 kg/acre", sowingTime: "Feb-March and June-July", weedingTime: "First 30 days critical", problems: ["Fruit fly", "Powdery mildew"], harvestTime: "55-60 days" },
  "Palak": { seedRate: "8-10 kg/acre", sowingTime: "Year-round, best October-February", weedingTime: "Light weeding every cutting cycle", problems: ["Leaf spot", "Aphids"], harvestTime: "First cutting at 25-30 days, then every 15-20 days" },
  "Methi": { seedRate: "10-12 kg/acre", sowingTime: "October-November", weedingTime: "One weeding at 20 days", problems: ["Powdery mildew", "Aphids"], harvestTime: "25-30 days for leaves, 90-100 days for seeds" },
  "Dhaniya": { seedRate: "8-10 kg/acre", sowingTime: "October-November", weedingTime: "One weeding at 25-30 days", problems: ["Powdery mildew", "Aphids"], harvestTime: "Leaves at 30-40 days, seeds at 100-120 days" },
  "Gobi (Phool)": { seedRate: "300-400 gm/acre (nursery raised)", sowingTime: "Nursery September-October", weedingTime: "First at 20-25 days after transplant", problems: ["Black rot", "Aphids", "Cabbage worm"], harvestTime: "70-90 days after transplanting" },
  "Patta Gobi": { seedRate: "300-400 gm/acre (nursery raised)", sowingTime: "Nursery September-October", weedingTime: "First at 20-25 days after transplant", problems: ["Black rot", "Aphids", "Cabbage worm"], harvestTime: "70-90 days after transplanting" },
  "Gajar": { seedRate: "3-4 kg/acre", sowingTime: "September-October", weedingTime: "First at 25-30 days (thinning also needed)", problems: ["Leaf blight", "Aphids"], harvestTime: "90-110 days" },
  "Mooli": { seedRate: "4-5 kg/acre", sowingTime: "Year-round, best October-November", weedingTime: "One light weeding at 15-20 days", problems: ["Aphids", "Flea beetle"], harvestTime: "40-60 days" },
  "Kheera": { seedRate: "1-1.5 kg/acre", sowingTime: "Feb-March and June-July", weedingTime: "Keep weed-free for first 30 days", problems: ["Fruit fly", "Downy mildew"], harvestTime: "50-60 days" },
  "Tarbuz": { seedRate: "1.5-2 kg/acre", sowingTime: "January-February", weedingTime: "First 30-40 days critical", problems: ["Fruit fly", "Fusarium wilt"], harvestTime: "80-90 days" },
  "Kharbuja": { seedRate: "1.5-2 kg/acre", sowingTime: "January-February", weedingTime: "First 30-40 days critical", problems: ["Fruit fly", "Fusarium wilt"], harvestTime: "80-90 days" },
  "Kaddu": { seedRate: "1.5-2 kg/acre", sowingTime: "Feb-March and June-July", weedingTime: "First 30 days critical", problems: ["Fruit fly", "Powdery mildew"], harvestTime: "90-110 days" }
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
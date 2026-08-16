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

module.exports = { recommendCrops };
// Uses OpenStreetMap's free Nominatim service for real reverse geocoding
// (GPS coordinates -> actual village/area name). This is a live public API,
// not a hardcoded list, so it works for any location, not just pre-listed ones.

const tehsils = [
  { name: "Sadar (Gorakhpur city)", lat: 26.7637, lon: 83.4039, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Chauri Chaura", lat: 26.7167, lon: 83.6167, mandi: "Chorichora Mandi", soil: "Alluvial" },
  { name: "Sahjanwa", lat: 26.8000, lon: 83.1800, mandi: "Sehjanwa Mandi", soil: "Alluvial" },
  { name: "Khajni", lat: 26.6000, lon: 83.3500, mandi: "Gorakhpur Mandi", soil: "Alluvial-Clayey" },
  { name: "Campierganj", lat: 26.9500, lon: 83.3500, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Bansgaon", lat: 26.5500, lon: 83.2800, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Gola", lat: 26.6300, lon: 83.5500, mandi: "Chorichora Mandi", soil: "Alluvial" }
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestTehsil(lat, lon) {
  let nearest = tehsils[0];
  let minDist = haversine(lat, lon, nearest.lat, nearest.lon);
  tehsils.forEach((t) => {
    const d = haversine(lat, lon, t.lat, t.lon);
    if (d < minDist) { minDist = d; nearest = t; }
  });
  return nearest;
}

async function reverseGeocode(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'lat and lon query parameters are required' });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'KisanMitraCollegeProject/1.0' }
    });
    const data = await response.json();
    const address = data.address || {};

    const villageName =
      address.village || address.hamlet || address.suburb ||
      address.town || address.city || 'Unknown location';

    const nearest = findNearestTehsil(parseFloat(lat), parseFloat(lon));

    res.json({
      village: villageName,
      fullAddress: data.display_name || null,
      tehsil: nearest.name,
      nearestMandi: nearest.mandi,
      soilType: nearest.soil
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching location details', error: err.message });
  }
}

module.exports = { reverseGeocode };
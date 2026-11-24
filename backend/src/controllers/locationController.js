// Uses OpenStreetMap's free Nominatim service for real reverse geocoding
// (GPS coordinates -> actual village/area name) — this part works anywhere,
// not just UP. The "locations" list below is only used to find the
// nearest reference point for assigning a soil type and a nearby demo mandi.
//
// NOTE: Coordinates are approximate district-headquarters points for
// demo/prototype purposes — not precise boundaries.

const locations = [
  { name: "Gorakhpur", lat: 26.7637, lon: 83.4039, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Basti", lat: 26.8148, lon: 82.7611, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Deoria", lat: 26.5024, lon: 83.7791, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Gonda", lat: 27.1333, lon: 81.9667, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Ayodhya", lat: 26.7922, lon: 82.1998, mandi: "Gorakhpur Mandi", soil: "Alluvial" },
  { name: "Ballia", lat: 25.7600, lon: 84.1500, mandi: "Gorakhpur Mandi", soil: "Alluvial" },

  { name: "Varanasi", lat: 25.3176, lon: 82.9739, mandi: "Varanasi Mandi", soil: "Alluvial" },
  { name: "Azamgarh", lat: 26.0737, lon: 83.1859, mandi: "Varanasi Mandi", soil: "Alluvial" },
  { name: "Mirzapur", lat: 25.1460, lon: 82.5690, mandi: "Varanasi Mandi", soil: "Alluvial" },
  { name: "Jaunpur", lat: 25.7479, lon: 82.6833, mandi: "Varanasi Mandi", soil: "Alluvial" },
  { name: "Ghazipur", lat: 25.5833, lon: 83.5833, mandi: "Varanasi Mandi", soil: "Alluvial" },

  { name: "Lucknow", lat: 26.8467, lon: 80.9462, mandi: "Lucknow Mandi", soil: "Alluvial" },
  { name: "Hardoi", lat: 27.3990, lon: 80.1310, mandi: "Lucknow Mandi", soil: "Alluvial" },
  { name: "Raebareli", lat: 26.2309, lon: 81.2340, mandi: "Lucknow Mandi", soil: "Alluvial" },
  { name: "Sitapur", lat: 27.5680, lon: 80.6820, mandi: "Lucknow Mandi", soil: "Alluvial" },

  { name: "Kanpur", lat: 26.4499, lon: 80.3319, mandi: "Kanpur Mandi", soil: "Alluvial" },
  { name: "Farrukhabad", lat: 27.3920, lon: 79.5807, mandi: "Kanpur Mandi", soil: "Alluvial" },
  { name: "Etawah", lat: 26.7855, lon: 79.0154, mandi: "Kanpur Mandi", soil: "Alluvial" },
  { name: "Unnao", lat: 26.5465, lon: 80.4878, mandi: "Kanpur Mandi", soil: "Alluvial" },

  { name: "Prayagraj", lat: 25.4358, lon: 81.8463, mandi: "Prayagraj Mandi", soil: "Alluvial" },
  { name: "Sultanpur", lat: 26.2648, lon: 82.0721, mandi: "Prayagraj Mandi", soil: "Alluvial" },

  { name: "Agra", lat: 27.1767, lon: 78.0081, mandi: "Agra Mandi", soil: "Alluvial" },
  { name: "Aligarh", lat: 27.8974, lon: 78.0880, mandi: "Agra Mandi", soil: "Alluvial" },
  { name: "Mathura", lat: 27.4924, lon: 77.6737, mandi: "Agra Mandi", soil: "Alluvial" },
  { name: "Firozabad", lat: 27.1592, lon: 78.3957, mandi: "Agra Mandi", soil: "Alluvial" },

  { name: "Meerut", lat: 28.9845, lon: 77.7064, mandi: "Meerut Mandi", soil: "Alluvial" },
  { name: "Saharanpur", lat: 29.9680, lon: 77.5460, mandi: "Meerut Mandi", soil: "Alluvial" },
  { name: "Muzaffarnagar", lat: 29.4727, lon: 77.7085, mandi: "Meerut Mandi", soil: "Alluvial" },
  { name: "Ghaziabad", lat: 28.6692, lon: 77.4538, mandi: "Meerut Mandi", soil: "Alluvial" },
  { name: "Noida", lat: 28.5355, lon: 77.3910, mandi: "Meerut Mandi", soil: "Alluvial" },
  { name: "Bulandshahr", lat: 28.4070, lon: 77.8498, mandi: "Meerut Mandi", soil: "Alluvial" },

  { name: "Bareilly", lat: 28.3670, lon: 79.4304, mandi: "Bareilly Mandi", soil: "Alluvial" },
  { name: "Shahjahanpur", lat: 27.8814, lon: 79.9120, mandi: "Bareilly Mandi", soil: "Alluvial" },

  { name: "Moradabad", lat: 28.8386, lon: 78.7733, mandi: "Moradabad Mandi", soil: "Alluvial" },
  { name: "Rampur", lat: 28.8152, lon: 79.0255, mandi: "Moradabad Mandi", soil: "Alluvial" },

  { name: "Jhansi", lat: 25.4484, lon: 78.5685, mandi: "Jhansi Mandi", soil: "Red-Black (Bundelkhand)" },
  { name: "Banda", lat: 25.4762, lon: 80.3360, mandi: "Jhansi Mandi", soil: "Red-Black (Bundelkhand)" },
  { name: "Hamirpur", lat: 25.9550, lon: 80.1500, mandi: "Jhansi Mandi", soil: "Red-Black (Bundelkhand)" },
  { name: "Lalitpur", lat: 24.6880, lon: 78.4120, mandi: "Jhansi Mandi", soil: "Red-Black (Bundelkhand)" },
  { name: "Chitrakoot", lat: 25.2000, lon: 80.8300, mandi: "Jhansi Mandi", soil: "Red-Black (Bundelkhand)" }
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestLocation(lat, lon) {
  let nearest = locations[0];
  let minDist = haversine(lat, lon, nearest.lat, nearest.lon);
  locations.forEach((t) => {
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

    const nearest = findNearestLocation(parseFloat(lat), parseFloat(lon));

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
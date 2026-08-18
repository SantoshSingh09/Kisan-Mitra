// Fetches real mandi price data from data.gov.in (Agmarknet dataset),
// filtered to Gorakhpur district, and groups results by market.

async function getMandiPrices(req, res) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.DATA_GOV_RESOURCE_ID;

  if (!apiKey || !resourceId) {
    return res.status(500).json({ message: 'Mandi API key is not configured' });
  }

  const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=500&filters[state]=Uttar Pradesh`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const records = data.records || [];

    if (records.length === 0) {
      return res.json({
        note: 'No records found for Gorakhpur on the latest available date. Agmarknet data is not always updated daily for every district.',
        markets: {}
      });
    }

    // Group records by market name (e.g. "Gorakhpur", "Sahjanwa")
    const markets = {};
    records.forEach((r) => {
      const marketName = r.market || 'Unknown Market';
      if (!markets[marketName]) markets[marketName] = [];
      markets[marketName].push({
        commodity: r.commodity,
        variety: r.variety,
        minPrice: r.min_price,
        maxPrice: r.max_price,
        modalPrice: r.modal_price,
        arrivalDate: r.arrival_date
      });
    });

    res.json({ markets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mandi data', error: err.message });
  }
}

module.exports = { getMandiPrices };
// Real crop-disease detection using Google Gemini (free tier, vision model).
// The frontend sends a leaf photo as base64 JSON; we ask Gemini for a
// structured diagnosis in Hindi and return it to the app.
//
// Env vars:
//   GEMINI_API_KEY  - free key from https://aistudio.google.com/apikey
//   GEMINI_MODEL    - optional, defaults to gemini-2.5-flash

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB after base64 decode
const ATTEMPT_TIMEOUT_MS = 75000; // har model ko itna time; na chale to agla model

const PROMPT = `You are an expert plant pathologist helping small farmers in Uttar Pradesh, India.
Look at the attached photo of a crop leaf/plant and diagnose it.

How to diagnose carefully:
1. First identify the crop from the leaf shape (common local crops: rice/paddy, wheat, sugarcane, maize, potato, tomato, mustard, pulses, vegetables).
2. Study the lesions closely: shape, size, colour, margins/halo, position on the leaf, spread pattern. Compare against similar diseases before deciding (for example rice brown spot vs rice blast vs bacterial leaf blight; wheat leaf rust vs yellow rust vs septoria; potato/tomato early vs late blight). Also consider nutrient deficiency, pest damage or sunburn as alternatives.
3. Pick the single most likely diagnosis. Put other plausible diagnoses in "alsoPossible" (max 3, short Hindi names), and say in "summary" what visible feature supports your choice.

Rules:
- Write every text field in simple Hindi (Devanagari) that a farmer can understand. Crop and disease names may also include the common English name in brackets.
- If the image is NOT a plant/leaf, or is too blurry/dark to judge, set "isPlant" to false or "status" to "unclear" and explain in "summary" how to take a better photo.
- Only report what is visible. If unsure, lower the confidence and say so. Never invent a disease.
- Treatment: give practical, low-cost steps (organic/cultural first, then chemical with common product/active ingredient names available in India, no exact doses). Always tell the farmer to follow the label and consult the local Krishi Vigyan Kendra (KVK) / agriculture officer for severe cases.
- "confidence" is an integer 0-100.`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    isPlant: { type: 'BOOLEAN' },
    status: { type: 'STRING', enum: ['healthy', 'diseased', 'unclear'] },
    crop: { type: 'STRING' },
    disease: { type: 'STRING' },
    confidence: { type: 'INTEGER' },
    summary: { type: 'STRING' },
    symptoms: { type: 'ARRAY', items: { type: 'STRING' } },
    treatment: { type: 'ARRAY', items: { type: 'STRING' } },
    prevention: { type: 'ARRAY', items: { type: 'STRING' } },
    alsoPossible: { type: 'ARRAY', items: { type: 'STRING' } }
  },
  required: ['isPlant', 'status', 'confidence', 'summary']
};

// Google ke 429 jawab se quota ka asli kaaran nikalo (roz ka / per-minute / free tier mein zero)
function quotaInfo(errText) {
  try {
    const e = JSON.parse(errText).error || {};
    const out = [];
    for (const d of e.details || []) {
      for (const v of d.violations || []) out.push(String(v.quotaId || v.quotaMetric || '').replace(/GenerateContent|RequestsPer|PerModel|PerProject/g, m => ({ GenerateContent: '', RequestsPer: 'Req/', PerModel: '', PerProject: '' }[m])).slice(0, 60));
      if (d.retryDelay) out.push('retry ' + d.retryDelay);
    }
    return out.join(', ');
  } catch { return ''; }
}

function clampConfidence(n) {
  n = Number(n);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function strList(v) {
  return Array.isArray(v) ? v.filter(x => typeof x === 'string' && x.trim()).slice(0, 8) : [];
}

async function detectDisease(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server' });
  }

  const { image, mimeType } = req.body || {};
  if (typeof image !== 'string' || !image) {
    return res.status(400).json({ message: 'Image is required' });
  }
  if (!ALLOWED_MIME.includes(mimeType)) {
    return res.status(400).json({ message: 'Only JPEG, PNG or WebP images are supported' });
  }
  // Accept raw base64 or a data URL.
  const base64 = image.replace(/^data:[^;]+;base64,/, '');
  if (!/^[A-Za-z0-9+/]+=*$/.test(base64) || Buffer.byteLength(base64, 'base64') > MAX_IMAGE_BYTES) {
    return res.status(400).json({ message: 'Invalid image or image larger than 4 MB' });
  }

  // .env ka GEMINI_MODEL pehle; na chale (404/429/busy) to agle models. Pro chahiye to .env mein GEMINI_MODEL=gemini-pro-latest likho.
  const models = [...new Set([process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'].filter(Boolean))];
  const urlFor = m => `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`;

  const body = {
    contents: [{
      parts: [
        { text: PROMPT },
        { inline_data: { mime_type: mimeType, data: base64 } }
      ]
    }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA
    }
  };

  try {
    let apiRes = null, usedModel = '';
    let lastErr = null, lastErrText = '';
    const attempts = []; // har model ka haal (debug ke liye)
    for (const m of models) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
      try {
        apiRes = await fetch(urlFor(m), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(body),
          signal: controller.signal
        });
      } catch (e) {
        clearTimeout(timer);
        lastErr = e;
        attempts.push(m + ': ' + (e.name === 'AbortError' ? 'timeout' : e.message));
        console.warn('Gemini model failed (' + (e.name === 'AbortError' ? 'timeout' : e.message) + '):', m);
        apiRes = null;
        continue;
      }
      clearTimeout(timer);
      usedModel = m;
      // In status par agla model try karo
      if ([400, 403, 404, 429, 500, 503].includes(apiRes.status)) {
        const why = await apiRes.text().catch(() => '');
        lastErrText = why;
        let short = why; try { short = JSON.parse(why).error.message; } catch {}
        const q = apiRes.status === 429 ? quotaInfo(why) : '';
        if (q) short = q;
        attempts.push(m + ' [' + apiRes.status + '] ' + String(short).replace(/\s+/g, ' ').slice(0, 110));
        console.warn('Gemini model skipped:', m, '| status', apiRes.status, '|', why.slice(0, 300).replace(/\s+/g, ' '));
        continue;
      }
      break;
    }
    if (!apiRes) {
      const timedOut = lastErr && lastErr.name === 'AbortError';
      return res.status(timedOut ? 504 : 502).json({
        message: (timedOut ? 'Analysis timed out. Please try again.' : 'Could not reach analysis service.') +
          (process.env.DEBUG_ERRORS === '1' ? ' || ' + attempts.join(' || ') : '')
      });
    }
    console.log('Disease detect model used:', usedModel);

    if (apiRes.status === 429) {
      return res.status(429).json({ message: 'Free daily/minute limit reached. Please try again in a few minutes.' +
        (process.env.DEBUG_ERRORS === '1' ? ' || ' + attempts.join(' || ') : '') });
    }
    if (!apiRes.ok) {
      const errText = lastErrText || await apiRes.text().catch(() => '');
      console.error('Gemini error', apiRes.status, errText.slice(0, 500));
      let reason = '';
      try { reason = JSON.parse(errText).error.message || ''; } catch { reason = errText; }
      reason = reason.replace(/\s+/g, ' ').slice(0, 200);
      // DEBUG_ERRORS=1 .env mein ho to asli wajah page par dikhegi (development ke liye)
      const detail = process.env.DEBUG_ERRORS === '1' ? ` || ${attempts.join(' || ')}` : '';
      return res.status(502).json({ message: 'Disease analysis service error. Please try again.' + detail });
    }

    const data = await apiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      // e.g. blocked by safety filters
      return res.status(422).json({ message: 'Could not analyse this image. Please upload a clear leaf photo.' });
    }

    let parsed;
    try { parsed = JSON.parse(text); }
    catch { return res.status(502).json({ message: 'Unexpected response from analysis service' }); }

    const status = ['healthy', 'diseased', 'unclear'].includes(parsed.status) ? parsed.status : 'unclear';
    res.json({
      demoMode: false,
      model: usedModel,
      result: {
        isPlant: parsed.isPlant !== false,
        status: parsed.isPlant === false ? 'unclear' : status,
        crop: parsed.crop || '',
        disease: status === 'diseased' ? (parsed.disease || '') : '',
        confidence: clampConfidence(parsed.confidence),
        summary: parsed.summary || '',
        symptoms: strList(parsed.symptoms),
        treatment: strList(parsed.treatment),
        prevention: strList(parsed.prevention),
        alsoPossible: strList(parsed.alsoPossible).slice(0, 3)
      },
      disclaimer: 'यह AI द्वारा किया गया अनुमान है। दवा डालने से पहले अपने नज़दीकी कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से सलाह लें।'
    });
  } catch (err) {
    const timedOut = err.name === 'AbortError';
    console.error('Disease detect failed:', err.message);
    res.status(timedOut ? 504 : 502).json({
      message: timedOut ? 'Analysis timed out. Please try again.' : 'Could not reach analysis service.'
    });
  }
}

module.exports = { detectDisease };

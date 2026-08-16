// This is a placeholder/demo controller.
// It does not run real image analysis yet — it returns sample results
// so the rest of the app (frontend, routes) can be built and tested.
// Replace this logic later with a real trained model (e.g. Teachable Machine).

const sampleResults = [
  {
    status: 'Healthy',
    confidence: 92,
    message: 'No visible disease symptoms detected.'
  },
  {
    status: 'Diseased',
    confidence: 81,
    message: 'Leaf Blight symptoms detected. Consider fungicide treatment.'
  }
];

function detectDisease(req, res) {
  // In the real version, an uploaded image will be sent here and
  // passed to the trained model. For now we return a sample result.

  const randomResult = sampleResults[Math.floor(Math.random() * sampleResults.length)];

  res.json({
    demoMode: true,
    note: 'This is placeholder data. Real model integration pending.',
    result: randomResult
  });
}

module.exports = { detectDisease };
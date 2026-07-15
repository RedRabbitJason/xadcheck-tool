export default async function handler(req, res) {
  const { headline, body, category } = req.body || req.query;
  const API_KEY = process.env.GROK_API_KEY;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-2-1212", // Updated model name
        messages: [{ role: "user", content: `Analyze X ad for compliance.

Headline: ${headline || 'None'}
Body: ${body || 'None'}
Category: ${category || 'general'}` }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

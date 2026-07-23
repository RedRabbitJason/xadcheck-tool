export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { headline = '', body = '', category = 'general' } = req.body || {};

  const API_KEY = process.env.GROK_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-4.5',
        messages: [{
          role: 'user',
          content: `Analyze this X ad for compliance with X Advertising Policies.

Headline: ${headline}
Body: ${body}
Category: ${category}

Respond with clean HTML. Start with one of these:
<h2 class="text-3xl font-bold text-green-400">COMPLIANT</h2>
or
<h2 class="text-3xl font-bold text-amber-400">NEEDS REVIEW</h2>
or
<h2 class="text-3xl font-bold text-red-400">NOT COMPLIANT</h2>

Use clear headings and bullet points.`
        }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

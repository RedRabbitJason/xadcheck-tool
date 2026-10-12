export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { headline = '', body = '', category = 'general', landing = '', imageDesc = '' } = req.body || {};
  const allowed = ['X', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube'];
  const incoming = Array.isArray(req.body?.platforms) ? req.body.platforms : ['X'];
  const platforms = incoming.filter((name) => allowed.includes(name));
  const platformList = (platforms.length ? platforms : ['X']).join(', ');
  const API_KEY = process.env.GROK_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not set' });
  }

  const prompt = `You are an expert paid-social ads policy analyst. Analyze the following ad creative for the selected platforms.

Ad Details:
- Headline: ${headline}
- Body: ${body}
- Category: ${category}
- Landing Page: ${landing || 'Not provided'}
- Image Description: ${imageDesc || 'Not provided'}
- Platforms: ${platformList}

Your response MUST follow this exact structure and use HTML for formatting:

1. Start with one of these status labels (exactly as written). Use the strictest result across the selected platforms:
   - COMPLIANT
   - CAUTION
   - NOT COMPLIANT

2. Then provide a short overall assessment paragraph.

3. Include a clearly labeled section:
   <h3>Detected Pain Points</h3>
   List any of the following common paid-social issues that apply to this creative. If none apply, write "None detected".

   Common pain points to check for:
   - Links placed directly in the ad body text
   - Multiple or repeated links / domain mentions
   - Exaggerated or absolute claims
   - Before/after or sensational claims
   - Heavy text in images
   - Implying partnership with the platform
   - Sensitive category risks
   - Vague or missing landing page

4. If more than one platform is selected, include:
   <h3>By Platform</h3>
   One short line per selected platform. Name the platform, then Compliant, Caution, or Not Compliant, then the specific reason.

5. Then provide a detailed analysis. Weight X Ads policy when X is selected. For any other selected platform, only flag issues that are real policy or delivery risks on that platform.

6. End with a clear verdict sentence.

Rules:
- Be direct and practical.
- Do not invent violations.
- Prefer CAUTION over NOT COMPLIANT when it is mainly a delivery risk.
- Format in clean HTML. Do not wrap the response in markdown code blocks.`;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-4.5',
        messages: [
          {
            role: 'system',
            content: 'You are a precise paid-social ads policy expert. Output only the structured HTML analysis. No preamble.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('xAI API Error:', JSON.stringify(data, null, 2));
      return res.status(500).json({
        error: data.error?.message || data.error || 'Analysis failed',
        details: data
      });
    }

    if (data.error) {
      console.error('xAI returned error:', data.error);
      return res.status(500).json({
        error: data.error.message || data.error,
        details: data
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Analyze exception:', error);
    res.status(500).json({ error: error.message });
  }
}

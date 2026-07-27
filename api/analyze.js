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
  const API_KEY = process.env.GROK_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not set' });
  }

  const prompt = `You are an expert X (Twitter) Ads policy analyst. Analyze the following ad creative for compliance with current X Ads policies.

Ad Details:
- Headline: ${headline}
- Body: ${body}
- Category: ${category}
- Landing Page: ${landing || 'Not provided'}
- Image Description: ${imageDesc || 'Not provided'}

Your response MUST follow this exact structure and use HTML for formatting:

1. Start with one of these status labels (exactly as written):
   - COMPLIANT
   - CAUTION
   - NOT COMPLIANT

2. Then provide a short overall assessment paragraph.

3. Include a clearly labeled section:
   <h3>Detected Pain Points</h3>
   List any of the following common X Ads issues that apply to this creative. If none apply, write "None detected".

   Common pain points to check for:
   - Links placed directly in the ad body text
   - Multiple or repeated links / domain mentions
   - Exaggerated or absolute claims
   - Before/after or sensational claims
   - Heavy text in images
   - Implying partnership with X
   - Sensitive category risks
   - Vague or missing landing page

4. Then provide a detailed analysis.

5. End with a clear verdict sentence.

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
        model: 'ggrok-4.5',
        messages: [
          {
            role: 'system',
            content: 'You are a precise X Ads policy compliance expert. Output only the structured HTML analysis. No preamble.'
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

    // Better error reporting
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

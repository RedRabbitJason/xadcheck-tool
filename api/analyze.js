import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // CORS
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
   - Links placed directly in the ad body text (high risk of limited delivery or rejection)
   - Multiple or repeated links / domain mentions
   - Exaggerated or absolute claims (e.g. "guaranteed", "#1", "best", income promises)
   - Before/after or sensational transformation claims
   - Heavy text overlay in images (if image description suggests significant text)
   - Implying official partnership with X or using X branding/logo language
   - Sensitive category risks (finance, health, politics, crypto, alcohol, gambling, etc.)
   - Vague, missing, or mismatched landing page
   - Clickbait or fear-based tactics

4. Then provide a detailed analysis covering:
   - Prohibited content check
   - Claim reasonableness
   - Category fit
   - Landing page & branding
   - Other relevant policies

5. End with a clear verdict sentence.

Rules:
- Be direct and practical.
- Do not invent policy violations that are not present.
- Prefer "CAUTION" over "NOT COMPLIANT" when the issue is delivery risk rather than a hard policy ban.
- Never claim the ad is guaranteed to be approved.
- Format the response in clean HTML (use <p>, <h3>, <ul>, <li>, <strong> as needed).
- Do not wrap the entire response in markdown code blocks.`;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [
          {
            role: 'system',
            content: 'You are a precise and practical X Ads policy compliance expert. Output only the structured HTML analysis requested. No preamble.'
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

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Analysis failed' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

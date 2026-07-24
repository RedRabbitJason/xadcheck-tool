import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, idea } = req.body || {};

  if (!idea || idea.trim().length === 0) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  if (idea.length > 150) {
    return res.status(400).json({ error: 'Idea too long (max 150 characters)' });
  }

  try {
    const { error } = await supabase
      .from('feature_ideas')
      .insert([{ 
        user_id: userId || 'anonymous', 
        idea: idea.trim() 
      }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

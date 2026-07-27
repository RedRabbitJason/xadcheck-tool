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

  const { userId, action } = req.body || {};

  if (!userId || !action) {
    return res.status(400).json({ error: 'userId and action are required' });
  }

  try {
    // Get current record
    let { data: existing } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existing) {
      // Create new record
      const newRecord = {
        user_id: userId,
        checks_used: action === 'use-check' ? 1 : 0,
        bonus_claimed: action === 'claim-bonus',
        credits_remaining: action === 'claim-bonus' ? 1 : 0
      };

      const { error: insertError } = await supabase
        .from('user_usage')
        .insert([newRecord]);

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }
    } else {
      const updates = {};

      if (action === 'use-check') {
        const freeAllowance = 1 + (existing.bonus_claimed ? 1 : 0);
        const freeUsed = existing.checks_used || 0;

        if (freeUsed < freeAllowance) {
          // Still have free checks left
          updates.checks_used = freeUsed + 1;
        } else {
          // Free checks exhausted → deduct from paid credits
          const currentCredits = existing.credits_remaining || 0;
          if (currentCredits > 0) {
            updates.credits_remaining = currentCredits - 1;
          }
          updates.checks_used = freeUsed + 1;
        }
      }

      if (action === 'claim-bonus') {
        // Only allow once
        if (!existing.bonus_claimed) {
          updates.bonus_claimed = true;
          updates.credits_remaining = (existing.credits_remaining || 0) + 1;
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('user_usage')
          .update(updates)
          .eq('user_id', userId);

        if (updateError) {
          return res.status(500).json({ error: updateError.message });
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

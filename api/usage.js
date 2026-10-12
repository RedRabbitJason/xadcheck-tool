import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const DAILY_FREE = 3;
const MONTHLY_FREE = 15;

function utcDay(date) {
  return date.toISOString().slice(0, 10);
}

function utcMonth(date) {
  return date.toISOString().slice(0, 7);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(200).json({
        free_checks_today: 0,
        free_checks_month: 0,
        free_remaining_today: DAILY_FREE,
        free_remaining_month: MONTHLY_FREE,
        free_remaining: DAILY_FREE,
        credits_remaining: 0,
        checks_used: 0,
        bonus_claimed: false
      });
    }

    const now = new Date();
    const updates = {};
    let freeToday = data.free_checks_today || 0;
    let freeMonth = data.free_checks_month || 0;

    const lastDay = data.last_daily_reset ? utcDay(new Date(data.last_daily_reset)) : null;
    const lastMonth = data.last_monthly_reset ? utcMonth(new Date(data.last_monthly_reset)) : null;

    if (lastDay !== utcDay(now)) {
      freeToday = 0;
      updates.free_checks_today = 0;
      updates.last_daily_reset = now.toISOString();
    }

    if (lastMonth !== utcMonth(now)) {
      freeMonth = 0;
      updates.free_checks_month = 0;
      updates.last_monthly_reset = now.toISOString();
    }

    if (Object.keys(updates).length > 0) {
      updates.updated_at = now.toISOString();
      const { error: updateError } = await supabase
        .from('user_usage')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
    }

    const remainingToday = Math.max(0, DAILY_FREE - freeToday);
    const remainingMonth = Math.max(0, MONTHLY_FREE - freeMonth);

    return res.status(200).json({
      free_checks_today: freeToday,
      free_checks_month: freeMonth,
      free_remaining_today: remainingToday,
      free_remaining_month: remainingMonth,
      free_remaining: Math.min(remainingToday, remainingMonth),
      credits_remaining: data.credits_remaining || 0,
      checks_used: data.checks_used || 0,
      bonus_claimed: data.bonus_claimed || false
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

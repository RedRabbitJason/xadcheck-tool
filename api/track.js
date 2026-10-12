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

function remaining(freeToday, freeMonth, credits) {
  const remainingToday = Math.max(0, DAILY_FREE - freeToday);
  const remainingMonth = Math.max(0, MONTHLY_FREE - freeMonth);
  return {
    free_checks_today: freeToday,
    free_checks_month: freeMonth,
    free_remaining_today: remainingToday,
    free_remaining_month: remainingMonth,
    free_remaining: Math.min(remainingToday, remainingMonth),
    credits_remaining: credits
  };
}

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

  const { userId, action } = req.body || {};
  if (!userId || !action) {
    return res.status(400).json({ error: 'userId and action are required' });
  }

  try {
    const now = new Date();
    let { data: existing, error: readError } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (readError && readError.code !== 'PGRST116') {
      return res.status(500).json({ error: readError.message });
    }

    if (!existing) {
      if (action !== 'use-check') {
        return res.status(400).json({ error: 'Nothing to update' });
      }

      const record = {
        user_id: userId,
        checks_used: 1,
        bonus_claimed: false,
        credits_remaining: 0,
        free_checks_today: 1,
        free_checks_month: 1,
        last_daily_reset: now.toISOString(),
        last_monthly_reset: now.toISOString(),
        updated_at: now.toISOString()
      };

      const { error: insertError } = await supabase
        .from('user_usage')
        .insert([record]);

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      return res.status(200).json({
        success: true,
        used: 'free',
        ...remaining(1, 1, 0)
      });
    }

    let freeToday = existing.free_checks_today || 0;
    let freeMonth = existing.free_checks_month || 0;
    let credits = existing.credits_remaining || 0;
    const updates = {};

    const lastDay = existing.last_daily_reset ? utcDay(new Date(existing.last_daily_reset)) : null;
    const lastMonth = existing.last_monthly_reset ? utcMonth(new Date(existing.last_monthly_reset)) : null;

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

    if (action === 'use-check') {
      const canUseFree = freeToday < DAILY_FREE && freeMonth < MONTHLY_FREE;

      if (canUseFree) {
        freeToday += 1;
        freeMonth += 1;
        updates.free_checks_today = freeToday;
        updates.free_checks_month = freeMonth;
        updates.checks_used = (existing.checks_used || 0) + 1;
      } else if (credits > 0) {
        credits -= 1;
        updates.credits_remaining = credits;
        updates.checks_used = (existing.checks_used || 0) + 1;
      } else {
        return res.status(402).json({
          error: 'No checks remaining',
          ...remaining(freeToday, freeMonth, credits)
        });
      }
    } else {
      return res.status(400).json({ error: 'Unknown action' });
    }

    updates.updated_at = now.toISOString();

    const { error: updateError } = await supabase
      .from('user_usage')
      .update(updates)
      .eq('user_id', userId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    const usedFree = updates.free_checks_today !== undefined && freeToday > (existing.free_checks_today || 0);

    return res.status(200).json({
      success: true,
      used: usedFree || (updates.free_checks_today === 1 && !existing.free_checks_today) ? 'free' : 'credit',
      ...remaining(freeToday, freeMonth, credits)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

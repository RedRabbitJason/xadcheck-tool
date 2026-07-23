import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dyclineceextfoyttyne.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5Y2xpbmVjZWV4dGZveXR0eW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODA2NTUsImV4cCI6MjEwMDM1NjY1NX0.tN1MZVdnqxBJZ3ldxeayKGiPiOTNJsvivFwhqRUPztU'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, action } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }

  try {
    // Get current usage
    let { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!usage) {
      usage = { user_id: userId, checks_used: 0, bonus_claimed: false };
    }

    if (action === "use-check") {
      usage.checks_used = (usage.checks_used || 0) + 1;
    } else if (action === "claim-bonus") {
      usage.bonus_claimed = true;
    }

    // Upsert
    const { error } = await supabase
      .from('user_usage')
      .upsert(usage);

    if (error) throw error;

    res.status(200).json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

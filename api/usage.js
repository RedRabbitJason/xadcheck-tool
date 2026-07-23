import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dyclineceextfoyttyne.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5Y2xpbmVjZWV4dGZveXR0eW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODA2NTUsImV4cCI6MjEwMDM1NjY1NX0.tN1MZVdnqxBJZ3ldxeayKGiPiOTNJsvivFwhqRUPztU'
);

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }

  try {
    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const usage = data || { checks_used: 0, bonus_claimed: false };
    res.status(200).json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

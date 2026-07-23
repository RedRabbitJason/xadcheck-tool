import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, action } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }

  try {
    let usage = await kv.get(`user:${userId}`) || { checksUsed: 0, bonusClaimed: false };

    if (action === "use-check") {
      usage.checksUsed = (usage.checksUsed || 0) + 1;
    } else if (action === "claim-bonus") {
      usage.bonusClaimed = true;
    }

    await kv.set(`user:${userId}`, usage);

    res.status(200).json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

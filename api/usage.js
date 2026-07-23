import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "No userId provided" });
  }

  try {
    const usage = await kv.get(`user:${userId}`) || { checksUsed: 0, bonusClaimed: false };
    res.status(200).json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

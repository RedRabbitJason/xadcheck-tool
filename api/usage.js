export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: "No userId" });

  try {
    const kv = await import('@vercel/kv');
    const usage = await kv.get(`user:${userId}`) || { checksUsed: 0, bonusClaimed: false };

    res.status(200).json(usage);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

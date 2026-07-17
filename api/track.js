export default async function handler(req, res) {
  const { userId, action } = req.body;

  if (!userId) return res.status(400).json({ error: "No userId" });

  try {
    const kv = await import('@vercel/kv');
    let usage = await kv.get(`user:${userId}`) || { checksUsed: 0, bonusClaimed: false };

    if (action === "use-check") {
      usage.checksUsed += 1;
    } else if (action === "claim-bonus") {
      usage.bonusClaimed = true;
    }

    await kv.set(`user:${userId}`, usage);

    res.status(200).json(usage);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

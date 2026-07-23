export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code received from X");
  }

  res.status(200).send(`
    <h1>Sign-in temporary success</h1>
    <p>Code received. Full flow coming next.</p>
    <a href="https://xadcheck-tool.vercel.app">Back to app</a>
  `);
}

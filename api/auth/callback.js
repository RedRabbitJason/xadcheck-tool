export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code received");
  }

  // Temporary success page
  res.status(200).send(`
    <h1>Sign-in successful (temporary)</h1>
    <p>Code received: ${code}</p>
    <p>We will finish the full flow in the next step.</p>
    <a href="/">Go back</a>
  `);
}

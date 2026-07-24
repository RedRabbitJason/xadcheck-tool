export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`Error from X: ${error}`);
  }

  if (!code) {
    return res.status(400).send("No authorization code received");
  }

  // Temporary success page so we can confirm the flow works
  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; padding: 40px; background: #111; color: white;">
        <h1>Sign-in successful (temporary)</h1>
        <p>Authorization code received.</p>
        <p>We will finish the full user session in the next step.</p>
        <a href="https://www.brandingdepartment.com/test-page-new1" style="color: #f59e0b;">Return to XAdCheck</a>
      </body>
    </html>
  `);
}

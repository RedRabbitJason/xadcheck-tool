export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`X returned error: ${error}`);
  }

  if (!code) {
    return res.status(400).send("No code received from X");
  }

  const clientId = "QkFZS3JTdlc4NTk2VjN2SzR6SVg6MTpjaQ";
  const clientSecret = "eqP7Hz4gLBi6CfQwTr1dA9WnlTu5WW25yV60LltSbYMB54CdIG";
  const redirectUri = "https://xadcheck-tool.vercel.app/api/auth/callback";

  try {
    // Step 1: Get token
    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
      },
      body: new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: "challenge"
      })
    });

    const tokenData = await tokenRes.json();

    // If no access token, show the full response
    if (!tokenData.access_token) {
      return res.status(400).send(`
        <h2>Token exchange failed</h2>
        <pre>${JSON.stringify(tokenData, null, 2)}</pre>
      `);
    }

    // Step 2: Get user
    const userRes = await fetch("https://api.twitter.com/2/users/me?user.fields=id,name,username", {
      headers: {
        "Authorization": "Bearer " + tokenData.access_token
      }
    });

    const userData = await userRes.json();

    if (!userData.data) {
      return res.status(400).send(`
        <h2>Failed to get user info</h2>
        <pre>${JSON.stringify(userData, null, 2)}</pre>
        <hr>
        <h3>Token data (for debugging)</h3>
        <pre>${JSON.stringify(tokenData, null, 2)}</pre>
      `);
    }

    // Success
    const user = userData.data;
    const redirectUrl = "https://www.brandingdepartment.com/test-page-new1?x_user=" + encodeURIComponent(user.username) + "&x_id=" + user.id;
    res.redirect(302, redirectUrl);

  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
}

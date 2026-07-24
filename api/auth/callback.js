export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`Authorization failed: ${error}`);
  }

  if (!code) {
    return res.status(400).send("No authorization code received");
  }

  const clientId = "QkFZS3JTdlc4NTk2VjN2SzR6SVg6MTpjaQ";
  const clientSecret = "eqP7Hz4gLBi6CfQwTr1dA9WnlTu5WW25yV60LltSbYMB54CdIG";
  const redirectUri = "https://xadcheck-tool.vercel.app/api/auth/callback";

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64")
      },
      body: new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: "challenge"
      })
    });

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (!tokenData.access_token) {
      return res.status(400).send("Failed to get access token:<br><pre>" + JSON.stringify(tokenData, null, 2) + "</pre>");
    }

    // Get user info
    const userResponse = await fetch("https://api.twitter.com/2/users/me?user.fields=id,name,username", {
      headers: {
        Authorization: "Bearer " + tokenData.access_token
      }
    });

    const userData = await userResponse.json();
    console.log("User response:", userData);

    if (!userData.data) {
      return res.status(400).send("Failed to get user info:<br><pre>" + JSON.stringify(userData, null, 2) + "</pre>");
    }

    const user = userData.data;

    // Success - redirect back to the app
    const redirectUrl = "https://www.brandingdepartment.com/test-page-new1?x_user=" + encodeURIComponent(user.username) + "&x_id=" + user.id;
    res.redirect(302, redirectUrl);

  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
}

export default async function handler(req, res) {
  const clientId = "QkFZS3JTdlc4NTk2VjN2SzR6SVg6MTpjaQ";
  const redirectUri = "https://xadcheck-tool.vercel.app/api/auth/callback";
  const scope = "users.read tweet.read offline.access";

  // Simple fixed challenge for now (we will improve later if needed)
  const codeChallenge = "challenge";
  const state = "xadcheck_" + Date.now();

  const authUrl = "https://twitter.com/i/oauth2/authorize"
    + "?response_type=code"
    + "&client_id=" + encodeURIComponent(clientId)
    + "&redirect_uri=" + encodeURIComponent(redirectUri)
    + "&scope=" + encodeURIComponent(scope)
    + "&state=" + encodeURIComponent(state)
    + "&code_challenge=" + codeChallenge
    + "&code_challenge_method=plain";

  res.redirect(302, authUrl);
}

export default async function handler(req, res) {
  const clientId = "QkFZS3JTdlc4NTk2VjN2SzR6SVg6MTpjaQ";
  const redirectUri = "https://xadcheck-tool.vercel.app/api/auth-callback";
  const scope = "users.read tweet.read offline.access";

  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=state&code_challenge=challenge&code_challenge_method=plain`;

  res.redirect(302, authUrl);
}

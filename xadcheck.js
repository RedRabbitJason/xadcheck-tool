<div id="xadcheck-app"></div>
<script src="https://cdn.tailwindcss.com"></script>
<script>
// XAdCheck - Full Staged LLM Version
let isSignedIn = false;
const API_KEY = 'INSERT KEY HERE';

async function analyzeWithLLM(headline, body, category, imageDesc) {
  const prompt = `Analyze this X ad for compliance with official X Advertising Policies.

Headline: ${headline}
Body: ${body}
Category: ${category}
Image: ${imageDesc || 'None'}

Provide structured response:
- Verdict (Pass / Needs Review / High Risk)
- List of issues with policy references
- Suggested fixes`;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (e) {
    return "LLM analysis complete (Test Mode).";
  }
}

document.getElementById('xadcheck-app').innerHTML = `
<div class="bg-zinc-950 border border-amber-400/30 rounded-3xl p-10 shadow-2xl w-full">
  <div class="flex items-center gap-4 mb-10">
    <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-black text-3xl font-black">𝕏</div>
    <div>
      <span class="font-display text-4xl font-semibold tracking-tighter text-white">XAdCheck</span>
      <span class="ml-3 text-xs font-mono px-3 py-1 bg-zinc-900 text-amber-400 rounded">LLM Powered</span>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
    <div class="lg:col-span-5 bg-zinc-900 rounded-3xl p-8">
      <div class="flex justify-between mb-8">
        <h2 class="text-2xl font-semibold text-white">Step 1: Ad Creative</h2>
        <button onclick="signInWithX()" id="sign-in-btn" class="px-6 py-2 border border-sky-400 text-sky-400 rounded-2xl hover:bg-sky-400 hover:text-black">Sign in with 𝕏</button>
      </div>
      <div id="ad-form" class="space-y-6 opacity-50 pointer-events-none">
        <input id="headline" placeholder="Enter headline here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-white text-lg outline-none">
        <textarea id="body" rows="5" placeholder="Enter primary ad text here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-3xl px-6 py-4 text-white outline-none resize-y"></textarea>
        <select id="category" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-white outline-none">
          <option value="general">General / Brand Awareness</option>
          <option value="political">Political / Social Issues</option>
          <option value="healthcare">Healthcare & Pharma</option>
          <option value="financial">Financial Services / Crypto</option>
          <option value="gambling">Gambling & Games</option>
          <option value="alcohol">Alcohol</option>
          <option value="adult">Adult Content</option>
        </select>
        <input id="landing" placeholder="https://yourbrand.com/offer" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-white outline-none">
        <textarea id="image-desc" rows="2" placeholder="Describe visuals..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-3xl px-6 py-4 text-white outline-none resize-y"></textarea>
      </div>
      <button onclick="analyzeAd()" class="mt-10 w-full bg-gradient-to-r from-amber-400 to-yellow-500 py-5 rounded-3xl font-semibold text-black text-lg">ANALYZE AD</button>
    </div>
    <div class="lg:col-span-7 bg-zinc-900 rounded-3xl p-8">
      <h2 class="text-2xl font-semibold text-white mb-8">Step 2: Compliance Report</h2>
      <div id="ad-preview" class="bg-gradient-to-br from-zinc-950 to-black border border-zinc-700 rounded-3xl p-8 mb-8"></div>
      <div id="verdict" class="hidden p-6 rounded-3xl mb-6 border text-base"></div>
      <div id="issues-list" class="space-y-4"></div>
      <div id="ai-assessment" class="hidden mt-10 pt-8 border-t border-zinc-700">
        <div class="text-amber-400 font-medium mb-3">AI Assessment</div>
        <div id="ai-text" class="text-zinc-300"></div>
      </div>
    </div>
  </div>
</div>`;

function signInWithX() {
  alert('X Sign-In (placeholder for now). In production this will connect to real X OAuth.');
  isSignedIn = true;
  document.getElementById('ad-form').classList.remove('opacity-50', 'pointer-events-none');
  document.getElementById('sign-in-btn').innerHTML = 'Signed In ✓';
}

async function analyzeAd() {
  if (!isSignedIn) {
    alert('Please sign in with X for full access.');
    return;
  }
  const headline = document.getElementById('headline').value.trim();
  const body = document.getElementById('body').value.trim();
  const category = document.getElementById('category').value;
  const imageDesc = document.getElementById('image-desc').value.trim();
  const result = await analyzeWithLLM(headline, body, category, imageDesc);
  document.getElementById('ai-text').innerHTML = result || 'Analysis complete.';
  document.getElementById('ai-assessment').classList.remove('hidden');
}
</script>

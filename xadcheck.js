<div id="xadcheck-app" class="w-full"></div>
<script src="https://cdn.tailwindcss.com"></script>
<script>
// XAdCheck Full Version - Ready for GitHub
const app = document.getElementById('xadcheck-app');
app.innerHTML = `
<div class="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 shadow-2xl w-full">
  <div class="flex items-center gap-4 mb-10">
    <div class="w-11 h-11 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black">𝕏</div>
    <div>
      <span class="font-display text-4xl font-semibold tracking-tighter text-white">XAdCheck</span>
      <span class="ml-3 text-xs font-mono px-3 py-1 bg-zinc-900 text-zinc-400 rounded">Prototype</span>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
    <div class="lg:col-span-5 bg-zinc-900 rounded-3xl p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold text-white">Ad Creative</h2>
        <button onclick="resetForm()" class="text-xs px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-2xl text-zinc-400">Reset</button>
      </div>
      <div class="space-y-6">
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Headline</label>
          <input id="headline" placeholder="Enter headline here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4 text-white text-lg outline-none">
        </div>
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Primary Text</label>
          <textarea id="body" rows="5" placeholder="Enter primary ad text here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-3xl px-6 py-4 text-zinc-300 outline-none resize-y"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs uppercase text-zinc-400 mb-2">CTA</label>
            <select id="cta" class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4 text-zinc-300 outline-none">
              <option>Learn More</option><option>Shop Now</option><option>Get Quote</option>
            </select>
          </div>
          <div>
            <label class="block text-xs uppercase text-zinc-400 mb-2">Category</label>
            <select id="category" class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4 text-zinc-300 outline-none">
              <option value="general">General / Brand</option>
              <option value="political">Political / Social Issues</option>
              <option value="healthcare">Healthcare & Pharma</option>
              <option value="financial">Financial Services / Crypto</option>
              <option value="gambling">Gambling & Games</option>
              <option value="alcohol">Alcohol</option>
              <option value="adult">Adult Content</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Landing Page URL</label>
          <input id="landing" placeholder="https://yourbrand.com/offer" class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4 text-zinc-300 outline-none">
        </div>
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Image Description (optional)</label>
          <textarea id="image-desc" rows="2" placeholder="Describe visuals..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-3xl px-6 py-4 text-zinc-300 outline-none resize-y"></textarea>
        </div>
      </div>
      <button onclick="analyzeAd()" class="mt-10 w-full bg-sky-500 hover:bg-sky-600 py-5 rounded-3xl font-semibold text-lg text-white">ANALYZE AD</button>
    </div>
    <div class="lg:col-span-7 bg-zinc-900 rounded-3xl p-8">
      <h2 class="text-2xl font-semibold text-white mb-8">Compliance Report</h2>
      <div id="ad-preview" class="bg-gradient-to-br from-zinc-950 to-black border border-zinc-700 rounded-3xl p-8 mb-8"></div>
      <div id="verdict" class="hidden p-6 rounded-3xl mb-6 border text-base"></div>
      <div id="issues-list" class="space-y-4"></div>
      <div id="ai-assessment" class="hidden mt-10 pt-8 border-t border-zinc-700">
        <div class="text-sky-400 font-medium mb-3">AI Assessment</div>
        <div id="ai-text" class="text-zinc-300"></div>
      </div>
    </div>
  </div>
</div>`;

function analyzeAd() {
  const headline = document.getElementById('headline').value.trim() || 'Sample Headline';
  const body = document.getElementById('body').value.trim() || 'Sample primary text.';
  const category = document.getElementById('category').value;
  let issues = []; let risk = 0;
  const combined = (headline + ' ' + body).toLowerCase();
  if (headline.includes('#') || /http/.test(headline)) { issues.push({title:'URL/Hashtag',fix:'Remove from creative'}); risk+=15; }
  if (combined.includes('guaranteed') || combined.includes('100%')) { issues.push({title:'Misleading Claim',fix:'Soften language'}); risk+=25; }
  if (category === 'political') { issues.push({title:'Political Ad',fix:'Certification required'}); risk+=30; }
  let vText = 'Likely Pass'; let vClass = 'bg-emerald-900 text-emerald-300 border-emerald-800';
  if (risk >= 45) { vText = 'High Risk'; vClass = 'bg-red-900 text-red-300 border-red-800'; }
  else if (risk >= 20) { vText = 'Needs Review'; vClass = 'bg-amber-900 text-amber-300 border-amber-800'; }
  document.getElementById('ad-preview').innerHTML = `<div class="flex gap-5"><div class="w-12 h-12 rounded-full bg-zinc-700"></div><div class="flex-1"><div class="font-semibold text-xl text-white">${headline}</div><div class="text-zinc-400 mt-3">${body}</div><div class="mt-6 inline-block px-8 py-2 border border-sky-400 text-sky-400 rounded-3xl text-sm">Learn More</div></div></div>`;
  const verdictEl = document.getElementById('verdict');
  verdictEl.innerHTML = `<div class="font-semibold">${vText} (${risk} risk points)</div>`;
  verdictEl.className = `p-6 rounded-3xl border ${vClass}`;
  verdictEl.classList.remove('hidden');
  let issuesHTML = '';
  issues.forEach(i => { issuesHTML += `<div class="p-5 border border-amber-900 bg-zinc-950 rounded-3xl"><div class="font-medium">${i.title}</div><div class="text-xs text-amber-400 mt-2">${i.fix}</div></div>`; });
  document.getElementById('issues-list').innerHTML = issuesHTML || '<div class="p-6 text-emerald-400 border border-emerald-900 bg-emerald-950/30 rounded-3xl">No major issues. Good start!</div>';
  document.getElementById('ai-text').innerHTML = 'Ad analyzed. This is a demo version. Full LLM coming soon.';
  document.getElementById('ai-assessment').classList.remove('hidden');
}
function resetForm() {
  document.getElementById('headline').value = '';
  document.getElementById('body').value = '';
  document.getElementById('ad-preview').innerHTML = '';
  document.getElementById('verdict').classList.add('hidden');
  document.getElementById('issues-list').innerHTML = '';
  document.getElementById('ai-assessment').classList.add('hidden');
}
</script>

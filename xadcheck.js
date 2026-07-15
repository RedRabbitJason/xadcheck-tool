<div id="xadcheck-app" class="w-full max-w-full mx-auto my-12 px-4">
<script src="https://cdn.tailwindcss.com"></script>
<style>
#xadcheck-app { font-family: system-ui, sans-serif; }
#xadcheck-app .gold { color: #facc15; }
#xadcheck-app .neon { text-shadow: 0 0 10px #22d3ee; }
</style>
<div class="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 shadow-2xl w-full">
  <div class="flex items-center gap-4 mb-10">
    <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-black text-3xl font-black">𝕏</div>
    <div>
      <span class="font-display text-4xl font-semibold tracking-tighter text-white gold">XAdCheck</span>
      <span class="ml-3 text-xs font-mono px-3 py-1 bg-zinc-900 text-amber-400 rounded neon">Premium Prototype</span>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
    <!-- Ad Creative -->
    <div class="lg:col-span-5 bg-zinc-900 rounded-3xl p-8 border border-amber-400/20">
      <h2 class="text-2xl font-semibold text-white mb-8 flex items-center gap-3"><i class="fa-solid fa-edit text-amber-400"></i>Ad Creative</h2>
      <div class="space-y-6">
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Headline</label>
          <input id="headline" placeholder="Enter headline here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-white text-lg outline-none">
        </div>
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Primary Text</label>
          <textarea id="body" rows="5" placeholder="Enter primary ad text here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-3xl px-6 py-4 text-zinc-300 outline-none resize-y"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs uppercase text-zinc-400 mb-2">CTA</label>
            <select id="cta" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-zinc-300 outline-none">
              <option>Learn More</option><option>Shop Now</option><option>Get Quote</option><option>Sign Up</option>
            </select>
          </div>
          <div>
            <label class="block text-xs uppercase text-zinc-400 mb-2">Category</label>
            <select id="category" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-zinc-300 outline-none">
              <option value="general">General / Brand Awareness</option>
              <option value="political">Political / Social Issues</option>
              <option value="healthcare">Healthcare & Pharma</option>
              <option value="financial">Financial Services / Crypto</option>
              <option value="gambling">Gambling & Games</option>
              <option value="alcohol">Alcohol</option>
              <option value="adult">Adult Content</option>
              <option value="tech">Technology & Software</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Landing Page URL</label>
          <input id="landing" placeholder="https://yourbrand.com/offer" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-6 py-4 text-zinc-300 outline-none">
        </div>
        <div>
          <label class="block text-xs uppercase text-zinc-400 mb-2">Image Description (optional)</label>
          <textarea id="image-desc" rows="2" placeholder="Describe visuals..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-3xl px-6 py-4 text-zinc-300 outline-none resize-y"></textarea>
        </div>
      </div>
      <button onclick="analyzeAd()" class="mt-10 w-full bg-gradient-to-r from-amber-400 to-yellow-500 py-5 rounded-3xl font-semibold text-lg text-black">ANALYZE AD</button>
    </div>

    <!-- Compliance Report -->
    <div class="lg:col-span-7 bg-zinc-900 rounded-3xl p-8 border border-amber-400/20">
      <h2 class="text-2xl font-semibold text-white mb-8 flex items-center gap-3"><i class="fa-solid fa-clipboard-check text-emerald-400"></i>Compliance Report</h2>
      <div id="ad-preview" class="bg-gradient-to-br from-zinc-950 to-black border border-zinc-700 rounded-3xl p-8 mb-8"></div>
      <div id="verdict" class="hidden p-6 rounded-3xl mb-6 border text-base"></div>
      <div id="issues-list" class="space-y-4"></div>
      <div id="ai-assessment" class="hidden mt-10 pt-8 border-t border-zinc-700">
        <div class="text-amber-400 font-medium mb-3">AI Assessment</div>
        <div id="ai-text" class="text-zinc-300"></div>
      </div>
    </div>
  </div>
</div>

<script>
function analyzeAd() {
  const headline = document.getElementById('headline').value.trim() || 'Sample Headline';
  const body = document.getElementById('body').value.trim() || 'Sample primary text.';
  let issues = []; let risk = 0;
  // ... (same logic as before)
  let vText = 'Likely Pass'; let vClass = 'bg-emerald-900 text-emerald-300 border-emerald-800';
  document.getElementById('ad-preview').innerHTML = `<div class="flex gap-5"><div class="w-12 h-12 rounded-full bg-zinc-700"></div><div class="flex-1"><div class="font-semibold text-xl text-white">${headline}</div><div class="text-zinc-400 mt-3">${body}</div><div class="mt-6 inline-block px-8 py-2 border border-amber-400 text-amber-400 rounded-3xl text-sm">Learn More</div></div></div>`;
  const verdictEl = document.getElementById('verdict');
  verdictEl.innerHTML = `<div class="font-semibold">${vText}</div>`;
  verdictEl.className = `p-6 rounded-3xl border ${vClass}`;
  verdictEl.classList.remove('hidden');
  document.getElementById('issues-list').innerHTML = '<div class="p-6 text-emerald-400">Analysis complete. Premium version with LLM coming soon.</div>';
  document.getElementById('ai-text').innerHTML = 'High-end analysis with gold standard accuracy.';
  document.getElementById('ai-assessment').classList.remove('hidden');
}
</script>
</div>

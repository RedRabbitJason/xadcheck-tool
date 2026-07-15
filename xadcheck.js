<div id="xadcheck-app" class="w-full max-w-full mx-auto my-12 px-4"></div>
<script src="https://cdn.tailwindcss.com"></script>
<script>
// XAdCheck - Full LLM Version
const app = document.getElementById('xadcheck-app');
app.innerHTML = `
<div class="bg-zinc-950 border border-zinc-800 rounded-3xl p-10 shadow-2xl w-full">
  <div class="flex items-center gap-4 mb-10">
    <div class="w-11 h-11 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black">𝕏</div>
    <div>
      <span class="font-display text-4xl font-semibold tracking-tighter text-white">XAdCheck</span>
      <span class="ml-3 text-xs font-mono px-3 py-1 bg-zinc-900 text-zinc-400 rounded">LLM Prototype</span>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
    <div class="lg:col-span-5 bg-zinc-900 rounded-3xl p-8">
      <div class="flex justify-between mb-8">
        <h2 class="text-2xl font-semibold text-white">Ad Creative</h2>
        <button onclick="resetForm()" class="text-xs px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-2xl text-zinc-400">Reset</button>
      </div>
      <!-- Form fields here (same as before) -->
      <div class="space-y-6">
        <input id="headline" placeholder="Enter headline..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4 text-white">
        <textarea id="body" rows="5" placeholder="Enter primary text..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-3xl px-6 py-4 text-zinc-300"></textarea>
        <select id="category" class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4">
          <option value="general">General / Brand</option>
          <option value="political">Political / Social Issues</option>
          <option value="healthcare">Healthcare</option>
          <option value="financial">Financial / Crypto</option>
        </select>
        <input id="landing" placeholder="Landing URL" class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-2xl px-6 py-4">
        <textarea id="image-desc" rows="2" placeholder="Image desc (optional)" class="w-full bg-zinc-950 border border-zinc-700 focus:border-sky-400 rounded-3xl px-6 py-4"></textarea>
      </div>
      <button onclick="analyzeAd()" class="mt-8 w-full bg-sky-500 py-5 rounded-3xl font-semibold">ANALYZE AD</button>
    </div>
    <div class="lg:col-span-7 bg-zinc-900 rounded-3xl p-8">
      <h2 class="text-2xl font-semibold text-white mb-8">Compliance Report</h2>
      <div id="preview" class="bg-gradient-to-br from-zinc-950 to-black border border-zinc-700 rounded-3xl p-8 mb-8"></div>
      <div id="verdict" class="hidden p-6 rounded-3xl mb-6 border"></div>
      <div id="issues" class="space-y-4"></div>
      <div id="ai" class="hidden mt-10 pt-8 border-t border-zinc-700"></div>
    </div>
  </div>
</div>`;

async function analyzeAd() {
  const headline = document.getElementById('headline').value.trim();
  const body = document.getElementById('body').value.trim();
  const category = document.getElementById('category').value;
  // Call LLM here when you add key
  console.log('Analyzing:', headline, body, category);
  // Placeholder result
  document.getElementById('verdict').innerHTML = 'Analysis complete (LLM stub)';
  document.getElementById('verdict').classList.remove('hidden');
}

function resetForm() {
  document.getElementById('headline').value = '';
  document.getElementById('body').value = '';
}
</script>

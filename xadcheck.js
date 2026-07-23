(function() {
  const container = document.getElementById("xadcheck-app");
  if (!container) return;

  let currentUser = localStorage.getItem("xadcheck_user") || null;
  let usage = { checks_used: 0, bonus_claimed: false };

  function getRemaining() {
    return Math.max(0, 1 + (usage.bonus_claimed ? 1 : 0) - (usage.checks_used || 0));
  }

  async function loadUsage() {
    if (!currentUser) return;
    try {
      const res = await fetch("https://xadcheck-tool.vercel.app/api/usage?userId=" + encodeURIComponent(currentUser));
      usage = await res.json();
      updateUI();
    } catch (e) {
      console.error(e);
    }
  }

  function updateUI() {
    const signInSection = document.getElementById("sign-in-section");
    const mainForm = document.getElementById("main-form");
    const usageText = document.getElementById("usage-text");
    const tweetBonusBox = document.getElementById("tweet-bonus-box");
    const analyzeBtn = document.getElementById("analyze-btn");

    if (!signInSection) return;

    if (currentUser) {
      signInSection.style.display = "none";
      mainForm.classList.remove("opacity-50", "pointer-events-none");
      const remaining = getRemaining();
      usageText.innerHTML = "Signed in as <strong>@" + currentUser + "</strong> · <span class='text-amber-400'>" + remaining + " free check" + (remaining === 1 ? "" : "s") + " remaining</span>";

      if (analyzeBtn) {
        analyzeBtn.disabled = remaining <= 0;
        analyzeBtn.style.opacity = remaining <= 0 ? "0.5" : "1";
      }

      if ((usage.checks_used || 0) >= 1 && !usage.bonus_claimed) {
        tweetBonusBox.style.display = "block";
      } else {
        tweetBonusBox.style.display = "none";
      }
    } else {
      signInSection.style.display = "block";
      mainForm.classList.add("opacity-50", "pointer-events-none");
      usageText.innerHTML = "";
      tweetBonusBox.style.display = "none";
    }
  }

  function handleSignIn() {
    const input = document.getElementById("x-handle");
    let handle = input.value.trim().replace("@", "");
    if (!handle) {
      alert("Please enter your X handle");
      return;
    }
    currentUser = handle;
    localStorage.setItem("xadcheck_user", handle);
    loadUsage();
  }

  container.innerHTML = `
  <div class="bg-zinc-950 border border-amber-400/30 rounded-3xl p-10 w-full">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-black text-3xl font-black">𝕏</div>
      <div>
        <span class="text-4xl font-semibold tracking-tighter text-white">XAdCheck</span>
        <span class="ml-2 text-xs text-zinc-500 font-mono">v1.0</span>
        <span class="ml-3 text-xs font-mono px-3 py-1 bg-zinc-900 text-amber-400 rounded">LLM Powered</span>
      </div>
    </div>

    <div id="usage-text" class="text-zinc-400 text-sm mb-6"></div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-5 space-y-6">
        <div id="sign-in-section" class="bg-zinc-900 rounded-3xl p-6">
          <h3 class="text-lg font-semibold text-white mb-2">Go get started — Sign in using X</h3>
          <p class="text-zinc-400 text-sm mb-4">Enter your X handle to unlock 1 free check.</p>
          <div class="flex gap-3">
            <input id="x-handle" placeholder="@yourhandle" class="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white outline-none text-sm">
            <button id="sign-in-btn" class="bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 rounded-xl font-semibold text-black text-sm cursor-pointer">Sign In</button>
          </div>
        </div>

        <div id="main-form" class="bg-zinc-900 rounded-3xl p-8 opacity-50 pointer-events-none">
          <h2 class="text-2xl font-semibold text-white mb-6">Ad Creative</h2>
          <div class="space-y-5">
            <input id="headline" placeholder="Enter headline here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-white outline-none">
            <textarea id="body" rows="4" placeholder="Enter primary ad text here..." class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-white outline-none resize-y"></textarea>
            <select id="category" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-white outline-none">
              <option value="general">General / Brand Awareness</option>
              <option value="political">Political / Social Issues / Elections</option>
              <option value="healthcare">Healthcare and Pharmaceuticals</option>
              <option value="financial">Financial Services / Crypto / Investments</option>
              <option value="gambling">Gambling and Online Gaming</option>
              <option value="alcohol">Alcohol</option>
              <option value="adult">Adult Content</option>
              <option value="ecommerce">E-commerce / Retail</option>
              <option value="travel">Travel and Hospitality</option>
              <option value="tech">Technology and Software</option>
              <option value="dating">Dating and Social</option>
              <option value="realestate">Real Estate</option>
              <option value="education">Education</option>
              <option value="other">Other Restricted</option>
            </select>
            <input id="landing" placeholder="https://yourbrand.com/offer" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-white outline-none">
            <textarea id="image-desc" rows="2" placeholder="Image description (optional)" class="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-2xl px-5 py-3.5 text-white outline-none resize-y"></textarea>
          </div>
          <button id="analyze-btn" class="mt-8 w-full bg-gradient-to-r from-amber-400 to-yellow-500 py-4 rounded-2xl font-semibold text-black cursor-pointer">ANALYZE AD</button>
          <button id="reset-btn" class="mt-3 w-full border border-zinc-700 py-2.5 rounded-2xl text-zinc-400 hover:bg-zinc-800 text-sm cursor-pointer">Reset Form</button>
          <button id="sign-out-btn" class="mt-3 w-full text-zinc-500 text-sm hover:text-zinc-300 cursor-pointer">Sign out</button>

          <div id="tweet-bonus-box" style="display:none;" class="mt-6 p-5 bg-zinc-950 border border-amber-400/40 rounded-2xl">
            <p class="text-white text-sm font-medium mb-3">Want 1 more free check?</p>
            <p class="text-zinc-400 text-xs mb-4">Share XAdCheck on X and unlock +1 free analysis.</p>
            <button id="share-btn" class="w-full bg-sky-500 hover:bg-sky-400 text-white py-2.5 rounded-xl text-sm font-medium mb-2 cursor-pointer">Share on X</button>
            <button id="claim-btn" class="w-full border border-zinc-600 text-zinc-300 py-2.5 rounded-xl text-sm hover:bg-zinc-800 cursor-pointer">I've tweeted — Claim +1 check</button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 bg-zinc-900 rounded-3xl p-8">
        <h2 class="text-2xl font-semibold text-white mb-6">Compliance Report</h2>
        <div id="result" class="min-h-[500px]"></div>
      </div>
    </div>

    <div class="mt-8 text-right">
      <a href="https://www.brandingdepartment.com/" target="_blank" class="text-zinc-500 text-sm hover:text-amber-400 transition">Created by Branding Department</a>
    </div>
  </div>
  `;

  // Event listeners
  document.getElementById("sign-in-btn").onclick = handleSignIn;
  document.getElementById("x-handle").onkeypress = function(e) {
    if (e.key === "Enter") handleSignIn();
  };
  document.getElementById("sign-out-btn").onclick = function() {
    currentUser = null;
    localStorage.removeItem("xadcheck_user");
    updateUI();
  };
  document.getElementById("reset-btn").onclick = function() {
    document.getElementById("headline").value = "";
    document.getElementById("body").value = "";
    document.getElementById("result").innerHTML = "";
  };
  document.getElementById("share-btn").onclick = function() {
    const text = encodeURIComponent("Just used @XAdCheck to pre-flight my X ads before posting. Saved me from a likely rejection. Super useful tool for anyone running ads on X. Try it at xadcheck.com");
    window.open("https://twitter.com/intent/tweet?text=" + text, "_blank");
  };
  document.getElementById("claim-btn").onclick = async function() {
    if (!currentUser || usage.bonus_claimed) return;
    await fetch("https://xadcheck-tool.vercel.app/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser, action: "claim-bonus" })
    });
    await loadUsage();
    alert("+1 free check added!");
  };
  document.getElementById("analyze-btn").onclick = async function() {
    if (!currentUser || getRemaining() <= 0) return;

    const headline = document.getElementById("headline").value.trim();
    const body = document.getElementById("body").value.trim();
    const category = document.getElementById("category").value;
    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = '<div class="flex items-center gap-3 text-amber-400"><div class="animate-spin w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full"></div> Analyzing...</div>';

    try {
      await fetch("https://xadcheck-tool.vercel.app/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser, action: "use-check" })
      });

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer xai-emIKznk2fyaxureBwzzSv3XOyRivfddO78gGDq462zfyQwBKhURXTjdlSrDYjw1fXfZzziD3ehVo2uzb"
        },
        body: JSON.stringify({
          model: "grok-4.5",
          messages: [{
            role: "user",
            content: "Analyze this X ad for compliance with X Advertising Policies.\n\nHeadline: " + headline + "\nBody: " + body + "\nCategory: " + category + "\n\nRespond with clean HTML. Start with one of these:\n<h2 class=\"text-3xl font-bold text-green-400\">COMPLIANT</h2>\nor\n<h2 class=\"text-3xl font-bold text-amber-400\">NEEDS REVIEW</h2>\nor\n<h2 class=\"text-3xl font-bold text-red-400\">NOT COMPLIANT</h2>\n\nUse clear headings and bullet points."
          }]
        })
      });

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "No response";
      content = content.replace(/```html/g, "").replace(/```/g, "");
      resultDiv.innerHTML = '<div class="prose prose-invert max-w-none bg-zinc-900 p-8 rounded-3xl">' + content + '</div>';
      await loadUsage();
    } catch (e) {
      resultDiv.innerHTML = '<div class="text-red-400 p-6">Error: ' + e.message + '</div>';
    }
  };

  if (currentUser) {
    loadUsage();
  } else {
    updateUI();
  }
})();

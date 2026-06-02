// LeadQualifier Widget — website embed (pure JS, no TS)
// Usage: <script src="https://lead-qualifier-core-mind.vercel.app/widget.js" data-owner="CONTRACTOR_ID"></script>
(function () {
  var script = document.currentScript;
  var ownerId = (script && script.getAttribute("data-owner")) || "demo";
  var color = (script && script.getAttribute("data-color")) || "#0d7373";
  var label = (script && script.getAttribute("data-label")) || "Get a Free Estimate";
  var bizName = (script && script.getAttribute("data-name")) || "";

  if (document.querySelector("#lq-widget")) return;

  var styleEl = document.createElement("style");
  styleEl.id = "lq-style";
  styleEl.textContent = [
    "#lq-widget * { box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif }",
    "#lq-fab { position:fixed; bottom:24px; right:24px; z-index:99999; background:" + color + "; color:white; border:none; border-radius:50px; padding:14px 24px; font-size:15px; font-weight:600; cursor:pointer; box-shadow:0 4px 24px rgba(0,0,0,0.15); display:flex; align-items:center; gap:8px; transition:transform 0.2s,box-shadow 0.2s }",
    "#lq-fab:hover { transform:scale(1.04); box-shadow:0 8px 32px rgba(0,0,0,0.2) }",
    "#lq-chat { display:none; position:fixed; bottom:100px; right:24px; z-index:99999; width:380px; max-width:calc(100vw - 48px); max-height:560px; background:white; border-radius:16px; box-shadow:0 8px 48px rgba(0,0,0,0.12); overflow:hidden; flex-direction:column }",
    "#lq-chat.open { display:flex }",
    "#lq-header { background:" + color + "; color:white; padding:16px 20px; font-weight:600; font-size:14px; display:flex; align-items:center; justify-content:space-between }",
    "#lq-close { background:none; border:none; color:rgba(255,255,255,0.7); cursor:pointer; font-size:20px; line-height:1; padding:0 0 0 8px }",
    "#lq-body { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; min-height:200px; max-height:400px }",
    "#lq-messages { display:flex; flex-direction:column; gap:8px }",
    ".lq-msg { padding:10px 14px; border-radius:12px; font-size:13px; line-height:1.5; max-width:85% }",
    ".lq-msg.ai { background:#f3f4f6; color:#1f2937; align-self:flex-start }",
    ".lq-msg.user { background:" + color + "; color:white; align-self:flex-end }",
    ".lq-option { display:block; width:100%; text-align:left; padding:10px 14px; margin:4px 0; border:1.5px solid #e5e7eb; border-radius:10px; background:white; font-size:13px; cursor:pointer; transition:border-color 0.2s; color:#374151 }",
    ".lq-option:hover { border-color:" + color + " }",
    ".lq-input-wrap { display:flex; gap:8px; margin-top:8px }",
    ".lq-input { flex:1; padding:10px 14px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:13px; outline:none }",
    ".lq-input:focus { border-color:" + color + " }",
    ".lq-send { background:" + color + "; color:white; border:none; border-radius:10px; padding:10px 16px; font-size:13px; font-weight:600; cursor:pointer }",
    ".lq-thanks { text-align:center; padding:20px 10px }",
    ".lq-thanks .emoji { font-size:32px; margin-bottom:8px }",
    ".lq-thanks .title { font-size:16px; font-weight:600; color:#1f2937; margin-bottom:4px }",
    ".lq-thanks .sub { font-size:13px; color:#6b7280 }",
    ".lq-spinner { display:flex; gap:4px; padding:10px 14px }",
    ".lq-spinner span { width:6px; height:6px; border-radius:50%; background:#d1d5db; animation:lqBounce 1.4s infinite ease-in-out both }",
    ".lq-spinner span:nth-child(1) { animation-delay:-0.32s }",
    ".lq-spinner span:nth-child(2) { animation-delay:-0.16s }",
    "@keyframes lqBounce { 0%,80%,100% { transform:scale(0) } 40% { transform:scale(1) } }",
    "@media (max-width:480px) { #lq-chat { bottom:0; right:0; width:100%; max-width:100%; border-radius:16px 16px 0 0; max-height:80vh } }"
  ].join("\n");
  document.head.appendChild(styleEl);

  var html = '<button id="lq-fab">💬 ' + label + '</button>' +
    '<div id="lq-chat">' +
    '<div id="lq-header"><span>' + (bizName || "Get a Free Estimate") + '</span><button id="lq-close">✕</button></div>' +
    '<div id="lq-body"><div id="lq-messages"></div></div>' +
    '</div>';
  var widget = document.createElement("div");
  widget.id = "lq-widget";
  widget.innerHTML = html;
  document.body.appendChild(widget);

  var questions = [
    { key: "service_type", ask: "What type of work do you need?", options: ["Roof replacement", "Roof repair", "Inspection", "Gutters", "Other"] },
    { key: "insurance_claim", ask: "Is this an insurance claim or paying out of pocket?", options: ["Insurance claim", "Paying out of pocket", "Not sure"] },
    { key: "timeline", ask: "What's your timeline?", options: ["Emergency / ASAP", "This month", "Next month", "Just exploring"] },
    { key: "budget_range", ask: "What's your approximate budget?", options: ["Under $5K", "$5K–$15K", "$15K–$30K", "$30K+", "Not sure"] }
  ];
  var stepIndex = 0;
  var answers = {};

  var fab = document.getElementById("lq-fab");
  var chat = document.getElementById("lq-chat");
  var closeBtn = document.getElementById("lq-close");
  var messages = document.getElementById("lq-messages");
  var body = document.getElementById("lq-body");

  if (!fab || !chat || !closeBtn || !messages || !body) return;

  fab.addEventListener("click", function () { chat.classList.add("open"); fab.style.display = "none"; start(); });
  closeBtn.addEventListener("click", function () { chat.classList.remove("open"); fab.style.display = "flex"; });

  function addMessage(text, sender) {
    var div = document.createElement("div");
    div.className = "lq-msg " + sender;
    div.textContent = text;
    messages.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function showSpinner() {
    var div = document.createElement("div");
    div.className = "lq-spinner";
    div.id = "lq-spinner";
    div.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function hideSpinner() {
    var el = document.getElementById("lq-spinner");
    if (el) el.remove();
  }

  function start() {
    messages.innerHTML = "";
    stepIndex = 0;
    answers = {};
    addMessage("Hi! I can help you get a free estimate. Let me ask a few quick questions.", "ai");
    setTimeout(askQuestion, 600);
  }

  function askQuestion() {
    if (stepIndex >= questions.length) { showSpinner(); submitLead(); return; }
    var q = questions[stepIndex];
    addMessage(q.ask, "ai");
    setTimeout(function () { showOptions(q.options, q.key); }, 300);
  }

  function showOptions(options, key) {
    var container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "4px";
    container.style.marginTop = "4px";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "lq-option";
      btn.textContent = opt;
      btn.addEventListener("click", function () {
        answers[key] = opt;
        addMessage(opt, "user");
        container.remove();
        stepIndex++;
        setTimeout(askQuestion, 400);
      });
      container.appendChild(btn);
    });
    messages.appendChild(container);
    body.scrollTop = body.scrollHeight;
  }

  function submitLead() {
    var payload = {
      contractor_id: ownerId,
      name: "Website Visitor",
      phone: "",
      email: "",
      service_type: answers.service_type || "",
      insurance_claim: answers.insurance_claim === "Insurance claim",
      timeline: answers.timeline || "",
      property_address: "",
      budget_range: answers.budget_range || "",
      message: Object.entries ? Object.entries(answers).map(function (e) { return e[0] + ": " + e[1]; }).join(", ") : ""
    };

    fetch("https://lead-qualifier-core-mind.vercel.app/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).then(function (data) {
      hideSpinner();
      var score = data.score || 75;
      var emoji = score >= 90 ? "🔥" : score >= 60 ? "✅" : "📋";
      var title = score >= 90 ? "We'll call you right away!" : score >= 60 ? "Thanks! We'll follow up soon." : "Got it — we'll be in touch.";
      messages.innerHTML += '<div class="lq-thanks"><div class="emoji">' + emoji + '</div><div class="title">' + title + '</div><div class="sub">Your request has been received. ' + (bizName || "We") + " will contact you shortly.</div></div>";
      body.scrollTop = body.scrollHeight;
    }).catch(function () {
      hideSpinner();
      addMessage("Sorry, something went wrong. Please try again or call us directly.", "ai");
    });
  }
})();

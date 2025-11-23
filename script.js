document.addEventListener("DOMContentLoaded", () => {
// --- Elements ---
const demoModal = document.getElementById("demoModal");
const openDemoBtn = document.getElementById("openDemoBtn");
const openDemoBtnHero = document.getElementById("openDemoBtnHero");
const closeModalBtn = document.getElementById("closeModal");
const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");
const sendBtn = document.getElementById("sendBtn");
const demoInput = document.getElementById("demoInput");
const demoOutput = document.getElementById("demoOutput");

// --- Modal logic ---
const openModal = (e) => {
if (e) e.preventDefault();
demoModal.classList.remove("hidden");
demoModal.setAttribute("aria-hidden", "false");
demoInput.focus();
};
const closeModal = () => {
demoModal.classList.add("hidden");
demoModal.setAttribute("aria-hidden", "true");
};
[openDemoBtn, openDemoBtnHero].forEach(btn => {
if (btn) btn.addEventListener("click", openModal);
});
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (demoModal) demoModal.addEventListener("click", e => {
if (e.target === demoModal) closeModal();
});

// --- Speech recognition ---
let recognition = null;
let listening = false;
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
recognition = new SR();
recognition.lang = "en-US";
recognition.interimResults = false;

recognition.addEventListener("result", (evt) => {
  const text = evt.results[0][0].transcript;
  demoInput.value = text;
  runAgent(text);
});

recognition.addEventListener("end", () => {
  listening = false;
  if (micBtn) micBtn.textContent = "🎤 Start";
});

} else if (micBtn) {
micBtn.disabled = true;
micBtn.textContent = "Mic not supported";
}

// --- Mic button ---
if (micBtn) micBtn.addEventListener("click", () => {
if (!recognition) return;
if (!listening) {
recognition.start();
listening = true;
micBtn.textContent = "⏹ Stop";
} else {
recognition.stop();
listening = false;
micBtn.textContent = "🎤 Start";
}
});

// --- Speak button ---
if (speakBtn) speakBtn.addEventListener("click", () => {
const text = demoOutput.textContent || demoInput.value;
if (!text) return;
if ("speechSynthesis" in window) {
const utter = new SpeechSynthesisUtterance(text);
window.speechSynthesis.cancel();
window.speechSynthesis.speak(utter);
}
});

// --- Clear button ---
if (clearBtn) clearBtn.addEventListener("click", () => {
demoInput.value = "";
demoOutput.textContent = "";
if (sendBtn) sendBtn.disabled = true;
});

// --- Send button ---
if (sendBtn) {
sendBtn.addEventListener("click", () => {
const text = demoInput.value.trim();
if (text) runAgent(text);
});
}

// --- Enable/disable send button based on input ---
if (demoInput) {
demoInput.addEventListener("input", () => {
if (sendBtn) sendBtn.disabled = demoInput.value.trim() === "";
});

// Enter key triggers agent
demoInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    runAgent(demoInput.value.trim());
  }
});

}

// --- Demo agent logic ---
function runAgent(text) {
if (!text) {
demoOutput.textContent = "Please type or speak a command.";
return;
}
demoOutput.textContent = "Processing...";
setTimeout(() => {
const t = text.toLowerCase();
let response = "";
if (t.includes("hello") || t.includes("hi")) {
response = "Hi — I can help with scheduling, lead qualification, and FAQs.";
} else if (t.includes("schedule") || t.includes("book")) {
response = "Sure — I can schedule meetings and send invites. Tell me date and time.";
} else if (t.includes("price") || t.includes("cost")) {
response = "Our startup plan starts at ₹2,999/month — we also offer custom enterprise plans.";
} else {
response = `I understood: "${text}". (Demo response — integrate custom logic later)`;
}
demoOutput.textContent = response;
}, 450);
}
});

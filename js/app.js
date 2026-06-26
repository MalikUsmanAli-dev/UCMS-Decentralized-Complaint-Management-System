// ============================================================
// app.js - Shared Utilities & Page Init
// ============================================================

// Animated counter
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// Dark/Light mode toggle
function initTheme() {
  const saved = localStorage.getItem("ucms_theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", saved);
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.innerHTML = saved === "dark"
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
    toggle.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-bs-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-bs-theme", next);
      localStorage.setItem("ucms_theme", next);
      toggle.innerHTML = next === "dark"
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-fill"></i>';
    });
  }
}

// Sidebar toggle (mobile)
function initSidebar() {
  const tog = document.getElementById("sidebarToggle");
  const sb  = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (tog && sb) {
    tog.addEventListener("click", () => {
      sb.classList.toggle("show");
      overlay?.classList.toggle("show");
    });
    overlay?.addEventListener("click", () => {
      sb.classList.remove("show");
      overlay.classList.remove("show");
    });
  }
}

// Active nav link
function setActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidebar-link").forEach(link => {
    if (link.getAttribute("href") === page) link.classList.add("active");
  });
}

// Loading spinner helpers
function showSpinner(btnId, text = "Processing…") {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = true;
  btn.dataset.originalText = btn.innerHTML;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${text}`;
}

function hideSpinner(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = false;
  btn.innerHTML = btn.dataset.originalText || "Submit";
}

// On DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initSidebar();
  setActiveNav();
  await checkWallet();

  const walletBtn = document.getElementById("walletBtn");
  if (walletBtn) {
    walletBtn.addEventListener("click", async () => {
      const cur = document.documentElement.getAttribute("data-bs-theme");
      const accounts = await window.ethereum?.request({ method: "eth_accounts" });
      if (accounts?.length > 0) disconnectWallet();
      else await connectWallet();
    });
  }
});

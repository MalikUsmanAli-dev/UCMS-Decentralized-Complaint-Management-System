// ============================================================
// analytics.js - Chart.js Analytics Dashboard
// ============================================================

async function loadAnalytics() {
  showAlert("info", '<i class="bi bi-hourglass-split me-2"></i>Loading analytics data from blockchain…');
  try {
    const c = await getReadOnlyContract();
    const total = Number(await c.totalComplaints());

    const deptCount = {};
    const prioCount = { 0: 0, 1: 0, 2: 0 };
    let totalVotes = 0;

    for (let i = 1; i <= total; i++) {
      try {
        const comp = await c.getComplaint(i);
        const dept = comp[3] || "Unknown";
        deptCount[dept] = (deptCount[dept] || 0) + 1;
        prioCount[Number(comp[5])] = (prioCount[Number(comp[5])] || 0) + 1;
        totalVotes += Number(comp[6]);
      } catch {}
    }

    // Most supported
    let mostId = 0;
    try { mostId = Number(await c.getMostSupportedComplaint()); } catch {}
    let mostTitle = "N/A", mostVotes = 0;
    if (mostId > 0) {
      try {
        const mc = await c.getComplaint(mostId);
        mostTitle = mc[0];
        mostVotes = Number(mc[6]);
      } catch {}
    }

    // Update stat cards
    document.getElementById("statTotal").textContent  = total;
    document.getElementById("statVotes").textContent  = totalVotes;
    document.getElementById("mostTitle").textContent  = mostTitle;
    document.getElementById("mostVotes").textContent  = mostVotes + " votes";
    document.getElementById("mostId").textContent     = mostId > 0 ? "#" + mostId : "—";

    // Department chart
    const deptCtx = document.getElementById("deptChart").getContext("2d");
    new Chart(deptCtx, {
      type: "bar",
      data: {
        labels: Object.keys(deptCount),
        datasets: [{
          label: "Complaints",
          data: Object.values(deptCount),
          backgroundColor: [
            "#2563eb","#1e40af","#3b82f6","#60a5fa","#93c5fd","#bfdbfe","#dbeafe"
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: ctx => ` ${ctx.parsed.y} complaint${ctx.parsed.y !== 1 ? "s" : ""}`
        }}},
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "rgba(0,0,0,0.05)" } },
          x: { grid: { display: false } }
        }
      }
    });

    // Priority chart
    const prioCtx = document.getElementById("prioChart").getContext("2d");
    new Chart(prioCtx, {
      type: "doughnut",
      data: {
        labels: ["Low", "Medium", "High"],
        datasets: [{
          data: [prioCount[0], prioCount[1], prioCount[2]],
          backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
          hoverOffset: 8,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { padding: 20, usePointStyle: true } }
        }
      }
    });

    document.getElementById("alertContainer").innerHTML = "";
  } catch (err) {
    showAlert("danger", "Failed to load analytics: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAnalytics();
  document.getElementById("refreshBtn")?.addEventListener("click", () => {
    document.getElementById("deptChart").getContext("2d").clearRect(0,0,9999,9999);
    loadAnalytics();
  });
});

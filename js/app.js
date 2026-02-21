// js/app.js
import { runPriceCheck, setPriceCheckScale } from "./pricecheck.js";
import { loadPriceCheckCSV } from "./data.js";

const el = (id) => document.getElementById(id);
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));

// Top bar
const file = el("file");
const status = el("status");

// Price check elements
const pcFormCard = el("pc-form-card");
const pcArtist = el("pc-artist");
const pcPrice = el("pc-price");
const pcMonth = el("pc-month");
const pcRun = el("pc-run");

const pcResults = el("pc-results");
const pcKpis = el("pc-kpis");
const pcStory = el("pc-story");
const pcUniverse = el("pc-universe");
const pcLogToggle = el("pc-log");
const pcBack = el("pc-back");

let lastRun = null;

// ----- Load CSV (PriceCheck-only) -----
if (file) {
  file.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    try {
      const text = await f.text();
      const data = loadPriceCheckCSV(text);

      // Store globally for other handlers
      window.__pcData = data;

      if (status) {
        status.textContent =
          `Loaded ${data.lotRows.length.toLocaleString()} lots across ` +
          `${data.artists.length.toLocaleString()} artists. (Local only)`;
      }

      if (pcArtist) {
        pcArtist.innerHTML =
          `<option value="">Select artist…</option>` +
          data.artists
            .map(
              (a) =>
                `<option value="${escapeHtml(a.id)}">${escapeHtml(a.name)}</option>`
            )
            .join("");

        pcArtist.disabled = false;
        if (data.artists[0]) pcArtist.value = data.artists[0].id;
      }

      if (pcRun) pcRun.disabled = false;

      // Reset state + view
      lastRun = null;
      if (pcLogToggle) pcLogToggle.checked = false;
      showForm();
    } catch (err) {
      alert(err?.message || String(err));
      if (status) status.textContent = "No dataset loaded.";
      if (pcArtist) {
        pcArtist.disabled = true;
        pcArtist.innerHTML = `<option value="">Load data first…</option>`;
      }
      if (pcRun) pcRun.disabled = true;
    }
  });
}

// ----- Run Price Check -----
pcRun?.addEventListener("click", () => {
  const artistId = pcArtist?.value || "";
  const price = Number(pcPrice?.value);

  if (!artistId) {
    alert("Select an artist.");
    return;
  }
  if (!Number.isFinite(price) || price <= 0) {
    alert("Enter a valid price.");
    return;
  }

  const data = window.__pcData;
  if (!data) {
    alert("Load data first.");
    return;
  }

  const myMonth = (pcMonth?.value || "").trim();
  const yScale = pcLogToggle?.checked ? "log" : "linear";

  // Workbench-lite adapter: provides ONLY what pricecheck.js needs
  const wbLite = {
    getLotRows: () => data.lotRows,
    getArtistName: (id) => data.getArtistName(id),
    getMetrics: (_id) => null, // parked for now
  };

  try {
    runPriceCheck({
      workbench: wbLite,
      artistId,
      price,
      windowMonths: null, // full history for now
      myMonthYYYYMM: myMonth,
      yScale,
      elKpis: pcKpis,
      elStory: pcStory,
      elChart: pcUniverse,
    });

    lastRun = { artistId, price, myMonthYYYYMM: myMonth };

    // Results screen
    pcResults?.classList.remove("hidden");
    pcFormCard?.classList.add("hidden");
    pcResults?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Ensure Plotly sizes correctly
    setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
  } catch (err) {
    alert(err?.message || String(err));
  }
});

// ----- Toggle y-scale after chart exists -----
pcLogToggle?.addEventListener("change", () => {
  if (!lastRun) return;
  const scale = pcLogToggle.checked ? "log" : "linear";
  setPriceCheckScale(pcUniverse, scale);
});

// ----- Back button -----
pcBack?.addEventListener("click", () => {
  showForm();
});

// ----- Helpers -----
function showForm() {
  pcFormCard?.classList.remove("hidden");
  pcResults?.classList.add("hidden");
  setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
}

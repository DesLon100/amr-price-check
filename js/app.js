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
const pcUniverse = el("pc-universe");
const pcLogToggle = el("pc-log");
const pcBack = el("pc-back");

const pcStory = el("pc-story"); // harmless if empty
const pcKpis = el("pc-kpis");   // harmless if removed from HTML

// Bands UI
const pcBands = el("pc-bands");
const pcBandsToggle = el("pc-bands-toggle");

let lastRun = null;

// ----- Load CSV -----
file?.addEventListener("change", async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;

  try {
    const text = await f.text();
    const data = loadPriceCheckCSV(text);
    window.__pcData = data;

    status && (status.textContent =
      `Loaded ${data.lotRows.length.toLocaleString()} lots across ${data.artists.length.toLocaleString()} artists. (Local only)`);

    pcArtist.innerHTML =
      `<option value="">Select artist…</option>` +
      data.artists.map(a =>
        `<option value="${escapeHtml(a.id)}">${escapeHtml(a.name)}</option>`
      ).join("");

    pcArtist.disabled = false;
    pcRun.disabled = false;

    if (data.artists[0]) pcArtist.value = data.artists[0].id;

    lastRun = null;
    pcLogToggle && (pcLogToggle.checked = false);
    collapseBands();
    showForm();
  } catch (err) {
    alert(err?.message || String(err));
    status && (status.textContent = "No dataset loaded.");
    pcArtist.disabled = true;
    pcArtist.innerHTML = `<option value="">Load data first…</option>`;
    pcRun.disabled = true;

    lastRun = null;
    collapseBands();
    showForm();
  }
});

// ----- Run Price Check -----
pcRun?.addEventListener("click", () => {
  const artistId = pcArtist?.value || "";
  const price = Number(pcPrice?.value);

  if (!artistId) return alert("Select an artist.");
  if (!Number.isFinite(price) || price <= 0) return alert("Enter a valid price.");

  const data = window.__pcData;
  if (!data) return alert("Load data first.");

  const myMonth = (pcMonth?.value || "").trim();
  const yScale = pcLogToggle?.checked ? "log" : "linear";

  const wbLite = {
    getLotRows: () => data.lotRows,
    getArtistName: (id) => data.getArtistName(id),
    getMetrics: (_id) => null
  };

  try {
    runPriceCheck({
      workbench: wbLite,
      artistId,
      price,
      windowMonths: null,
      myMonthYYYYMM: myMonth,
      yScale,
      elKpis: pcKpis,     // safe even if KPI div removed
      elStory: pcStory,   // safe
      elChart: pcUniverse
    });

    lastRun = { artistId, price, myMonthYYYYMM: myMonth };

    // Keep bands collapsed by default each run
    collapseBands();

    pcResults?.classList.remove("hidden");
    pcFormCard?.classList.add("hidden");
    pcResults?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Plotly sizing nudge
    setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
  } catch (err) {
    alert(err?.message || String(err));
  }
});

// ----- Toggle y-scale -----
pcLogToggle?.addEventListener("change", () => {
  if (!lastRun) return;
  setPriceCheckScale(pcUniverse, pcLogToggle.checked ? "log" : "linear");
});

// ----- Bands toggle -----
pcBandsToggle?.addEventListener("click", () => {
  const open = pcBandsToggle.getAttribute("aria-expanded") === "true";
  pcBandsToggle.setAttribute("aria-expanded", String(!open));
  pcBands?.classList.toggle("hidden", open);

  // ensure Plotly in collapsed panel sizes correctly when opening
  if (open === false) {
    setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
  }
});

// ----- Back -----
pcBack?.addEventListener("click", () => {
  lastRun = null;
  collapseBands();
  showForm();
});

// ----- Helpers -----
function showForm() {
  pcFormCard?.classList.remove("hidden");
  pcResults?.classList.add("hidden");
  setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
}

function collapseBands() {
  pcBandsToggle?.setAttribute("aria-expanded", "false");
  pcBands?.classList.add("hidden");
}

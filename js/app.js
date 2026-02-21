// js/app.js
import { runPriceCheck } from "./pricecheck.js";
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

// Local helper so app.js does not depend on an export that may disappear
function setPriceCheckScale(elChart, scale) {
  if (!elChart) return;
  const t = scale === "log" ? "log" : "linear";
  if (window.Plotly) {
    Plotly.relayout(elChart, { "yaxis.type": t, "yaxis.autorange": true });
  }
}

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

// Optional (safe if not present)
const pcStory = el("pc-story");
const pcKpis = el("pc-kpis");

// Bands UI (your HTML currently has class="pc-bands", not id="pc-bands")
const pcBandsToggle = el("pc-bands-toggle");
const pcBands =
  el("pc-bands") || document.querySelector(".pc-bands") || null;

let lastRun = null;

// ----- Load CSV -----
file?.addEventListener("change", async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;

  try {
    const text = await f.text();
    const data = loadPriceCheckCSV(text);
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

    lastRun = null;
    if (pcLogToggle) pcLogToggle.checked = false;

    collapseBands();
    showForm();
  } catch (err) {
    alert(err?.message || String(err));
    if (status) status.textContent = "No dataset loaded.";

    if (pcArtist) {
      pcArtist.disabled = true;
      pcArtist.innerHTML = `<option value="">Load data first…</option>`;
    }
    if (pcRun) pcRun.disabled = true;

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

  // Workbench-lite adapter (only what pricecheck.js expects)
  const wbLite = {
    getLotRows: () => data.lotRows,
    getArtistName: (id) => data.getArtistName(id),
    getMetrics: (_id) => null,
  };

  try {
    runPriceCheck({
      workbench: wbLite,
      artistId,
      price,
      myMonthYYYYMM: myMonth,
      yScale,
      elChart: pcUniverse,

      // harmless if pricecheck.js ignores them
      elKpis: pcKpis,
      elStory: pcStory,
      windowMonths: null,
    });

    lastRun = { artistId, price, myMonthYYYYMM: myMonth };

    // Keep bands collapsed by default each run
    collapseBands();

    pcResults?.classList.remove("hidden");
    pcFormCard?.classList.add("hidden");
    pcResults?.scrollIntoView({ behavior: "smooth", block: "start" });

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

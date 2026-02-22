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

function fmtGBP0(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return "—";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function fmtYYYYMMLabel(yyyymm) {
  const t = String(yyyymm || "").trim();
  if (!/^\d{6}$/.test(t)) return "";
  const y = Number(t.slice(0, 4));
  const m = Number(t.slice(4, 6)) - 1;
  if (!(y >= 1900 && m >= 0 && m <= 11)) return "";
  const d = new Date(Date.UTC(y, m, 1));
  return d.toLocaleString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
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

// Optional (safe if missing from HTML)
const pcStory = el("pc-story"); // harmless if empty
const pcKpis = el("pc-kpis");   // harmless if removed from HTML

// Bands UI
const pcBands = el("pc-bands"); // may be null if you removed id, handled safely
const pcBandsToggle = el("pc-bands-toggle");

let lastRun = null;

// Hero (title/subtitle at top of the page)
const heroTitle = document.querySelector(".hero-title");
const heroSub = document.querySelector(".hero-sub");
const defaultHeroTitle = heroTitle ? heroTitle.textContent : "";
const defaultHeroSub = heroSub ? heroSub.textContent : "";

function setHeroForResults({ artistName, price, purchaseMonth }) {
  if (heroTitle) heroTitle.textContent = "My Artwork";

  const parts = [artistName, fmtGBP0(price)];
  const monthLabel = fmtYYYYMMLabel(purchaseMonth);
  if (monthLabel) parts.push(monthLabel);

  if (heroSub) heroSub.textContent = parts.join(" · ");
}

function resetHero() {
  if (heroTitle) heroTitle.textContent = defaultHeroTitle;
  if (heroSub) heroSub.textContent = defaultHeroSub;
}

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

    // Reset view/state
    lastRun = null;
    if (pcLogToggle) pcLogToggle.checked = false;
    collapseBands();
    resetHero();
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
    resetHero();
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
      // extra args are ignored safely if your pricecheck.js doesn't use them:
      elKpis: pcKpis,
      elStory: pcStory,
    });

    lastRun = { artistId, price, myMonthYYYYMM: myMonth };

    // Update hero ONLY after pressing Check price
    const artistName = data.getArtistName(artistId);
    setHeroForResults({ artistName, price, purchaseMonth: myMonth });

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

  if (open === false) {
    setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
  }
});

// ----- Back -----
pcBack?.addEventListener("click", () => {
  lastRun = null;
  collapseBands();
  resetHero();
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

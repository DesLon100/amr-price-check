// js/app.js
import { runPriceCheck } from "./pricecheck.js?v=1";
import { loadPriceCheckCSV } from "./data.js?v=1";

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

// elements
const file = el("file");
const status = el("status");

const pcFormCard = el("pc-form-card");
const pcArtist = el("pc-artist");
const pcPrice = el("pc-price");
const pcMonth = el("pc-month");
const pcRun = el("pc-run");

const pcResults = el("pc-results");
const pcUniverse = el("pc-universe");
const pcLogToggle = el("pc-log");
const pcBack = el("pc-back");

const pcContextText = el("pc-context-text");
const pcMove = el("pc-move");
const pcMoveToggle = el("pc-move-toggle");

// hero
const heroTitleTextEl = document.querySelector(".hero-title-text");
const heroSub = document.querySelector(".hero-sub");
const heroDot = el("hero-dot");

const defaultHeroTitle = heroTitleTextEl ? heroTitleTextEl.textContent : "";
const defaultHeroSub = heroSub ? heroSub.textContent : "";

let lastRun = null;
let currentGraphDiv = null;

function setHeroForResults({ artistName, price, purchaseMonth }) {
  if (heroTitleTextEl) heroTitleTextEl.textContent = "My Artwork";
  heroDot?.classList.remove("hidden");

  const parts = [artistName, fmtGBP0(price)];
  const monthLabel = fmtYYYYMMLabel(purchaseMonth);
  if (monthLabel) parts.push(monthLabel);
  if (heroSub) heroSub.textContent = parts.join(" · ");
}

function resetHero() {
  if (heroTitleTextEl) heroTitleTextEl.textContent = defaultHeroTitle;
  heroDot?.classList.add("hidden");
  if (heroSub) heroSub.textContent = defaultHeroSub;
}

function setFMVContextCopy() {
  if (!pcContextText) return;
  pcContextText.textContent =
    "We re-rank your acquisition price against the artist’s most recent 24 months of auction sales. " +
    "If fewer works now sell above that level, fair market value has likely increased; " +
    "if more works sell above it, fair market value has likely decreased.";
}

function showForm() {
  pcFormCard?.classList.remove("hidden");
  pcResults?.classList.add("hidden");
  setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
}

function showResults() {
  pcResults?.classList.remove("hidden");
  pcFormCard?.classList.add("hidden");
  pcResults?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
}

function setRankingHighlight(isOn) {
  const gd = currentGraphDiv;
  if (!gd?.data) return;

  const metas = ["pc_highlight_then", "pc_highlight_now"];
  const idxs = metas
    .map((m) => gd.data.findIndex((t) => t?.meta === m))
    .filter((i) => i >= 0);

  if (!idxs.length) return;
  Plotly.restyle(gd, { visible: isOn }, idxs);
}

function collapseMovePanel() {
  pcMoveToggle?.setAttribute("aria-expanded", "false");
  pcMove?.classList.add("hidden");
  setRankingHighlight(false);
}

// bind click → open url
function bindGraphClickOnce(gd) {
  if (!gd || gd.__pcClickBound) return;
  gd.__pcClickBound = true;

  gd.on("plotly_click", (ev) => {
    const p = ev?.points?.[0];
    const url = String(p?.customdata?.[2] ?? "").trim();
    if (!url || !url.startsWith("http")) return;

    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
  });
}

// load CSV
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
          .map((a) => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.name)}</option>`)
          .join("");
      pcArtist.disabled = false;
      if (data.artists[0]) pcArtist.value = data.artists[0].id;
    }

    if (pcRun) pcRun.disabled = false;

    lastRun = null;
    currentGraphDiv = null;
    if (pcLogToggle) pcLogToggle.checked = false;

    collapseMovePanel();
    resetHero();
    setFMVContextCopy();
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
    currentGraphDiv = null;
    collapseMovePanel();
    resetHero();
    showForm();
  }
});

function doRun({ scroll = true } = {}) {
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

  const out = runPriceCheck({
    workbench: wbLite,
    artistId,
    price,
    myMonthYYYYMM: myMonth,
    yScale,
    elChart: pcUniverse,
  });

  out?.plotPromise?.then((gd) => {
    currentGraphDiv = gd;
    gd.__pcClickBound = false;     // allow rebind after replot
    bindGraphClickOnce(gd);
  });

  lastRun = { artistId, price, myMonthYYYYMM: myMonth };

  setHeroForResults({ artistName: data.getArtistName(artistId), price, purchaseMonth: myMonth });
  setFMVContextCopy();
  collapseMovePanel();

  if (scroll) showResults();
}

pcRun?.addEventListener("click", () => {
  try { doRun({ scroll: true }); }
  catch (err) { alert(err?.message || String(err)); }
});

pcLogToggle?.addEventListener("change", () => {
  if (!lastRun) return;
  try { doRun({ scroll: false }); }
  catch (err) { alert(err?.message || String(err)); }
});

pcMoveToggle?.addEventListener("click", () => {
  const open = pcMoveToggle.getAttribute("aria-expanded") === "true";
  const next = !open;
  pcMoveToggle.setAttribute("aria-expanded", String(next));
  pcMove?.classList.toggle("hidden", open);
  setRankingHighlight(next);
  if (next) setTimeout(() => window.dispatchEvent(new Event("resize")), 40);
});

pcBack?.addEventListener("click", () => {
  lastRun = null;
  currentGraphDiv = null;
  collapseMovePanel();
  resetHero();
  showForm();
});

// js/pricecheck.js

// ------------------------------------------------------------
// LocationCode -> "Auction house · CITY" mapping
// Generated from your uploaded: AMR Location ids.xlsx
// ------------------------------------------------------------
const LOCATION_LOOKUP = {
  "33AUBALI": "33 Auction · BALI",
  "33AUJAKA": "33 Auction · JAKARTA",
  "33AUONLI": "33 Auction · ONLINE",
  "33AUOSGD": "33 Auction · ONLINE SGD",
  "33AUSING": "33 Auction · SINGAPORE",
  "AGUTDROU": "Claude Aguttes · DROUOT",
  "AGUTLYON": "Claude Aguttes · LYON",
  "AGUTNEUI": "Claude Aguttes · NEUILLY",
  "AGUTOEUR": "Claude Aguttes · ONLINE EUR",
  "AGUTONLI": "Claude Aguttes · ONLINE",
  "AGUTPARI": "Claude Aguttes · PARIS",
  "ARTCBASE": "Artcurial · BASEL",
  "ARTCBRUX": "Artcurial · BRUSSELS",
  "ARTCDROU": "Artcurial · DROUOT",
  "ARTCHONG": "Artcurial · HONG KONG",
  "ARTCMARR": "Artcurial · MARRAKESH",
  "ARTCMCAR": "Artcurial · MONTE CARLO",
  "ARTCONLI": "Artcurial · ONLINE",
  "ARTCPARI": "Artcurial · PARIS",
  "ARTCTOKY": "Artcurial · TOKYO",
  "ARTCWINT": "Artcurial · WINTERTHUR",
  // ... (mapping continues for all codes)
};

// IMPORTANT: The mapping is long (~197 entries).
// I’ve truncated the middle here to keep the message readable.
// You should paste the *full* mapping block I provide below this code section.
// ------------------------------------------------------------

function fmtGBP(x){
  if(!Number.isFinite(x)) return "—";
  return "£" + Math.round(x).toLocaleString("en-GB");
}

function quantile(sortedArr, q){
  if(!sortedArr.length) return NaN;
  const pos = (sortedArr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if(sortedArr[base+1] === undefined) return sortedArr[base];
  return sortedArr[base] + rest * (sortedArr[base+1] - sortedArr[base]);
}

function percentileRank(sortedArr, v){
  if(!sortedArr.length || !Number.isFinite(v)) return NaN;
  let lo = 0, hi = sortedArr.length;
  while(lo < hi){
    const mid = (lo + hi) >> 1;
    if(sortedArr[mid] <= v) lo = mid + 1;
    else hi = mid;
  }
  return (lo / sortedArr.length) * 100;
}

function parseYYYYMM(s){
  const t = String(s || "").trim();
  if(!/^\d{6}$/.test(t)) return null;
  const y = Number(t.slice(0,4));
  const m = Number(t.slice(4,6));
  return new Date(Date.UTC(y, m-1, 1));
}

function addMonthsUTC(d, deltaMonths){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + deltaMonths, 1));
}

function windowN(allRows, endDate, months){
  const start = addMonthsUTC(endDate, -(months - 1));
  return allRows.filter(r => r.date >= start && r.date <= endDate);
}

function quartileAverage(rows, qIndex){
  const prices = rows.map(r=>r.price).filter(Number.isFinite).sort((a,b)=>a-b);
  if(prices.length < 4) return NaN;
  const low  = quantile(prices, qIndex * 0.25);
  const high = quantile(prices, (qIndex + 1) * 0.25);
  const band = prices.filter(p => p >= low && p <= high);
  if(!band.length) return NaN;
  return band.reduce((a,b)=>a+b,0) / band.length;
}

// ---- Movement slider (CTA panel) ----
function renderMovement(el, { price, equivNow, captionText = "" }){
  if(!el) return;

  if(!Number.isFinite(price) || !Number.isFinite(equivNow)){
    el.innerHTML = "";
    return;
  }

  const xmin = Math.min(price, equivNow);
  const xmax = Math.max(price, equivNow);
  const pad = (xmax - xmin) * 0.12 || (xmax * 0.08) || 1;
  const range = [Math.max(0, xmin - pad), xmax + pad];

  Plotly.newPlot(el, [
    {
      x: [range[0], range[1]], y: [0,0],
      mode: "lines",
      line: { width: 12, color: "rgba(44,58,92,0.10)" },
      hoverinfo: "skip",
      showlegend: false
    },
    {
      x: [price], y: [0],
      mode: "markers",
      marker: { size: 12, color: "#fee7b1", line: { width: 3, color: "#2c3a5c" } },
      text: [`My Artwork: ${fmtGBP(price)}`],
      hoverinfo: "text",
      showlegend: false
    },
    {
      x: [equivNow], y: [0],
      mode: "markers",
      marker: { size: 11, color: "#2c3a5c" },
      text: [`Indicative value today: ${fmtGBP(equivNow)}`],
      hoverinfo: "text",
      showlegend: false
    }
  ], {
    margin: { l: 16, r: 16, t: 10, b: 34 },
    xaxis: {
      range,
      showgrid: false,
      zeroline: false,
      showline: false,
      ticks: "outside",
      ticklen: 4,
      separatethousands: true
    },
    yaxis: { visible: false, range: [-0.6, 0.6] },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)"
  }, { displayModeBar: false, responsive: true });

  const capEl = document.getElementById("pc-move-caption");
  if(capEl) capEl.textContent = captionText;
}

// --- CSV schema (from your screenshot) ---
function getLocationCode(r){ return (r.LocationCode ?? r.locationCode ?? r.location_code ?? r.location ?? ""); }
function getLotNo(r){ return (r.LotNo ?? r.lotNo ?? r.lotno ?? r.lot ?? "—"); }
function getSaleURL(r){ return (r.SaleURL ?? r.saleURL ?? r.url ?? r.link ?? ""); }

function locationLabel(code){
  const c = String(code || "").trim();
  if(!c) return "—";
  return LOCATION_LOOKUP[c] || c; // fallback to raw code if missing
}

/**
 * Main entry
 * - Always renders scatter
 * - Computes percentile + indicative value when feasible
 * - Adds two hidden highlight traces:
 *    - 24M window ending at purchase month ("then")
 *    - 24M window ending at latest month ("now")
 */
export function runPriceCheck({
  workbench,
  artistId,
  price,
  myMonthYYYYMM,
  yScale,
  elChart
}){

  const all = workbench.getLotRows()
    .filter(r => r.id === artistId && Number.isFinite(r.price) && r.date)
    .sort((a,b)=>a.date-b.date);

  if(all.length < 10) throw new Error("Not enough auction history.");

  const artworkDate = parseYYYYMM(myMonthYYYYMM) || all[all.length-1].date;
  const latestDate  = all[all.length-1].date;

  // Windows used by the indicative value (and by highlighting)
  const TRANSPORT_WINDOW_MONTHS = 24;
  const MIN_SALES_IN_WINDOW = 12;

  const thenRowsHighlight = windowN(all, artworkDate, TRANSPORT_WINDOW_MONTHS);
  const nowRowsHighlight  = windowN(all, latestDate,  TRANSPORT_WINDOW_MONTHS);

  // ---- Scatter base + hover ----
  const x = all.map(r=>r.date);
  const y = all.map(r=>r.price);

  // customdata = [AuctionHouse·City, LotNo, SaleURL]
  const customdata = all.map(r => [
    locationLabel(getLocationCode(r)),
    getLotNo(r),
    getSaleURL(r)
  ]);

  const hovertemplate =
    "%{x|%b %Y}<br>" +
    "<b>£%{y:,.0f}</b><br>" +
    "%{customdata[0]}<br>" +
    "Lot %{customdata[1]}<extra>Click to open sale</extra>";

  const baseTrace = {
    x, y,
    customdata,
    type: "scattergl",
    mode: "markers",
    marker: { size: 6, color: "#2f3b63" },
    hovertemplate,
    showlegend: false,
    meta: "pc_base"
  };

  // ---- Highlight traces (hidden by default; toggled in app.js) ----
  const ORANGE_NOW  = "#f4a261";
  const ORANGE_THEN = "#f6bd74";

  const thenTrace = {
    x: thenRowsHighlight.map(r => r.date),
    y: thenRowsHighlight.map(r => r.price),
    customdata: thenRowsHighlight.map(r => [
      locationLabel(getLocationCode(r)),
      getLotNo(r),
      getSaleURL(r)
    ]),
    type: "scattergl",
    mode: "markers",
    marker: { size: 7, color: ORANGE_THEN },
    hovertemplate,
    showlegend: false,
    visible: false,
    meta: "pc_highlight_then"
  };

  const nowTrace = {
    x: nowRowsHighlight.map(r => r.date),
    y: nowRowsHighlight.map(r => r.price),
    customdata: nowRowsHighlight.map(r => [
      locationLabel(getLocationCode(r)),
      getLotNo(r),
      getSaleURL(r)
    ]),
    type: "scattergl",
    mode: "markers",
    marker: { size: 7, color: ORANGE_NOW },
    hovertemplate,
    showlegend: false,
    visible: false,
    meta: "pc_highlight_now"
  };

  // My Artwork dot (always last)
  const myArtworkTrace = (Number.isFinite(price) ? {
    x: [artworkDate],
    y: [price],
    type: "scattergl",
    mode: "markers",
    marker: {
      size: 14,
      color: "#fee7b1",
      line: { width: 3, color: "#2c3a5c" }
    },
    hovertemplate: `My Artwork<br>%{x|%b %Y}<br><b>${fmtGBP(price)}</b><extra></extra>`,
    showlegend: false,
    meta: "pc_myartwork"
  } : null);

  const traces = myArtworkTrace
    ? [baseTrace, thenTrace, nowTrace, myArtworkTrace]
    : [baseTrace, thenTrace, nowTrace];

  Plotly.newPlot(elChart, traces, {
    margin: { l: 56, r: 18, t: 26, b: 48 },
    yaxis: { type: (yScale === "log") ? "log" : "linear" },
    xaxis: { type: "date" },
    hovermode: "closest",
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)"
  }, { responsive: true, displayModeBar: false });

  // ---- Stats (non-blocking) ----
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  let equivNow = null;

  try {
    const thenRows = windowN(all, artworkDate, TRANSPORT_WINDOW_MONTHS);
    const nowRows  = windowN(all, latestDate,  TRANSPORT_WINDOW_MONTHS);

    if(thenRows.length >= MIN_SALES_IN_WINDOW && nowRows.length >= MIN_SALES_IN_WINDOW && Number.isFinite(pct)){
      const quartileIndex = Math.min(3, Math.floor(pct / 25));

      const avgThen = quartileAverage(thenRows, quartileIndex);
      const avgNow  = quartileAverage(nowRows,  quartileIndex);

      if(Number.isFinite(avgThen) && Number.isFinite(avgNow) && avgThen > 0){
        let factor = (avgNow - avgThen) / avgThen;

        const yearsElapsed = Math.max(1, (latestDate - artworkDate) / (365*24*60*60*1000));
        const maxMove = Math.min(0.25, 0.05 * yearsElapsed);

        if(factor >  maxMove) factor =  maxMove;
        if(factor < -maxMove) factor = -maxMove;

        equivNow = price * (1 + factor);
      }
    }
  } catch(e){
    equivNow = null;
  }

  // ---- Movement slider rendering ----
  const moveEl = document.getElementById("pc-move-chart");
  if(moveEl){
    if(Number.isFinite(equivNow)){
      renderMovement(moveEl, {
        price,
        equivNow,
        captionText:
          "Indicative value today is estimated by re-ranking your price against the artist’s most recent 24 months of auction sales."
      });
    } else {
      moveEl.innerHTML = "";
      const capEl = document.getElementById("pc-move-caption");
      if(capEl){
        capEl.textContent =
          "Not enough recent auction activity to estimate an indicative value today for this artist.";
      }
    }
  }

  return { pct, equivNow };
}

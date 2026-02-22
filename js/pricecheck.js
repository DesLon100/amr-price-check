// js/pricecheck.js

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

/**
 * Main entry
 * - Always renders scatter
 * - Computes percentile + "equivalent level today" when feasible
 * - Never throws for window insufficiency
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

  // --- Always render scatter first (nothing below can block chart rendering) ---
  const x = all.map(r=>r.date);
  const y = all.map(r=>r.price);

  const baseTrace = {
    x, y,
    type: "scattergl",
    mode: "markers",
    marker: { size: 6, color: "#2f3b63" },
    hovertemplate: "%{x|%b %Y}<br>%{y:,.0f}<extra></extra>",
    name: "Auction sales",
    showlegend: false
  };

  // My Artwork dot as a separate trace, plotted LAST so it sits on top
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
    hovertemplate: `My Artwork<br>%{x|%b %Y}<br>${fmtGBP(price)}<extra></extra>`,
    name: "My Artwork",
    showlegend: false
  } : null);

  const traces = myArtworkTrace ? [baseTrace, myArtworkTrace] : [baseTrace];

  Plotly.newPlot(elChart, traces, {
    margin: { l: 56, r: 18, t: 26, b: 48 },
    yaxis: { type: (yScale === "log") ? "log" : "linear" },
    xaxis: { type: "date" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)"
  }, { responsive: true, displayModeBar: false });

  // --- Now compute stats (safe / non-blocking) ---
  // Percentile at purchase month (based on ALL data up to that month, not a fixed 48M gate)
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  // "Equivalent level today" (your quartile-average transport idea) with a 24M window
  // If insufficient data, return equivNow = null (do not throw)
  const TRANSPORT_WINDOW_MONTHS = 24;
  const MIN_SALES_IN_WINDOW = 12;

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

        // Keep your conservative cap
        const yearsElapsed = Math.max(1, (latestDate - artworkDate) / (365*24*60*60*1000));
        const maxMove = Math.min(0.25, 0.05 * yearsElapsed);

        if(factor >  maxMove) factor =  maxMove;
        if(factor < -maxMove) factor = -maxMove;

        equivNow = price * (1 + factor);
      }
    }
  } catch(e){
    // swallow: never allow this to break chart rendering
    equivNow = null;
  }

  return { pct, equivNow };
}

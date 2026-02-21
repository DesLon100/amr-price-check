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
  if(!(y>=1900 && m>=1 && m<=12)) return null;
  return new Date(Date.UTC(y, m-1, 1));
}

function cutoffDateFromLast(rows, windowMonths){
  if(!windowMonths) return null;
  const last = rows[rows.length - 1]?.date;
  if(!last) return null;
  return new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth()-(windowMonths-1), 1));
}

function kpi(label, value){
  return `
    <div class="kpi">
      <div class="lab">${escapeHtml(label)}</div>
      <div class="val">${escapeHtml(value)}</div>
    </div>
  `;
}

function asPct(v){
  return Number.isFinite(v) ? (v*100).toFixed(1) + "%" : "—";
}

function fmtNum(v){
  if(!Number.isFinite(v)) return "—";
  const abs = Math.abs(v);
  if(abs >= 1e6) return (v/1e6).toFixed(2)+"M";
  if(abs >= 1e3) return (v/1e3).toFixed(2)+"k";
  return Math.round(v).toString();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
}

function hLine(y){
  return {
    type: "line",
    x0: 0, x1: 1,
    xref: "paper",
    y0: y, y1: y,
    yref: "y",
    line: { width: 1, dash: "dot" }
  };
}

function labelLine(y, text){
  return {
    x: 1,
    xref: "paper",
    xanchor: "left",
    y: y,
    yref: "y",
    yanchor: "middle",
    text,
    showarrow: false,
    font: { size: 11 }
  };
}
function marketStory(m){
  if(!m) return "Workbench metrics aren’t available for this artist yet.";

  const parts = [];

  // Direction
  if(Number.isFinite(m.meanCagr) && Number.isFinite(m.medianCagr)){
    const meanUp = m.meanCagr >= 0;
    const medUp  = m.medianCagr >= 0;
    if(meanUp && medUp) parts.push("Prices have been trending higher over the selected window.");
    else if(!meanUp && !medUp) parts.push("Prices have been trending lower over the selected window.");
    else parts.push("Pricing signals are mixed: the average and the typical sale are moving differently.");
  }

  // Trophy vs broad
  if(Number.isFinite(m.cagrDivergence)){
    if(m.cagrDivergence > 0.03) parts.push("The rise looks top-end led (stronger performance in higher-priced lots).");
    else if(m.cagrDivergence < -0.03) parts.push("The typical sale is doing better than the top end (less trophy influence).");
    else parts.push("The move looks broad-based rather than driven by a handful of trophy lots.");
  }

  // Liquidity
  if(Number.isFinite(m.lots12) && Number.isFinite(m.lots24)){
    if(m.lots12 < Math.max(10, 0.35*m.lots24)) parts.push("Liquidity has softened recently (fewer lots coming to market in the last 12 months).");
    else parts.push("Liquidity looks steady (recent lot flow is broadly consistent).");
  }

  // Concentration
  if(Number.isFinite(m.concLatest) && Number.isFinite(m.concDeltaWin)){
    if(m.concDeltaWin > 0.05) parts.push("Value concentration has increased: a larger share of turnover is coming from the top decile.");
    else if(m.concDeltaWin < -0.05) parts.push("Value concentration has eased: turnover is spreading more evenly across lots.");
  }

  // Confidence
  if(Number.isFinite(m.r2)){
    if(m.r2 >= 0.55) parts.push("The trend is relatively clean (higher confidence signal).");
    else if(m.r2 <= 0.25) parts.push("The trend is noisy (treat as a weak signal).");
  }

  return parts.join(" ");
}
export function setPriceCheckScale(elChart, scale){
  if(!elChart) return;
  const t = (scale === "log") ? "log" : "linear";

  Plotly.relayout(elChart, {
    "yaxis.type": t,
    "yaxis.autorange": true
  });
}

export function runPriceCheck({
  workbench,
  artistId,
  price,
  windowMonths,
  myMonthYYYYMM,
  yScale,
  elKpis,
  elStructure,
  elChart
}) {
  // Get all lots for this artist
  const all = workbench.getLotRows()
    .filter(r => r.id === artistId && Number.isFinite(r.price) && r.price > 0 && r.date)
    .sort((a,b)=>a.date - b.date);

  if(all.length < 30){
    throw new Error(`Not enough auction lots for this artist (${all.length}).`);
  }

  // Window filter
  const cutoff = cutoffDateFromLast(all, windowMonths);
  const rows = cutoff ? all.filter(r => r.date >= cutoff) : all;

  if(rows.length < 30){
    throw new Error(`Not enough lots in this window (${rows.length}). Try a wider window.`);
  }

  const prices = rows.map(r=>r.price).sort((a,b)=>a-b);
  const p30 = quantile(prices, 0.30);
  const p50 = quantile(prices, 0.50);
  const p70 = quantile(prices, 0.70);
  const pct = percentileRank(prices, price);

  elKpis.innerHTML = [
    kpi("Percentile", `${Math.round(pct)}th`),
    kpi("30th", fmtGBP(p30)),
    kpi("Median", fmtGBP(p50)),
    kpi("70th", fmtGBP(p70))
  ].join("");

  const m = workbench.getMetrics(artistId);
  if(m){
    elStructure.innerHTML = [
      kpi("Mean CAGR", asPct(m.meanCagr)),
      kpi("Median CAGR", asPct(m.medianCagr)),
      kpi("Mean–Median Δ", asPct(m.cagrDivergence)),
      kpi("Concentration (latest yr)", asPct(m.concLatest)),
      kpi("Δ Concentration (window)", asPct(m.concDeltaWin)),
      kpi("Lots (24M)", fmtNum(m.lots24)),
      kpi("Lots (12M)", fmtNum(m.lots12)),
      kpi("Trend strength (R²)", Number.isFinite(m.r2) ? m.r2.toFixed(2) : "—"),
    ].join("");
  } else {
    elStructure.innerHTML = `<div class="muted">Workbench metrics not available for this artist yet.</div>`;
  }

  // Scatter data
  const x = rows.map(r=>r.date);
  const y = rows.map(r=>r.price);

  // My artwork date: user month else last auction month in filtered dataset
  const lastDate = rows[rows.length - 1].date;
  const userDate = parseYYYYMM(myMonthYYYYMM) || lastDate;

  const artistName = workbench.getArtistName(artistId);
  const scale = (yScale === "log") ? "log" : "linear";

  Plotly.newPlot(elChart, [
    {
      x, y,
      type: "scattergl",
      mode: "markers",
      name: "Auction lots",
      marker: { size: 6, opacity: 0.55 }
    },
    {
      x: [userDate],
      y: [price],
      type: "scatter",
      mode: "markers",
      name: "My artwork",
      marker: { size: 12, opacity: 1 }
    }
  ], {
    margin:{l:60,r:20,t:30,b:50},
    title: { text: `${artistName} — Auction lots + my artwork`, font:{size:14} },
    xaxis: { title: "Sale month" },
    yaxis: { title: "Hammer price (GBP)", type: scale },
    hovermode: "closest",
    shapes: [hLine(p30), hLine(p50), hLine(p70)],
    annotations: [labelLine(p30,"p30"), labelLine(p50,"p50"), labelLine(p70,"p70")],
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, { displayModeBar:false, responsive:true });

  return { p30, p50, p70, pct, n: rows.length };
}

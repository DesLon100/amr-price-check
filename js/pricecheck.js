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

export function runPriceCheck({ workbench, artistId, price, windowMonths, elKpis, elStructure, elChart }) {
  const prices = (workbench.getArtistLotPrices(artistId, windowMonths) || [])
    .filter(Number.isFinite)
    .sort((a,b)=>a-b);

  if(prices.length < 30){
    throw new Error(`Not enough lot prices in this window (${prices.length}). Try a wider window.`);
  }

  const p30 = quantile(prices, 0.30);
  const p50 = quantile(prices, 0.50);
  const p70 = quantile(prices, 0.70);
  const pct = percentileRank(prices, price);

  // KPI strip
  elKpis.innerHTML = [
    kpi("Percentile", `${Math.round(pct)}th`),
    kpi("30th", fmtGBP(p30)),
    kpi("Median", fmtGBP(p50)),
    kpi("70th", fmtGBP(p70))
  ].join("");

  // Structural readout (Workbench metrics)
  const m = workbench.getMetrics(artistId);
  if(m){
    elStructure.innerHTML = [
      kpi("Mean CAGR", asPct(m.meanCagr)),
      kpi("Median CAGR", asPct(m.medianCagr)),
      kpi("Mean–Median Δ", asPct(m.cagrDivergence)),
      kpi("Concentration (latest yr)", asPct(m.concLatest)),
      kpi("Δ Concentration (window)", asPct(m.concDeltaWin)),
      kpi("Liquidity (lots 24M)", fmtNum(m.lots24)),
      kpi("Liquidity (lots 12M)", fmtNum(m.lots12)),
      kpi("Trend strength (R²)", Number.isFinite(m.r2) ? m.r2.toFixed(2) : "—"),
    ].join("");
  } else {
    elStructure.innerHTML = `<div class="muted">Workbench metrics not available for this artist yet.</div>`;
  }

  // Universe chart: histogram + marker line
  const artistName = workbench.getArtistName(artistId);

  Plotly.newPlot(elChart, [
    {
      x: prices,
      type: "histogram",
      name: "Auction lots",
      nbinsx: 30
    }
  ], {
    margin:{l:50,r:20,t:20,b:50},
    title: { text: `${artistName} — Auction price distribution`, font:{size:14} },
    xaxis:{ title:"Hammer price (GBP)" },
    yaxis:{ title:"Count" },
    shapes: [{
      type: "line",
      x0: price, x1: price,
      y0: 0, y1: 1,
      xref: "x", yref: "paper",
      line: { width: 2 }
    }],
    annotations: [{
      x: price,
      y: 1,
      xref: "x",
      yref: "paper",
      yanchor: "bottom",
      text: `Your price: ${fmtGBP(price)}`,
      showarrow: false
    }],
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, { displayModeBar:false, responsive:true });

  return { p30, p50, p70, pct, n: prices.length };
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

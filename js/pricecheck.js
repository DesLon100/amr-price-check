// js/pricecheck.js
// Scatter universe + "my artwork" point + p30/p50/p70 bands + plain-English market readout

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

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
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
  if(!m) return "We don’t yet have enough clean history in Workbench to summarise this market reliably.";

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
    if(m.cagrDivergence > 0.03) parts.push("The move looks top-end led (stronger performance in higher-priced lots).");
    else if(m.cagrDivergence < -0.03) parts.push("The typical sale is doing better than the top end (less trophy influence).");
    else parts.push("The move looks broadly shared rather than driven by a handful of trophy lots.");
  }

  // Liquidity
  if(Number.isFinite(m.lots12) && Number.isFinite(m.lots24)){
    const recentDrop = m.lots12 < Math.max(10, 0.35*m.lots24);
    if(recentDrop) parts.push("Liquidity has softened recently (fewer lots coming to market in the last 12 months).");
    else parts.push("Liquidity looks steady (recent lot flow is broadly consistent).");
  }

  // Concentration
  if(Number.isFinite(m.concDeltaWin)){
    if(m.concDeltaWin > 0.05) parts.push("Value concentration has increased: more turnover is coming from the top decile.");
    else if(m.concDeltaWin < -0.05) parts.push("Value concentration has eased: turnover is spreading more evenly across lots.");
  }

  // Confidence
  if(Number.isFinite(m.r2)){
    if(m.r2 >= 0.55) parts.push("The trend is relatively clean (higher confidence signal).");
    else if(m.r2 <= 0.25) parts.push("The trend is noisy (treat as a weak signal).");
  }

  return parts.join(" ");
}

// Exposed so the toggle can update without rerunning
export function setPriceCheckScale(elChart, scale){
  if(!elChart) return;
  const t = (scale === "log") ? "log" : "linear";
  Plotly.relayout(elChart, {
    "yaxis.type": t,
    "yaxis.autorange": true
  });
}
const HOUSE_MAP = { SOTH:"Sotheby’s", CHRI:"Christie’s", BONH:"Bonhams", PHIL:"Phillips" };
const CITY_MAP  = { LOND:"London", NEWY:"New York", HONG:"Hong Kong", PARI:"Paris", GENE:"Geneva", ZURI:"Zurich", ONLI:"Online" };

function formatLocationCode(code){
  const raw = String(code || "").trim().toUpperCase();
  if(!raw || raw === "NULL" || raw === "N/A") return "Location —";
  if(raw.length < 5) return raw;
  const suffix = raw.slice(-4);
  const prefix = raw.slice(0, -4);
  const house = HOUSE_MAP[prefix] || prefix;
  const city  = CITY_MAP[suffix]  || suffix;
  return `${house} — ${city}`;
}
export function runPriceCheck({
  workbench,
  artistId,
  price,
  windowMonths,
  myMonthYYYYMM,
  yScale,
  elKpis,
  elStory,
  elChart
}) {
  const all = workbench.getLotRows()
    .filter(r => r.id === artistId && Number.isFinite(r.price) && r.price > 0 && r.date)
    .sort((a,b)=>a.date - b.date);

  if(all.length < 30){
    throw new Error(`Not enough auction lots for this artist (${all.length}).`);
  }

  const cutoff = cutoffDateFromLast(all, windowMonths);
  const rows = cutoff ? all.filter(r => r.date >= cutoff) : all;

  if(rows.length < 30){
    throw new Error(`Not enough lots in this window (${rows.length}). Try a wider window.`);
  }

  // Distribution stats
  const prices = rows.map(r=>r.price).sort((a,b)=>a-b);
  const p30 = quantile(prices, 0.30);
  const p50 = quantile(prices, 0.50);
  const p70 = quantile(prices, 0.70);
  const pct = percentileRank(prices, price);

  // KPI strip (simple + useful)
  if(elKpis){
    elKpis.innerHTML = [
      kpi("Percentile", `${Math.round(pct)}th`),
      kpi("30th", fmtGBP(p30)),
      kpi("Median", fmtGBP(p50)),
      kpi("70th", fmtGBP(p70))
    ].join("");
  }

  // Plain-English story (derived from Workbench metrics)
  const m = workbench.getMetrics(artistId);
  if(elStory){
    elStory.textContent = marketStory(m);
  }

  // Scatter
  const x = rows.map(r=>r.date);
  const y = rows.map(r=>r.price);

  // My artwork x-position: user month else last auction month in filtered dataset
  const lastDate = rows[rows.length - 1].date;
  const userDate = parseYYYYMM(myMonthYYYYMM) || lastDate;

  const artistName = workbench.getArtistName(artistId) || "Selected artist";
  const scale = (yScale === "log") ? "log" : "linear";
  
  // Extra hover/click metadata (may be blank for older rows)
  const custom = rows.map(r => ([
    r.lotNo || "",
    r.auctionId || "",
    r.locationCode || "",
    r.saleUrl || ""
  ]));

  const hoverText = rows.map(r => {
  const loc = formatLocationCode(r.locationCode);
  const when = r.date
    ? r.date.toLocaleString("en-GB", { month:"short", year:"numeric", timeZone:"UTC" })
    : "";
  const lot = (r.lotNo && String(r.lotNo).toUpperCase() !== "NULL") ? `Lot ${r.lotNo}` : "Lot —";
  return `${loc}<br>${when}<br>${lot}<br><span style="opacity:.75">Click to open sale</span>`;
});

  Plotly.newPlot(elChart, [
    {
      x, y,
      type: "scattergl",
      mode: "markers",
      name: "Auction lots",
      customdata: custom,
      text: hoverText,
      hoverinfo: "text",
      marker: { size: 6, opacity: 0.55 }
    },
    {
      x: [userDate],
      y: [price],
      type: "scatter",
      mode: "markers",
      name: "My artwork",
      text: [`My artwork<br>Price: ${fmtGBP(price)}`],
      hoverinfo: "text",
      marker: { size: 13, opacity: 1, line: { width: 2 } }
    }
  ], {
    margin:{l:60,r:20,t:30,b:50},
    title: { text: `${artistName} — auction lots + my artwork`, font:{size:14} },
    xaxis: { title: "Sale month" },
    yaxis: { title: "Hammer price (GBP)", type: scale },
    hovermode: "closest",
    hoverlabel: { bgcolor:"rgba(17,17,17,0.78)", bordercolor:"rgba(255,255,255,0.15)", font:{color:"#fff", size:12} },
    shapes: [hLine(p30), hLine(p50), hLine(p70)],
    annotations: [labelLine(p30,"p30"), labelLine(p50,"p50"), labelLine(p70,"p70")],
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, { displayModeBar:false, responsive:true });

  // Prevent stacking handlers on repeated runs
  if(elChart && elChart.removeAllListeners) elChart.removeAllListeners("plotly_click");

  if(elChart){
    elChart.on("plotly_click", (ev) => {
      const p = ev?.points?.[0];
      if(!p) return;
      if(p.curveNumber !== 0) return; // auction lots only
      const cd = p.customdata || [];
      const url = cd[3];
      if(url) window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return { p30, p50, p70, pct, n: rows.length };
}

// js/pricecheck.js
// Scatter universe + "my artwork" point + p30/p50/p70 bands + plain-English readout

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

function hLine(y){
  return {
    type: "line",
    x0: 0, x1: 1,
    xref: "paper",
    y0: y, y1: y,
    yref: "y",
    layer: "above",
    line: { width: 1, dash: "dot", color: "rgba(0,0,0,0.35)" }
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
    font: { size: 11, color: "rgba(0,0,0,0.55)" }
  };
}

function marketStory(m){
  // Workbench parked: keep this minimal / non-confusing
  if(!m) return "";
  return "";
}

// Exposed so the toggle can update without rerunning
export function setPriceCheckScale(elChart, scale){
  if(!elChart) return;
  const t = (scale === "log") ? "log" : "linear";
  Plotly.relayout(elChart, { "yaxis.type": t, "yaxis.autorange": true });
}

const HOUSE_MAP = { SOTH:"Sotheby’s", CHRI:"Christie’s", BONH:"Bonhams", PHIL:"Phillips" };
const CITY_MAP  = { LOND:"London", NEWY:"New York", HONG:"Hong Kong", PARI:"Paris", GENE:"Geneva", ZURI:"Zurich", ONLI:"Online" };

function formatLocationCode(code){
  const raw = String(code || "").trim().toUpperCase();
  if(!raw || raw === "NULL" || raw === "N/A") return "Location —";
  // If already human-readable (e.g. "Sotheby's — London"), keep it
  if(raw.includes("—")) return String(code);
  if(raw.length < 5) return String(code || "Location —");
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
}){
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

  const prices = rows.map(r=>r.price).sort((a,b)=>a-b);
  const p30 = quantile(prices, 0.30);
  const p50 = quantile(prices, 0.50);
  const p70 = quantile(prices, 0.70);
  const pct = percentileRank(prices, price);

  if(elKpis){
    elKpis.innerHTML = [
      kpi("Percentile", `${Math.round(pct)}th`),
      kpi("30th", fmtGBP(p30)),
      kpi("Median", fmtGBP(p50)),
      kpi("70th", fmtGBP(p70))
    ].join("");
  }

  const m = workbench.getMetrics(artistId);
  if(elStory){
    elStory.textContent = marketStory(m);
  }

  const x = rows.map(r=>r.date);
  const y = rows.map(r=>r.price);

  const lastDate = rows[rows.length - 1].date;
  const userDate = parseYYYYMM(myMonthYYYYMM) || lastDate;

  const artistName = workbench.getArtistName(artistId) || "Selected artist";
  const scale = (yScale === "log") ? "log" : "linear";

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

  Plotly.newPlot(
    elChart,
    [
      {
        x, y,
        type: "scattergl",
        mode: "markers",
        name: "Auction lots",
        customdata: custom,
        text: hoverText,
        hoverinfo: "text",
        marker: {
  size: 6,
  opacity: 1,
  color: "#2f3b63",   // ← use your button colour here
  line: { width: 0 }
}
      },
      {
        x: [userDate],
        y: [price],
        type: "scatter",
        mode: "markers",
        name: "My artwork",
        text: [`My artwork<br>Price: ${fmtGBP(price)}`],
        hoverinfo: "text",
        marker: {
  size: 14,
  opacity: 1,
  color: "#ffffff",
  line: { width: 3, color: "#2f3b63" }  // same primary colour
}
      }
    ],
    {
      margin: { l: 56, r: 18, t: 26, b: 48 },
      title: { text: `${artistName} — auction lots + my artwork`, font: { size: 14 } },

      xaxis: {
        title: "Sale month",
        showgrid: false,
        zeroline: false,
        showline: false,
        ticks: "outside",
        ticklen: 4,
        tickwidth: 1,
        tickcolor: "rgba(0,0,0,0.18)",
        tickfont: { size: 12 },
        titlefont: { size: 12 }
      },
      yaxis: {
        title: "Hammer price (GBP)",
        type: scale,
        showgrid: false,
        zeroline: false,
        showline: false,
        ticks: "outside",
        ticklen: 4,
        tickwidth: 1,
        tickcolor: "rgba(0,0,0,0.18)",
        tickfont: { size: 12 },
        titlefont: { size: 12 },
        separatethousands: true,
        automargin: true
      },

      hovermode: "closest",
      hoverlabel: {
        bgcolor: "rgba(17,17,17,0.82)",
        bordercolor: "rgba(255,255,255,0.12)",
        font: { color: "#fff", size: 12 }
      },

      shapes: [hLine(p30), hLine(p50), hLine(p70)],
      annotations: [labelLine(p30,"p30"), labelLine(p50,"p50"), labelLine(p70,"p70")],

      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    },
    { displayModeBar: false, responsive: true }
  );

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

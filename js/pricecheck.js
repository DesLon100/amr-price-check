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

function clearingSentence(price, p30, p50, p70, pct){
  const P = fmtGBP(price);
  if(![p30,p50,p70,pct].every(Number.isFinite)) return "";

  if(price < p30){
    return `${P} sits below the “support” clearing band (p30). Historically, about ${Math.round(100-pct)}% of comparable lots cleared above this level, so this price is more sensitive to quality and timing.`;
  }
  if(price < p50){
    return `${P} sits within the lower clearing band (between p30 and the median). This is broadly achievable, but outcomes tend to depend more on buyer depth and sale context.`;
  }
  if(price < p70){
    return `${P} sits above the typical sale (above the median) but below the top-third threshold (p70). That’s a strong position versus most comparable auction results.`;
  }
  return `${P} is above the top-third clearing threshold (p70). Historically, only the stronger outcomes tend to clear above this level.`;
}

function renderBands(el, price, p30, p50, p70){
  if(!el) return;
  if(![price,p30,p50,p70].every(Number.isFinite)){
    el.innerHTML = "";
    return;
  }

  const lo = Math.min(p30, p50, p70, price);
  const hi = Math.max(p30, p50, p70, price);
  const span = Math.max(1, hi - lo);
  const pad = span * 0.12; // key: keeps ticks/labels inside bounds

  Plotly.newPlot(
    el,
    [
      // faint band p30->p70
      {
        x: [p30, p70],
        y: [0, 0],
        mode: "lines",
        line: { width: 10, color: "rgba(0,0,0,0.10)" },
        hoverinfo: "skip",
        showlegend: false
      },
      // median tick
      {
        x: [p50, p50],
        y: [-0.16, 0.16],
        mode: "lines",
        line: { width: 2, color: "rgba(0,0,0,0.35)" },
        hoverinfo: "skip",
        showlegend: false
      },
      // your price marker
      {
        x: [price],
        y: [0],
        mode: "markers",
        marker: { size: 12, color: "#2f3b63", line: { width: 3, color: "#2f3b63" } },
        text: [`Your price: ${fmtGBP(price)}`],
        hoverinfo: "text",
        showlegend: false
      }
    ],
    {
      margin: { l: 64, r: 22, t: 8, b: 34 },
      xaxis: {
        range: [lo - pad, hi + pad],
        showgrid: false,
        zeroline: false,
        showline: false,
        ticks: "outside",
        ticklen: 4,
        tickcolor: "rgba(0,0,0,0.18)",
        tickfont: { size: 12 },
        tickprefix: "£",
        separatethousands: true,
        automargin: true
      },
      yaxis: { visible: false },

      // spaced labels (avoid bunching)
      annotations: [
        { x:p30, y:0.34, xref:"x", yref:"y", text:`p30 ${fmtGBP(p30)}`, showarrow:false,
          xanchor:"center", xshift:-18, font:{size:11, color:"rgba(0,0,0,0.55)"} },
        { x:p50, y:0.34, xref:"x", yref:"y", text:`median ${fmtGBP(p50)}`, showarrow:false,
          xanchor:"center", xshift:0, font:{size:11, color:"rgba(0,0,0,0.55)"} },
        { x:p70, y:0.34, xref:"x", yref:"y", text:`p70 ${fmtGBP(p70)}`, showarrow:false,
          xanchor:"center", xshift:18, font:{size:11, color:"rgba(0,0,0,0.55)"} }
      ],

      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)"
    },
    { displayModeBar:false, responsive:true }
  );
}

export function setPriceCheckScale(elChart, scale){
  if(!elChart) return;
  Plotly.relayout(elChart, {
    "yaxis.type": (scale === "log") ? "log" : "linear",
    "yaxis.autorange": true
  });
}

const HOUSE_MAP = { SOTH:"Sotheby’s", CHRI:"Christie’s", BONH:"Bonhams", PHIL:"Phillips" };
const CITY_MAP  = { LOND:"London", NEWY:"New York", HONG:"Hong Kong", PARI:"Paris", GENE:"Geneva", ZURI:"Zurich", ONLI:"Online" };

function formatLocationCode(code){
  const raw = String(code || "").trim();
  if(!raw || raw.toUpperCase() === "NULL" || raw.toUpperCase() === "N/A") return "Location —";
  if(raw.includes("—")) return raw; // already human-readable
  const u = raw.toUpperCase();
  if(u.length < 5) return raw;
  const suffix = u.slice(-4);
  const prefix = u.slice(0, -4);
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
  elKpis,   // ignored now (safe)
  elStory,  // safe
  elChart
}){
  const all = workbench.getLotRows()
    .filter(r => r.id === artistId && Number.isFinite(r.price) && r.price > 0 && r.date)
    .sort((a,b)=>a.date - b.date);

  if(all.length < 30) throw new Error(`Not enough auction lots for this artist (${all.length}).`);

  const cutoff = cutoffDateFromLast(all, windowMonths);
  const rows = cutoff ? all.filter(r => r.date >= cutoff) : all;

  if(rows.length < 30) throw new Error(`Not enough lots in this window (${rows.length}). Try a wider window.`);

  const prices = rows.map(r=>r.price).sort((a,b)=>a-b);
  const p30 = quantile(prices, 0.30);
  const p50 = quantile(prices, 0.50);
  const p70 = quantile(prices, 0.70);
  const pct = percentileRank(prices, price);

  // Investor-safe sentence
  const elContext = document.getElementById("pc-context-text");
  if(elContext) elContext.textContent = clearingSentence(price, p30, p50, p70, pct);

  // Mini bands chart
  renderBands(document.getElementById("pc-bands-chart"), price, p30, p50, p70);

  // Scatter
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
        marker: { size: 6, opacity: 1, color: "#2f3b63", line: { width: 0 } }
      },
      {
        x: [userDate],
        y: [price],
        type: "scatter",
        mode: "markers",
        name: "My artwork",
        text: [`My artwork<br>Price: ${fmtGBP(price)}`],
        hoverinfo: "text",
        marker: { size: 14, opacity: 1, color: "#fee7b1", line: { width: 3, color: "#2f3b63" } }
      }
    ],
    {
      margin: { l: 56, r: 18, t: 26, b: 48 },
      title: {
  text: `<b>${artistName}</b> — auction lots + my artwork`,
  font: { size: 15 },
  x: 0,
  xanchor: "left"
},

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
    { displayModeBar:false, responsive:true }
  );

  if(elChart && elChart.removeAllListeners) elChart.removeAllListeners("plotly_click");

  if(elChart){
    elChart.on("plotly_click", (ev) => {
      const p = ev?.points?.[0];
      if(!p) return;
      if(p.curveNumber !== 0) return;
      const url = (p.customdata || [])[3];
      if(url) window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return { p30, p50, p70, pct, n: rows.length };
}

// js/pricecheck.js

// ------------------------------------------------------------
// LocationCode -> "Auction house · CITY" mapping (197 entries)
// ------------------------------------------------------------
const LOCATION_LOOKUP = {
  /* KEEP YOUR FULL LOCATION_LOOKUP EXACTLY AS-IS HERE */
};

// Convert "House · CITY" -> "House (City)" for tooltips
function locationLabel(code){
  const c = String(code || "").trim();
  if(!c) return "—";

  const raw = LOCATION_LOOKUP[c] || c;

  if(raw.includes("·")){
    const [houseRaw, cityRaw] = raw.split("·").map(s => s.trim());
    const city = String(cityRaw || "")
      .toLowerCase()
      .replace(/\b\w/g, ch => ch.toUpperCase());
    return `${houseRaw} (${city})`;
  }

  return raw;
}

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

// Month key used for stable lookups
function monthKeyUTC(d){
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

// ------------------------------------------------------------
// Helpers for 24M rolling p50 + regression transport
// ------------------------------------------------------------
function monthStartUTC(d){
  if(!(d instanceof Date)) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function monthIndexUTC(d){
  return d.getUTCFullYear() * 12 + d.getUTCMonth();
}

function monthFromIndexUTC(idx){
  const y = Math.floor(idx / 12);
  const m = idx - y * 12;
  return new Date(Date.UTC(y, m, 1));
}

function buildMonthRangeUTC(minDate, maxDate){
  const a = monthIndexUTC(monthStartUTC(minDate));
  const b = monthIndexUTC(monthStartUTC(maxDate));
  const months = [];
  for(let i = a; i <= b; i++){
    months.push(monthFromIndexUTC(i));
  }
  return months;
}

function ols(xs, ys){
  const n = xs.length;
  if(n < 2) return null;

  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for(let i=0;i<n;i++){
    const x = xs[i], y = ys[i];
    sx += x; sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  const denom = (n * sxx - sx * sx);
  if(denom === 0) return null;

  const b = (n * sxy - sx * sy) / denom;
  const a = (sy - b * sx) / n;
  return { a, b };
}

// Movement slider (CTA)
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
    { x:[range[0], range[1]], y:[0,0], mode:"lines",
      line:{width:12,color:"rgba(44,58,92,0.10)"}, hoverinfo:"skip", showlegend:false },
    { x:[price], y:[0], mode:"markers",
      marker:{size:12,color:"#fee7b1",line:{width:3,color:"#2c3a5c"}},
      text:[`My Artwork: ${fmtGBP(price)}`], hoverinfo:"text", showlegend:false },
    { x:[equivNow], y:[0], mode:"markers",
      marker:{size:11,color:"#2c3a5c"},
      text:[`Indicative value: ${fmtGBP(equivNow)}`], hoverinfo:"text", showlegend:false }
  ],{
    margin:{l:16,r:16,t:10,b:34},
    xaxis:{range, showgrid:false, zeroline:false, showline:false, ticks:"outside", ticklen:4, separatethousands:true},
    yaxis:{visible:false, range:[-0.6,0.6]},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  },{displayModeBar:false, responsive:true});

  const capEl = document.getElementById("pc-move-caption");
  if(capEl) capEl.textContent = captionText;
}

// CSV fields (now coming cleanly from data.js)
function getLocationCode(r){ return String(r.LocationCode ?? "").trim(); }
function getLotNo(r){ return String(r.LotNo ?? "").trim() || "—"; }
function getSaleURL(r){ return String(r.SaleURL ?? "").trim(); }

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

  const TRANSPORT_WINDOW_MONTHS = 24;
  const MIN_SALES_IN_WINDOW = 10;

  const x = all.map(r=>r.date);
  const y = all.map(r=>r.price);

  const customdata = all.map(r => [
    locationLabel(getLocationCode(r)),
    getLotNo(r),
    getSaleURL(r)
  ]);

  const hovertemplate =
    "%{x|%b %Y}<br>" +
    "<b>£%{y:,.0f}</b><br>" +
    "%{customdata[0]}<br>" +
    "Lot %{customdata[1]}" +
    "<extra>Click dot to open sale</extra>";

  // Scatter: NORMAL colour on initial load
  const baseTrace = {
    x, y, customdata,
    type:"scattergl",
    mode:"markers",
    marker:{size:6, color:"#2f3b63"},
    hovertemplate,
    showlegend:false,
    meta:"pc_base"
  };

  // ------------------------------------------------------------
  // Precompute 24M rolling p50 + regression (but DO NOT display yet)
  // ------------------------------------------------------------
  const months = buildMonthRangeUTC(all[0].date, all[all.length-1].date);
  const allM = all.map(r => ({ ...r, _m: monthStartUTC(r.date) }));

  let startPtr = 0;
  let endPtr = 0;

  const p50Dates = [];
  const p50Vals  = [];
  const p50T     = [];
  const monthToT = new Map();

  for(let i=0;i<months.length;i++){
    const endMonth = months[i];
    const startMonth = addMonthsUTC(endMonth, -(TRANSPORT_WINDOW_MONTHS - 1));

    while(endPtr < allM.length && allM[endPtr]._m <= endMonth) endPtr++;
    while(startPtr < allM.length && allM[startPtr]._m < startMonth) startPtr++;

    const win = allM.slice(startPtr, endPtr);
    if(win.length < MIN_SALES_IN_WINDOW) continue;

    const prices = win.map(r=>r.price).filter(Number.isFinite).sort((a,b)=>a-b);
    if(prices.length < MIN_SALES_IN_WINDOW) continue;

    const med = quantile(prices, 0.5);
    if(!Number.isFinite(med) || med <= 0) continue;

    p50Dates.push(endMonth);
    p50Vals.push(med);
    p50T.push(i);
    monthToT.set(monthKeyUTC(endMonth), i);
  }

  let reg = null;
  if(p50T.length >= 2){
    const ys = p50Vals.map(v => Math.log(v));
    reg = ols(p50T, ys);
  }

  const regDates = [];
  const regVals  = [];
  if(reg){
    for(let i=0;i<months.length;i++){
      const ln = reg.a + reg.b * i;
      const v = Math.exp(ln);
      if(Number.isFinite(v) && v > 0){
        regDates.push(months[i]);
        regVals.push(v);
      }
    }
  }

  // Optional “my percentile” rolling line (computed; only shown if you have a checkbox for it)
  const purchaseMonth = monthStartUTC(artworkDate);
  const thenWin = windowN(all, purchaseMonth, TRANSPORT_WINDOW_MONTHS);
  const thenPricesWin = thenWin.map(r=>r.price).filter(Number.isFinite).sort((a,b)=>a-b);
  const q0 = (thenPricesWin.length >= MIN_SALES_IN_WINDOW && Number.isFinite(price))
    ? (percentileRank(thenPricesWin, price) / 100)
    : NaN;

  const qDates = [];
  const qVals  = [];
  if(Number.isFinite(q0)){
    startPtr = 0;
    endPtr = 0;
    for(let i=0;i<months.length;i++){
      const endMonth = months[i];
      const startMonth = addMonthsUTC(endMonth, -(TRANSPORT_WINDOW_MONTHS - 1));

      while(endPtr < allM.length && allM[endPtr]._m <= endMonth) endPtr++;
      while(startPtr < allM.length && allM[startPtr]._m < startMonth) startPtr++;

      const win = allM.slice(startPtr, endPtr);
      if(win.length < MIN_SALES_IN_WINDOW) continue;

      const prices = win.map(r=>r.price).filter(Number.isFinite).sort((a,b)=>a-b);
      if(prices.length < MIN_SALES_IN_WINDOW) continue;

      const v = quantile(prices, q0);
      if(Number.isFinite(v) && v > 0){
        qDates.push(endMonth);
        qVals.push(v);
      }
    }
  }

  // Lines as SVG scatter so they draw above WebGL dots
  const p50Trace = (p50Dates.length >= 2) ? {
    x: p50Dates,
    y: p50Vals,
    type:"scatter",
    mode:"lines",
    line:{width:4.0, color:"rgba(47,59,99,0.45)"},
    hovertemplate:"24M rolling median (p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_p50_24"
  } : null;

  const regTrace = (regDates.length >= 2) ? {
    x: regDates,
    y: regVals,
    type:"scatter",
    mode:"lines",
    line:{width:5.0, color:"rgba(47,59,99,0.90)"},
    hovertemplate:"Trend line (regression through rolling p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_p50_reg"
  } : null;

  const myPctTrace = (qDates.length >= 2) ? {
    x: qDates,
    y: qVals,
    type:"scatter",
    mode:"lines",
    line:{width:2.5, dash:"dot", color:"rgba(246,189,116,0.95)"},
    hovertemplate:"My percentile (24M rolling)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_mypercentile_24"
  } : null;

  const myArtworkTrace = Number.isFinite(price) ? {
    x:[purchaseMonth],
    y:[price],
    type:"scattergl",
    mode:"markers",
    marker:{size:14, color:"#fee7b1", line:{width:3, color:"#2c3a5c"}},
    hovertemplate:`My Artwork<br>%{x|%b %Y}<br><b>${fmtGBP(price)}</b><extra></extra>`,
    showlegend:false,
    meta:"pc_myartwork"
  } : null;

  // Order: dots first, then SVG lines, then artwork marker last
  const traces = [];
  traces.push(baseTrace);
  if(p50Trace) traces.push(p50Trace);
  if(regTrace) traces.push(regTrace);
  if(myPctTrace) traces.push(myPctTrace);
  if(myArtworkTrace) traces.push(myArtworkTrace);

  const plotPromise = Plotly.newPlot(elChart, traces, {
    margin:{l:56,r:18,t:26,b:48},
    yaxis:{type:(yScale==="log")?"log":"linear"},
    xaxis:{type:"date"},
    hovermode:"closest",
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, {responsive:true, displayModeBar:false});

  // ------------------------------------------------------------
  // Percentile at purchase month (unchanged)
  // ------------------------------------------------------------
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  // ------------------------------------------------------------
  // Revaluation helper (input month -> target month)
  // ------------------------------------------------------------
  function impliedValueAt(targetMonthUTC){
    if(!reg || !Number.isFinite(price) || price <= 0) return null;

    const tInput  = monthToT.get(monthKeyUTC(purchaseMonth));
    const tTarget = monthToT.get(monthKeyUTC(monthStartUTC(targetMonthUTC)));

    if(!Number.isFinite(tInput) || !Number.isFinite(tTarget)) return null;

    const winInput  = windowN(all, purchaseMonth, TRANSPORT_WINDOW_MONTHS);
    const winTarget = windowN(all, monthStartUTC(targetMonthUTC), TRANSPORT_WINDOW_MONTHS);

    if(winInput.length < MIN_SALES_IN_WINDOW || winTarget.length < MIN_SALES_IN_WINDOW) return null;

    const pInput  = Math.exp(reg.a + reg.b * tInput);
    const pTarget = Math.exp(reg.a + reg.b * tTarget);

    if(!Number.isFinite(pInput) || !Number.isFinite(pTarget) || pInput <= 0 || pTarget <= 0) return null;

    return price * (pTarget / pInput);
  }

  let equivNow = null;
  try{
    equivNow = impliedValueAt(monthStartUTC(latestDate));
  } catch(e){
    equivNow = null;
  }

  // ------------------------------------------------------------
  // UI behaviour: deterministic, tied to your actual button
  // (#pc-move-toggle opens/closes #pc-move)
  // ------------------------------------------------------------
  plotPromise.then(() => {
    const btn   = document.getElementById("pc-move-toggle");
    const panel = document.getElementById("pc-move");

    const moveEl = document.getElementById("pc-move-chart");
    const capEl  = document.getElementById("pc-move-caption");

    // Optional scrubber elements (only if you added them in HTML)
    const rng   = document.getElementById("pc-target-range");
    const lab   = document.getElementById("pc-target-label");
    const reset = document.getElementById("pc-target-reset");

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0";

    const gd = elChart;
    const data = (gd && gd.data) ? gd.data : [];

    const idxBase = data.findIndex(t => t && t.meta === "pc_base");
    const idxP50  = data.findIndex(t => t && t.meta === "pc_p50_24");
    const idxReg  = data.findIndex(t => t && t.meta === "pc_p50_reg");
    const idxMy   = data.findIndex(t => t && t.meta === "pc_mypercentile_24");

    const cbPct = document.getElementById("pc-show-mypercentile"); // only if you have it somewhere

    const monthLabel = (d) =>
      d.toLocaleString("en-GB", { month:"short", year:"numeric", timeZone:"UTC" });

    const applyBaseline = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": DARK_DOT }, [idxBase]);
      if(idxP50  >= 0) Plotly.restyle(gd, { visible:false }, [idxP50]);
      if(idxReg  >= 0) Plotly.restyle(gd, { visible:false }, [idxReg]);
      if(idxMy   >= 0) Plotly.restyle(gd, { visible:false }, [idxMy]);
      if(cbPct) cbPct.checked = false;

      if(moveEl) moveEl.innerHTML = "";
      if(capEl) capEl.textContent = "";
      if(lab) lab.textContent = "—";
    };

    const applyMovementOn = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": LIGHT_DOT }, [idxBase]);
      if(idxP50  >= 0) Plotly.restyle(gd, { visible:true }, [idxP50]);
      if(idxReg  >= 0) Plotly.restyle(gd, { visible:true }, [idxReg]);

      if(cbPct && idxMy >= 0){
        cbPct.onchange = () => {
          Plotly.restyle(gd, { visible: cbPct.checked ? true : false }, [idxMy]);
        };
        cbPct.onchange();
      }
    };

    const renderForTarget = (targetDateUTC) => {
      if(!moveEl) return;

      const equiv = impliedValueAt(targetDateUTC);
      if(lab) lab.textContent = monthLabel(targetDateUTC);

      if(Number.isFinite(equiv)){
        renderMovement(moveEl, {
          price,
          equivNow: equiv,
          captionText:
            "Indicative FMV translation based on the artist’s 24-month rolling median (p50) trend. " +
            "Drag the target month to translate the same input price across time."
        });
      } else {
        moveEl.innerHTML = "";
        if(capEl){
          capEl.textContent =
            "Not enough auction activity around one of the selected dates to compute an FMV translation.";
        }
      }
    };

    const initScrubber = () => {
      if(!rng || !months || !months.length) return;

      rng.min = 0;
      rng.max = months.length - 1;
      rng.step = 1;

      // default: latest month
      rng.value = String(months.length - 1);
      if(lab) lab.textContent = monthLabel(months[months.length - 1]);

      rng.oninput = () => {
        const idx = Math.max(0, Math.min(months.length - 1, Number(rng.value)));
        renderForTarget(months[idx]);
      };

      if(reset){
        reset.onclick = () => {
          rng.value = String(months.length - 1);
          renderForTarget(months[months.length - 1]);
        };
      }
    };

    const setOpen = (open) => {
      if(!btn || !panel) return;

      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("hidden", !open);

      if(open){
        applyMovementOn();
        initScrubber();

        // If scrubber exists, it drives target date; otherwise show latest
        if(rng && months && months.length){
          const idx = Math.max(0, Math.min(months.length - 1, Number(rng.value || (months.length - 1))));
          renderForTarget(months[idx]);
        } else {
          renderForTarget(monthStartUTC(latestDate));
        }
      } else {
        applyBaseline();
      }
    };

    // Always start in baseline after plot renders
    applyBaseline();

    // Bind toggle once per run
    if(btn){
      btn.onclick = () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        setOpen(!isOpen);
      };

      // Respect existing aria state if something else set it
      const isOpenNow = btn.getAttribute("aria-expanded") === "true";
      setOpen(isOpenNow);
    }
  });

  return { pct, equivNow, plotPromise };
}

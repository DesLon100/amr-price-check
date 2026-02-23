// js/pricecheck.js

// ------------------------------------------------------------
// LocationCode -> "Auction house · CITY" mapping
// ------------------------------------------------------------
const LOCATION_LOOKUP = {
  "33AUBALI": "33 Auction · BALI",
  "33AUJAKA": "33 Auction · JAKARTA",
  "33AUONLI": "33 Auction · ONLINE",
  "33AUOSGD": "33 Auction · ONLINE SGD",
  "33AUSING": "33 Auction · SINGAPORE",
  "ARTCDROU": "Artcurial · DROUOT",
  "ARTCMARR": "Artcurial · MARRAKESH",
  "ARTCMC'": "Artcurial · (unknown)", // defensive
  "ARTCMONC": "Artcurial · MONACO",
  "ARTCNICE": "Artcurial · NICE",
  "ARTCPAQU": "Artcurial · PARIS (AQUABOULEVARD)",
  "ARTCPBRU": "Artcurial · BRUSSELS",
  "ARTCPDRO": "Artcurial · PARIS (DROUOT)",
  "ARTCPMAR": "Artcurial · MARRAKESH",
  "ARTCPMON": "Artcurial · MONACO",
  "ARTCPPAR": "Artcurial · PARIS",
  "ARTCPRUE": "Artcurial · PARIS (RUE ...)",
  "ARTCPYVE": "Artcurial · PARIS (YVES ...)",
  "ARTCSTTR": "Artcurial · ST TROPEZ",
  "ARTCSTTR2": "Artcurial · ST TROPEZ",
  "ARTCTOKY": "Artcurial · TOKYO",
  "ARTCTORN": "Artcurial · TORONTO",
  "ARTCTOUQ": "Artcurial · TOUQUET",
  "ARTCVEVE": "Artcurial · VEVEY",
  "ARTCWINT": "Artcurial · WINTER ...",
  "BONAAMST": "Bonhams · AMSTERDAM",
  "BONALOND": "Bonhams · LONDON",
  "BONAONLI": "Bonhams · ONLINE",
  "BONAPARI": "Bonhams · PARIS",
  "BONASANF": "Bonhams · SAN FRANCISCO",
  "BONASDNY": "Bonhams · SYDNEY",
  "BONASFOB": "Bonhams · SAN FRANCISCO (OAKLAND)",
  "BONASFOC": "Bonhams · SAN FRANCISCO (CALIFORNIA)",
  "BONASNTF": "Bonhams · SAN FRANCISCO (N. ...)",
  "BONASTCK": "Bonhams · STOCKHOLM",
  "BONATOKY": "Bonhams · TOKYO",
  "BONAWHIT": "Bonhams · WHITE ...",
  "BRUNBRUS": "Bruun Rasmussen · BRUSSELS",
  "BRUNCOPE": "Bruun Rasmussen · COPENHAGEN",
  "BRUNONLI": "Bruun Rasmussen · ONLINE",
  "CHRISTHK": "Christie's · HONG KONG",
  "CHRISTLN": "Christie's · LONDON",
  "CHRISTNY": "Christie's · NEW YORK",
  "CHRISTON": "Christie's · ONLINE",
  "CHRISTPA": "Christie's · PARIS",
  "CHRISTSP": "Christie's · SHANGHAI",
  "CHRISTTB": "Christie's · DUBAI",
  "CHRISTTO": "Christie's · TOKYO",
  "CHRISTZN": "Christie's · ZURICH",
  "DOROTHEU": "Dorotheum · VIENNA",
  "HERMESPA": "Hermès · PARIS",
  "KOLLERZU": "Koller · ZURICH",
  "LELLONG": "Lelong · PARIS",
  "PAGETBAH": "Paget · BAHRAIN",
  "PHILLHK": "Phillips · HONG KONG",
  "PHILLLDN": "Phillips · LONDON",
  "PHILLNY": "Phillips · NEW YORK",
  "PHILLONL": "Phillips · ONLINE",
  "SOTHLND": "Sotheby's · LONDON",
  "SOTHNY": "Sotheby's · NEW YORK",
  "SOTHONL": "Sotheby's · ONLINE",
  "SOTHPA": "Sotheby's · PARIS",
  "SOTHHK": "Sotheby's · HONG KONG",
  "SOTHZRH": "Sotheby's · ZURICH",
  "TJANONLI": "Tajan · ONLINE",
  "TJANPARI": "Tajan · PARIS",
  "VANHAMCO": "Van Ham · COLOGNE",
  "VANHAMON": "Van Ham · ONLINE"
};

// -------------------------
// Helpers
// -------------------------
function fmtGBP(n){
  if(!Number.isFinite(n)) return "—";
  return "£" + n.toLocaleString("en-GB", {maximumFractionDigits:0});
}
function monthLabel(d){
  return d.toLocaleString("en-GB", {month:"short", year:"numeric"});
}
function parseYYYYMM(str){
  if(!str) return null;
  const s = String(str).trim();
  const m = s.match(/^(\d{4})(\d{2})$/);
  if(!m) return null;
  const y = +m[1], mo = +m[2];
  if(mo < 1 || mo > 12) return null;
  // Use UTC month start
  return new Date(Date.UTC(y, mo-1, 1));
}
function toMonthStartUTC(d){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}
function addMonthsUTC(d, n){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+n, 1));
}
function monthDiffUTC(a, b){
  // months between a and b (a -> b)
  return (b.getUTCFullYear()-a.getUTCFullYear())*12 + (b.getUTCMonth()-a.getUTCMonth());
}
function clamp01(x){ return Math.max(0, Math.min(1, x)); }

// ------------------------------------------------------------
// Main renderer (called by app.js when user hits "Check price")
// ------------------------------------------------------------
function runPriceCheck({
  elChartId = "pc-chart",
  elBandsId = "pc-bands",
  elStoryId = "pc-story",
  elHeroTitleId = "pc-hero-title",
  elHeroSubId = "pc-hero-sub",
  elMyBubbleId = "pc-my-bubble",
  elEqBubbleId = "pc-eq-bubble",
  elMyDotId = "pc-my-dot",
  elEqDotId = "pc-eq-dot",
  elTrackId = "pc-track",
  elMovePanelId = "pc-move-panel",
  elMoveToggleId = "pc-move-toggle",
  elMoveOptInId = "pc-target-optin",
  elMoveUiWrapId = "pc-target-ui",
  elMoveInputId = "pc-target-input",
  elMoveHintId = "pc-target-hint",
  elMoveCaptionId = "pc-target-caption",

  artistName,
  price,
  purchaseMonthUTC,

  salesRows = [] // [{dateUTC, priceGBP, locationCode, title, lotNo, house}]
} = {}){

  const elChart = document.getElementById(elChartId);
  const elBands = document.getElementById(elBandsId);
  const elStory = document.getElementById(elStoryId);
  const heroTitle = document.getElementById(elHeroTitleId);
  const heroSub = document.getElementById(elHeroSubId);

  const bubMy = document.getElementById(elMyBubbleId);
  const bubEq = document.getElementById(elEqBubbleId);
  const dotMy = document.getElementById(elMyDotId);
  const dotEq = document.getElementById(elEqDotId);
  const track = document.getElementById(elTrackId);

  const panel = document.getElementById(elMovePanelId);
  const btn = document.getElementById(elMoveToggleId);
  const optin = document.getElementById(elMoveOptInId);
  const uiWrap = document.getElementById(elMoveUiWrapId);
  const inp = document.getElementById(elMoveInputId);
  const hintEl = document.getElementById(elMoveHintId);
  const capEl = document.getElementById(elMoveCaptionId);

  if(!elChart) return;

  // ---- Hero copy (already handled upstream, but defensive)
  if(heroTitle) heroTitle.textContent = "My Artwork";
  if(heroSub){
    const pMonth = purchaseMonthUTC ? monthLabel(purchaseMonthUTC) : "";
    heroSub.textContent = `${artistName || ""} · ${fmtGBP(price)} · ${pMonth}`.replace(/\s+·\s+·/g," · ").trim();
  }

  // ---- Prepare scatter data
  const ptsX = [];
  const ptsY = [];
  const ptsText = [];
  const ptsLoc = [];

  for(const r of salesRows){
    if(!r || !r.dateUTC || !Number.isFinite(r.priceGBP)) continue;
    ptsX.push(r.dateUTC);
    ptsY.push(r.priceGBP);

    const loc = LOCATION_LOOKUP[r.locationCode] || r.locationCode || "";
    ptsLoc.push(loc);

    const title = (r.title || "").trim();
    const lot = r.lotNo ? `Lot ${r.lotNo}` : "";
    const house = (r.house || "").trim();

    ptsText.push(
      `${title ? `<b>${title}</b><br>` : ""}` +
      `${lot ? `${lot}<br>` : ""}` +
      `${house ? `${house}<br>` : ""}` +
      `${loc ? `${loc}<br>` : ""}` +
      `${monthLabel(r.dateUTC)}<br>` +
      `<b>${fmtGBP(r.priceGBP)}</b>`
    );
  }

  // ---- Rolling median (p50) and regression data (precomputed upstream in data.js or app.js)
  // Expect globals or functions in data.js:
  // - buildMonthlyP50(salesRows) -> {dates:[], vals:[]}
  // - regressionLine(dates, vals) -> {dates:[], vals:[]}
  const p50 = (typeof buildMonthlyP50 === "function") ? buildMonthlyP50(salesRows) : {dates:[], vals:[]};
  const p50Dates = p50.dates || [];
  const p50Vals  = p50.vals  || [];

  const reg = (typeof regressionLine === "function") ? regressionLine(p50Dates, p50Vals) : {dates:[], vals:[]};
  const regDates = reg.dates || [];
  const regVals  = reg.vals  || [];

  // ---- Main scatter trace
  const baseTrace = {
    x: ptsX,
    y: ptsY,
    type:"scattergl",
    mode:"markers",
    marker:{
      size:7,
      color:"#2f3b63",   // DARK by default
      opacity:0.85
    },
    hovertemplate: "%{text}<extra></extra>",
    text: ptsText,
    showlegend:false,
    meta:"pc_base"
  };

  // IMPORTANT FIX:
  // Make p50 + regression ALSO scattergl so they draw ABOVE the dots (same canvas).
  const p50Trace = (p50Dates.length >= 2) ? {
    x: p50Dates,
    y: p50Vals,
    type:"scattergl",
    mode:"lines",
    line:{width:3.5, color:"rgba(47,59,99,0.45)"},
    hovertemplate:"24M rolling median (p50, month-weighted)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,          // FIX: hidden until FMV opened
    meta:"pc_p50_24"
  } : null;

  const regTrace = (regDates.length >= 2) ? {
    x: regDates,
    y: regVals,
    type:"scattergl",
    mode:"lines",
    line:{width:4.5, color:"rgba(47,59,99,0.90)"},
    hovertemplate:"Trend line (regression through rolling p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,          // FIX: hidden until FMV opened
    meta:"pc_p50_reg"
  } : null;

  const myArtworkTrace = Number.isFinite(price) ? {
    x:[purchaseMonthUTC],
    y:[price],
    type:"scattergl",
    mode:"markers",
    marker:{size:14, color:"#fee7b1", line:{width:3, color:"#2c3a5c"}},
    hovertemplate:`My Artwork<br>%{x|%b %Y}<br><b>${fmtGBP(price)}</b><extra></extra>`,
    showlegend:false,
    meta:"pc_my"
  } : null;

  // Placeholder for revaluation dot (updated later)
  const revalTrace = {
    x:[purchaseMonthUTC],
    y:[price],
    type:"scattergl",
    mode:"markers",
    marker:{size:12, color:"#2f3b63", line:{width:3, color:"#ffffff"}},
    hovertemplate:`Revaluation<br>%{x|%b %Y}<br><b>${fmtGBP(price)}</b><extra></extra>`,
    showlegend:false,
    visible:true,
    meta:"pc_reval"
  };

  const traces = [baseTrace];
  if(p50Trace) traces.push(p50Trace);
  if(regTrace) traces.push(regTrace);
  if(myArtworkTrace) traces.push(myArtworkTrace);
  traces.push(revalTrace);

  // ---- Layout
  const layout = {
    margin:{l:60, r:20, t:10, b:50},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"#ffffff",
    xaxis:{
      type:"date",
      showgrid:false,
      ticks:"outside",
      ticklen:6
    },
    yaxis:{
      type:"log",
      tickformat:",",
      showgrid:true,
      gridcolor:"rgba(0,0,0,0.08)",
      zeroline:false
    }
  };

  // ---- Plot
  const plotPromise = Plotly.newPlot(elChart, traces, layout, {displayModeBar:false, responsive:true});

  // ------------------------------------------------------------
  // Sliding FMV bar: dot + bubbles
  // ------------------------------------------------------------
  function setHint(msg){
    if(hintEl) hintEl.textContent = msg || "";
  }

  function computeEquivAtMonth(targetMonthUTC){
    // Uses rolling median regression slope approximation through p50 regression
    // For simplicity, reuse regression line values by month (if available)
    if(!Number.isFinite(price) || !purchaseMonthUTC) return null;

    const i0 = regDates.findIndex(d => +toMonthStartUTC(d) === +toMonthStartUTC(purchaseMonthUTC));
    const it = regDates.findIndex(d => +toMonthStartUTC(d) === +toMonthStartUTC(targetMonthUTC));
    if(i0 < 0 || it < 0) return null;

    const pInput  = regVals[i0];
    const pTarget = regVals[it];
    if(!Number.isFinite(pInput) || !Number.isFinite(pTarget) || pInput <= 0 || pTarget <= 0) return null;

    return price * (pTarget / pInput);
  }

  function pctFromMonths(d){
    // percent along the full chart x-range based on actual plot xaxis range
    const gd = elChart;
    if(!gd || !gd.layout || !gd.layout.xaxis) return 50;

    const xr = gd.layout.xaxis.range;
    if(!xr || xr.length < 2) return 50;

    const minD = new Date(xr[0]);
    const maxD = new Date(xr[1]);
    const denom = (+maxD - +minD) || 1;
    const v = (+d - +minD) / denom;
    return clamp01(v) * 100;
  }

  function updateRevalDot(targetMonthUTC){
    const equiv = computeEquivAtMonth(targetMonthUTC);
    if(!Number.isFinite(equiv)) return;

    // update reval trace point
    const gd = elChart;
    if(!gd || !gd.data) return;
    const idx = gd.data.findIndex(t => t && t.meta === "pc_reval");
    if(idx >= 0){
      Plotly.restyle(gd, {x:[[targetMonthUTC]], y:[[equiv]]}, [idx]);
    }

    // update bubbles + dots on the FMV track
    if(track && dotMy && dotEq && bubMy && bubEq){
      const myLeft = Math.max(0, Math.min(100, pctFromMonths(purchaseMonthUTC)));
      const eqLeft = Math.max(0, Math.min(100, pctFromMonths(targetMonthUTC)));

      // FIX: clamp bubbles so they don't fall off edges
      const dotMyLeft = Math.max(0, Math.min(100, myLeft));
      const dotEqLeft = Math.max(0, Math.min(100, eqLeft));
      const bubMyLeft = Math.max(6, Math.min(94, myLeft));
      const bubEqLeft = Math.max(6, Math.min(94, eqLeft));

      dotMy.style.left = `${dotMyLeft}%`;
      dotEq.style.left = `${dotEqLeft}%`;
      bubMy.style.left = `${bubMyLeft}%`;
      bubEq.style.left = `${bubEqLeft}%`;

      if(bubMy) bubMy.querySelector(".val").textContent = fmtGBP(price);
      if(bubEq) bubEq.querySelector(".val").textContent = fmtGBP(equiv);
    }
  }

  // ------------------------------------------------------------
  // FMV panel (open/close) + optional target month input
  // ------------------------------------------------------------
  plotPromise.then(() => {
    const gd = elChart;

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0";

    const data = (gd && gd.data) ? gd.data : [];
    const idxBase  = data.findIndex(t => t && t.meta === "pc_base");
    const idxReval = data.findIndex(t => t && t.meta === "pc_reval");
    const idxP50  = data.findIndex(t => t && t.meta === "pc_p50_24");
    const idxReg  = data.findIndex(t => t && t.meta === "pc_p50_reg");

    // default target month = latest month in regDates (or last sale month)
    const latestMonth = (regDates && regDates.length) ? toMonthStartUTC(regDates[regDates.length-1]) :
      (ptsX && ptsX.length ? toMonthStartUTC(ptsX[ptsX.length-1]) : toMonthStartUTC(purchaseMonthUTC));

    function renderFMV(targetMonthUTC){
      const equiv = computeEquivAtMonth(targetMonthUTC);
      if(!Number.isFinite(equiv)) return;

      updateRevalDot(targetMonthUTC);

      // Also update story panel if present
      if(elStory){
        elStory.innerHTML = buildStoryHTML({
          artistName,
          purchaseMonthUTC,
          targetMonthUTC: targetMonthUTC,
          price,
          equivValue: equiv
        });
      }

      if(capEl){
        capEl.textContent = "For retrospective valuations, add target month to calculate.";
      }

      updateRevalDot(targetMonthUTC);
    }

    function openPanel(){
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▴";

      // LIGHT BLUE dots on FMV open
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": LIGHT_DOT }, [idxBase]);
      // show median + regression on FMV open
      if(idxP50 >= 0) Plotly.restyle(gd, { visible: true }, [idxP50]);
      if(idxReg >= 0) Plotly.restyle(gd, { visible: true }, [idxReg]);

      renderFMV(latestMonth);

      if(optin) optin.checked = false;
      if(uiWrap) uiWrap.classList.add("hidden");
      if(inp) inp.value = "";
      setHint("Enter a month in YYYYMM.");
    }

    function closePanel(){
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▾";

      // revert dots on close
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": DARK_DOT }, [idxBase]);
      // hide median + regression on FMV close
      if(idxP50 >= 0) Plotly.restyle(gd, { visible: false }, [idxP50]);
      if(idxReg >= 0) Plotly.restyle(gd, { visible: false }, [idxReg]);

      if(optin) optin.checked = false;
      if(uiWrap) uiWrap.classList.add("hidden");
      if(inp) inp.value = "";
      setHint("");
    }

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if(isOpen) closePanel();
      else openPanel();
    });

    function parseTarget(){
      const d = parseYYYYMM(inp && inp.value);
      if(!d) return null;
      return toMonthStartUTC(d);
    }

    if(optin){
      optin.onchange = () => {
        const on = !!optin.checked;
        if(uiWrap) uiWrap.classList.toggle("hidden", !on);

        if(!on){
          renderFMV(latestMonth);
          return;
        }

        setHint("Enter a month in YYYYMM.");
        const d = parseTarget();
        if(d) renderFMV(d);
      };
    }

    if(inp){
      inp.addEventListener("input", () => {
        if(!(optin && optin.checked)) return;

        const d = parseTarget();
        if(!d){
          setHint("Enter a month in YYYYMM.");
          return;
        }

        setHint(`Target set to ${monthLabel(d)}.`);
        renderFMV(d);
      });
    }

    // initial default: keep dots dark, keep p50/reg hidden, set reval dot to latest
    renderFMV(latestMonth);
  });

  return { ok:true };
}

// ------------------------------------------------------------
// Story builder (simple; your app.js may override)
// ------------------------------------------------------------
function buildStoryHTML({artistName, purchaseMonthUTC, targetMonthUTC, price, equivValue} = {}){
  const a = artistName || "";
  const pm = purchaseMonthUTC ? monthLabel(purchaseMonthUTC) : "";
  const tm = targetMonthUTC ? monthLabel(targetMonthUTC) : "";
  const p = fmtGBP(price);
  const e = fmtGBP(equivValue);

  return `
    <div class="pc-story">
      <div class="pc-story-title">${a}</div>
      <div class="pc-story-line">Purchase: <b>${p}</b> · ${pm}</div>
      <div class="pc-story-line">Revaluation: <b>${e}</b> · ${tm}</div>
    </div>
  `;
}

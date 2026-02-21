// js/workbench.js
export const workbench = (() => {
  /* ============================
     Utilities (unchanged)
  ============================ */
  function parseNumberLoose(v){
    if(v === null || v === undefined) return NaN;
    const s = String(v).trim().replace(/[£$€]/g,'').replace(/,/g,'').replace(/\s+/g,'');
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }
  function splitCSVLine(line){
    const out = [];
    let cur = "", inQ = false;
    for(let i=0;i<line.length;i++){
      const ch = line[i];
      if(ch === '"'){
        if(inQ && line[i+1] === '"'){ cur += '"'; i++; }
        else inQ = !inQ;
      }else if(ch === "," && !inQ){
        out.push(cur); cur = "";
      }else{
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }
  function ymToDate(yyyymm){
    const s = String(yyyymm).trim();
    if(!/^\d{6}$/.test(s)) return null;
    const y = Number(s.slice(0,4));
    const m = Number(s.slice(4,6));
    if(!(y>=1900 && m>=1 && m<=12)) return null;
    return new Date(Date.UTC(y, m-1, 1));
  }
  function monthDiff(a, b){
    return (b.getUTCFullYear()-a.getUTCFullYear())*12 + (b.getUTCMonth()-a.getUTCMonth());
  }
  function rollingMean(arr, win){
    const out = [], q = [];
    let sum = 0, cnt = 0;
    for(let i=0;i<arr.length;i++){
      const y = arr[i].y;
      q.push(y);
      if(Number.isFinite(y)){ sum += y; cnt += 1; }
      if(q.length > win){
        const old = q.shift();
        if(Number.isFinite(old)){ sum -= old; cnt -= 1; }
      }
      const val = (q.length === win && cnt > 0) ? (sum / cnt) : NaN;
      out.push({x: arr[i].x, y: val});
    }
    return out;
  }
  function rollingSum(arr, win){
    const out = [], q = [];
    let sum = 0;
    for(let i=0;i<arr.length;i++){
      const y = Number.isFinite(arr[i].y) ? arr[i].y : 0;
      q.push(y);
      sum += y;
      if(q.length > win) sum -= q.shift();
      out.push({x: arr[i].x, y: (q.length===win)?sum:NaN});
    }
    return out;
  }
  function ols(x, y){
    const n = x.length;
    if(n < 3) return null;
    let sx=0, sy=0, sxx=0, sxy=0;
    for(let i=0;i<n;i++){ sx+=x[i]; sy+=y[i]; sxx+=x[i]*x[i]; sxy+=x[i]*y[i]; }
    const denom = (n*sxx - sx*sx);
    if(Math.abs(denom) < 1e-12) return null;
    const b = (n*sxy - sx*sy)/denom;
    const a = (sy - b*sx)/n;

    const yhat = x.map(t => a + b*t);
    const ybar = sy/n;
    let ssTot=0, ssRes=0;
    for(let i=0;i<n;i++){
      ssTot += (y[i]-ybar)*(y[i]-ybar);
      ssRes += (y[i]-yhat[i])*(y[i]-yhat[i]);
    }
    const r2 = ssTot > 0 ? 1 - (ssRes/ssTot) : NaN;
    return {a,b,r2};
  }
  function fmtPct(v){ return Number.isFinite(v) ? (v*100).toFixed(1)+"%" : "—"; }
  function fmtShare(v){ return Number.isFinite(v) ? (v*100).toFixed(1)+"%" : "—"; }
  function fmtNum(v){
    if(!Number.isFinite(v)) return "—";
    const abs = Math.abs(v);
    if(abs >= 1e9) return (v/1e9).toFixed(2)+"B";
    if(abs >= 1e6) return (v/1e6).toFixed(2)+"M";
    if(abs >= 1e3) return (v/1e3).toFixed(2)+"k";
    return Math.round(v).toString();
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
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
  function percentileOfSorted(sorted, p){
    if(!sorted.length) return NaN;
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if(lo === hi) return sorted[lo];
    const w = idx - lo;
    return sorted[lo]*(1-w) + sorted[hi]*w;
  }

  /* ============================
     State (keyed by ArtistID)
  ============================ */
  let lotRows = []; // {id, name, date, price}
  let artists = []; // [{id,name}]
  let nameById = new Map(); // id -> name

  let monthlyByArtist = new Map(); // id -> [{date, meanPrice, medianPrice, lots, prices:[]}]
  let annualByArtist = new Map();  // id -> Map(year -> prices[])

  let metricsByArtist = new Map(); // id -> metrics object
  let currentArtistId = null;

  // Benchmarks across eligible artists
  let bench = {
    ratioShift: {arr:[], p50:NaN, p75:NaN, p90:NaN},
    cagrDiv:    {arr:[], p50:NaN, p75:NaN, p90:NaN},
    concDelta:  {arr:[], p50:NaN, p75:NaN, p90:NaN},
    meanCagr:   {arr:[], p50:NaN, p75:NaN, p90:NaN},
  };

  // DOM handles (injected after index.html loads)
  let els = null;

  function bindDOM(){
    els = {
      artistSelect: document.getElementById("artistSelect"),
      minLots24: document.getElementById("minLots24"),
      rollM: document.getElementById("rollM"),
      smoothM: document.getElementById("smoothM"),
      trendM: document.getElementById("trendM"),
      clearM: document.getElementById("clearM"),
      btnRecalc: document.getElementById("btnRecalc"),
      btnTop: document.getElementById("btnTop"),
      kpis: document.getElementById("kpis"),
      rankBody: document.querySelector("#rankTable tbody"),
      tab2: Array.from(document.querySelectorAll(".tab2")),
      minLotsEcho: document.getElementById("minLotsEcho"),
    };
  }

 /* ============================
   Parse lot-level CSV (your format)
   REQUIRED: ArtistID, ArtistName, MonthYYY, ValueGBP
   OPTIONAL: LocationID, LocationCode, AuctionID, LotNo, SaleURL
============================ */
function parseLotCSV(text){
  const lines = text.replace(/\r/g,'').split("\n").filter(l => l.trim().length);
  if(lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]).map(h => h.trim());
  const idx = (name) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());

  // required
  const iID    = idx("ArtistID");
  const iName  = idx("ArtistName");
  const iMonth = idx("MonthYYY");
  const iVal   = idx("ValueGBP");

  if(iID < 0 || iName < 0 || iMonth < 0 || iVal < 0){
    throw new Error("CSV must include headers: ArtistID, ArtistName, MonthYYY, ValueGBP");
  }

  // optional (for click-through + hover context)
  const iLocId = idx("LocationID");
  const iLocCd = idx("LocationCode");
  const iAuc   = idx("AuctionID");
  const iLot   = idx("LotNo");
  const iUrl   = idx("SaleURL");

  const rows = [];
  for(let i=1;i<lines.length;i++){
    const cells = splitCSVLine(lines[i]);

    const id = (cells[iID] ?? "").trim();
    const name = (cells[iName] ?? "").trim();
    const dt = ymToDate(cells[iMonth]);
    const price = parseNumberLoose(cells[iVal]);

    if(!id || !name || !dt || !Number.isFinite(price) || price <= 0) continue;

    const locationId   = (iLocId >= 0) ? (cells[iLocId] ?? "").trim() : "";
    const locationCode = (iLocCd >= 0) ? (cells[iLocCd] ?? "").trim() : "";
    const auctionId    = (iAuc   >= 0) ? (cells[iAuc]   ?? "").trim() : "";
    const lotNo        = (iLot   >= 0) ? (cells[iLot]   ?? "").trim() : "";
    const saleUrl      = (iUrl   >= 0) ? (cells[iUrl]   ?? "").trim() : "";

    rows.push({
      id,
      name,
      date: dt,
      price,
      // new optional fields
      locationId,
      locationCode,
      auctionId,
      lotNo,
      saleUrl
    });
  }

  return rows;
}

  /* ============================
     Aggregate: Monthly mean/median/lots/prices + Annual lists
  ============================ */
  function buildAggregates(){
    monthlyByArtist = new Map();
    annualByArtist = new Map();
    nameById = new Map();

    const monthMap = new Map(); // id -> monthTime -> {sum,cnt,prices[]}
    let minD = null, maxD = null;

    for(const r of lotRows){
      if(!minD || r.date < minD) minD = r.date;
      if(!maxD || r.date > maxD) maxD = r.date;

      nameById.set(r.id, r.name);

      const mkey = r.date.getTime();
      if(!monthMap.has(r.id)) monthMap.set(r.id, new Map());
      const mm = monthMap.get(r.id);
      if(!mm.has(mkey)) mm.set(mkey, {sum:0, cnt:0, prices:[]});
      const agg = mm.get(mkey);
      agg.sum += r.price;
      agg.cnt += 1;
      agg.prices.push(r.price);

      const yr = r.date.getUTCFullYear();
      if(!annualByArtist.has(r.id)) annualByArtist.set(r.id, new Map());
      const am = annualByArtist.get(r.id);
      if(!am.has(yr)) am.set(yr, []);
      am.get(yr).push(r.price);
    }

    // Global monthly timeline (align rolling windows)
    const timeline = [];
    let cur = new Date(Date.UTC(minD.getUTCFullYear(), minD.getUTCMonth(), 1));
    const end = new Date(Date.UTC(maxD.getUTCFullYear(), maxD.getUTCMonth(), 1));
    while(cur <= end){
      timeline.push(new Date(cur));
      cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth()+1, 1));
    }

    for(const [id, mm] of monthMap.entries()){
      const series = [];
      for(const dt of timeline){
        const k = dt.getTime();
        const agg = mm.get(k);
        if(agg){
          const pricesSorted = agg.prices.slice().sort((a,b)=>a-b);
          const mid = Math.floor(pricesSorted.length/2);
          const median = (pricesSorted.length % 2)
            ? pricesSorted[mid]
            : (pricesSorted[mid-1] + pricesSorted[mid]) / 2;

          series.push({
            date: dt,
            meanPrice: agg.sum / agg.cnt,
            medianPrice: median,
            lots: agg.cnt,
            prices: agg.prices.slice()
          });
        }else{
          series.push({ date: dt, meanPrice: NaN, medianPrice: NaN, lots: 0, prices: [] });
        }
      }
      monthlyByArtist.set(id, series);
    }

    artists = Array.from(monthlyByArtist.keys())
      .map(id => ({ id, name: nameById.get(id) || id }))
      .sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  /* ============================
     Concentration: top 10% value share per year
  ============================ */
  function topDecileShare(prices){
    if(!prices || prices.length < 10) return NaN;
    const sorted = prices.slice().sort((a,b)=>a-b);
    const n = sorted.length;
    const k = Math.max(1, Math.ceil(n * 0.10));
    let total = 0;
    for(const v of sorted) total += v;
    if(total <= 0) return NaN;
    let top = 0;
    for(let i=n-k;i<n;i++) top += sorted[i];
    return top / total;
  }

  /* ============================
     Clearing bands: rolling percentiles of pooled lot prices over last N months
  ============================ */
  function rollingClearingBands(monthlySeries, winMonths){
    const out30 = [], out50 = [], out70 = [];
    const window = [];

    for(let i=0;i<monthlySeries.length;i++){
      window.push(monthlySeries[i].prices || []);
      if(window.length > winMonths) window.shift();

      if(window.length < winMonths){
        out30.push({x: monthlySeries[i].date, y: NaN});
        out50.push({x: monthlySeries[i].date, y: NaN});
        out70.push({x: monthlySeries[i].date, y: NaN});
        continue;
      }

      const pooled = [];
      for(const arr of window){
        for(const v of arr){
          if(Number.isFinite(v) && v > 0) pooled.push(v);
        }
      }

      if(pooled.length < 10){
        out30.push({x: monthlySeries[i].date, y: NaN});
        out50.push({x: monthlySeries[i].date, y: NaN});
        out70.push({x: monthlySeries[i].date, y: NaN});
        continue;
      }

      pooled.sort((a,b)=>a-b);
      out30.push({x: monthlySeries[i].date, y: percentileOfSorted(pooled, 0.30)});
      out50.push({x: monthlySeries[i].date, y: percentileOfSorted(pooled, 0.50)});
      out70.push({x: monthlySeries[i].date, y: percentileOfSorted(pooled, 0.70)});
    }

    return {p30: out30, p50: out50, p70: out70};
  }

  /* ============================
     Metrics per artist (mostly unchanged)
  ============================ */
  function computeMetrics(id, params){
    const series = monthlyByArtist.get(id);
    if(!series || series.length < 24) return null;

    const roll = params.rollM;
    const smooth = params.smoothM;
    const trendWin = params.trendM;
    const clearWin = params.clearM;

    const meanArr = series.map(d => ({x:d.date, y:d.meanPrice}));
    const medianArr = series.map(d => ({x:d.date, y:d.medianPrice}));
    const lotsMonthlyArr = series.map(d => ({x:d.date, y:d.lots}));

    const rollMean = rollingMean(meanArr, roll);
    const smoothMean = rollingMean(rollMean, smooth);

    const rollMedian = rollingMean(medianArr, roll);
    const smoothMedian = rollingMean(rollMedian, smooth);

    const rollLots = rollingSum(lotsMonthlyArr, roll);
    const smoothLots = rollingMean(rollLots, smooth);

    const mcap = smoothMean.map((pt,i)=>{
      const L = smoothLots[i]?.y;
      const y = (Number.isFinite(pt.y) && Number.isFinite(L)) ? (pt.y * L) : NaN;
      return {x: pt.x, y};
    });

    const lastDate = series[series.length-1].date;
    const last24Start = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth()-23, 1));
    const last12Start = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth()-11, 1));
    let lots24=0, lots12=0;
    for(const d of series){
      if(d.date >= last24Start) lots24 += d.lots;
      if(d.date >= last12Start) lots12 += d.lots;
    }
    const eligible = lots24 >= params.minLots24;

    const startTrend = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth()-(trendWin-1), 1));

    // Mean trend
    const x=[], y=[];
    for(const pt of smoothMean){
      if(pt.x < startTrend) continue;
      if(!Number.isFinite(pt.y) || pt.y <= 0) continue;
      x.push(monthDiff(startTrend, pt.x));
      y.push(Math.log(pt.y));
    }
    const fit = ols(x,y);

    let meanCagr=NaN, r2=NaN, meanStart=NaN, meanEnd=NaN, absDelta=NaN;
    const meanTrendLine = smoothMean.map(pt => ({x:pt.x, y:NaN}));

    if(fit){
      r2 = fit.r2;
      meanCagr = Math.exp(fit.b * 12) - 1;
      const t0=0, t1=trendWin-1;
      meanStart = Math.exp(fit.a + fit.b*t0);
      meanEnd   = Math.exp(fit.a + fit.b*t1);
      absDelta  = meanEnd - meanStart;

      for(let i=0;i<meanTrendLine.length;i++){
        const dt = meanTrendLine[i].x;
        if(dt < startTrend) continue;
        const t = monthDiff(startTrend, dt);
        if(t < 0 || t > t1) continue;
        meanTrendLine[i].y = Math.exp(fit.a + fit.b*t);
      }
    }

    // Median trend
    const xm=[], ym=[];
    for(const pt of smoothMedian){
      if(pt.x < startTrend) continue;
      if(!Number.isFinite(pt.y) || pt.y <= 0) continue;
      xm.push(monthDiff(startTrend, pt.x));
      ym.push(Math.log(pt.y));
    }
    const fitMed = ols(xm, ym);

    let medianCagr=NaN, medianStart=NaN, medianEnd=NaN;
    const medianTrendLine = smoothMedian.map(pt => ({x:pt.x, y:NaN}));

    if(fitMed){
      medianCagr = Math.exp(fitMed.b * 12) - 1;
      const t0=0, t1=trendWin-1;
      medianStart = Math.exp(fitMed.a + fitMed.b*t0);
      medianEnd   = Math.exp(fitMed.a + fitMed.b*t1);

      for(let i=0;i<medianTrendLine.length;i++){
        const dt = medianTrendLine[i].x;
        if(dt < startTrend) continue;
        const t = monthDiff(startTrend, dt);
        if(t < 0 || t > t1) continue;
        medianTrendLine[i].y = Math.exp(fitMed.a + fitMed.b*t);
      }
    }

    const cagrDivergence = (Number.isFinite(meanCagr) && Number.isFinite(medianCagr)) ? (meanCagr - medianCagr) : NaN;

    let ratioShift=NaN;
    if(Number.isFinite(meanStart) && Number.isFinite(medianStart) && Number.isFinite(meanEnd) && Number.isFinite(medianEnd) && medianStart>0 && medianEnd>0){
      const ratioStart = meanStart / medianStart;
      const ratioEnd = meanEnd / medianEnd;
      ratioShift = ratioEnd - ratioStart;
    }

    // Mcap trend delta
    const xk=[], yk=[];
    for(const pt of mcap){
      if(pt.x < startTrend) continue;
      if(!Number.isFinite(pt.y) || pt.y <= 0) continue;
      xk.push(monthDiff(startTrend, pt.x));
      yk.push(Math.log(pt.y));
    }
    const fitM = ols(xk, yk);
    let mcapDelta=NaN;
    const mcapTrend = mcap.map(pt => ({x:pt.x, y:NaN}));
    if(fitM){
      const t0=0, t1=trendWin-1;
      const m0 = Math.exp(fitM.a + fitM.b*t0);
      const m1 = Math.exp(fitM.a + fitM.b*t1);
      mcapDelta = m1 - m0;

      for(let i=0;i<mcapTrend.length;i++){
        const dt = mcapTrend[i].x;
        if(dt < startTrend) continue;
        const t = monthDiff(startTrend, dt);
        if(t < 0 || t > t1) continue;
        mcapTrend[i].y = Math.exp(fitM.a + fitM.b*t);
      }
    }

    // Concentration annual
    const startYear = startTrend.getUTCFullYear();
    const endYear = lastDate.getUTCFullYear();
    const annualMap = annualByArtist.get(id) || new Map();

    const concSeries = [];
    for(let yr=startYear; yr<=endYear; yr++){
      const prices = annualMap.get(yr);
      const share = topDecileShare(prices);
      if(Number.isFinite(share)) concSeries.push({year: yr, share});
    }

    let concLatest = NaN, concDeltaWin = NaN;
    if(concSeries.length >= 2){
      concLatest = concSeries[concSeries.length-1].share;
      concDeltaWin = concSeries[concSeries.length-1].share - concSeries[0].share;
    }else if(concSeries.length === 1){
      concLatest = concSeries[0].share;
    }

    // Clearing bands
    const bands = rollingClearingBands(series, clearWin);

    return {
      id,
      artistName: nameById.get(id) || id,
      eligible,
      lots24, lots12,

      seriesMonthly: series,
      smoothMean,
      meanTrendLine,
      smoothMedian,
      medianTrendLine,

      meanCagr,
      medianCagr,
      cagrDivergence,
      ratioShift,

      absDelta,
      r2,

      mcap,
      mcapTrend,
      mcapDelta,

      concSeries,
      concLatest,
      concDeltaWin,

      clearP30: bands.p30,
      clearP50: bands.p50,
      clearP70: bands.p70
    };
  }

  function recalcAll(){
    if(!els) bindDOM();

    const params = {
      minLots24: Math.max(0, Number(els.minLots24.value || 0)),
      rollM: Math.max(1, Number(els.rollM.value || 12)),
      smoothM: Math.max(1, Number(els.smoothM.value || 5)),
      trendM: Math.max(12, Number(els.trendM.value || 60)),
      clearM: Math.max(12, Number(els.clearM.value || 48)),
    };
    els.minLotsEcho.textContent = String(params.minLots24);

    metricsByArtist = new Map();
    for(const a of artists){
      const m = computeMetrics(a.id, params);
      if(m) metricsByArtist.set(a.id, m);
    }

    // Benchmarks across eligible artists
    const elig = Array.from(metricsByArtist.values()).filter(m => m.eligible);
    function buildDist(getter){
      const a = elig.map(getter).filter(Number.isFinite).sort((x,y)=>x-y);
      return { arr:a, p50:quantile(a,0.50), p75:quantile(a,0.75), p90:quantile(a,0.90) };
    }
    bench.meanCagr   = buildDist(m => m.meanCagr);
    bench.cagrDiv    = buildDist(m => m.cagrDivergence);
    bench.ratioShift = buildDist(m => m.ratioShift);
    bench.concDelta  = buildDist(m => m.concDeltaWin);

    if(currentArtistId && metricsByArtist.has(currentArtistId)) renderArtist(currentArtistId);
    renderRankings("cagr");
  }

  /* ============================
     Rendering (same as yours, with id-based linking)
  ============================ */
  function renderArtist(id){
    if(!els) bindDOM();
    const m = metricsByArtist.get(id);
    if(!m) return;

    const trendM = Math.max(12, Number(els.trendM.value || 60));
    const yearsApprox = (trendM/12);
    const winLabel = `${trendM} months (≈ ${yearsApprox.toFixed(1)}y)`;

    const prMeanCagr  = percentileRank(bench.meanCagr.arr, m.meanCagr);
    const prCagrDiv   = percentileRank(bench.cagrDiv.arr, m.cagrDivergence);
    const prRatio     = percentileRank(bench.ratioShift.arr, m.ratioShift);
    const prConcDelta = percentileRank(bench.concDelta.arr, m.concDeltaWin);

    function kpiCard(label, value, tip){
      return `
        <div class="kpi" data-tip="${escapeHtml(tip)}">
          <div class="lab">${escapeHtml(label)}</div>
          <div class="val">${escapeHtml(value)}</div>
        </div>
      `;
    }

    const tipMeanCagr =
`Mean CAGR (trend-based)
Annualised compounded growth from a log-linear trend fitted to the SMOOTHED rolling MEAN price over the last ${winLabel}.
Benchmark (eligible): p50 ${fmtPct(bench.meanCagr.p50)}, p75 ${fmtPct(bench.meanCagr.p75)}, p90 ${fmtPct(bench.meanCagr.p90)}.
Percentile: ${Number.isFinite(prMeanCagr) ? prMeanCagr.toFixed(0) : "—"}th.`;

    const tipMedianCagr =
`Median CAGR (trend-based)
Same method as mean CAGR, but using the SMOOTHED rolling MEDIAN price over the last ${winLabel}.`;

    const tipCagrDiv =
`Mean–Median CAGR Δ
Difference: (Mean CAGR − Median CAGR) over ${winLabel}.
Benchmark: p50 ${fmtPct(bench.cagrDiv.p50)}, p75 ${fmtPct(bench.cagrDiv.p75)}, p90 ${fmtPct(bench.cagrDiv.p90)}.
Percentile: ${Number.isFinite(prCagrDiv) ? prCagrDiv.toFixed(0) : "—"}th.`;

    const tipRatioShift =
`Mean/Median Ratio Shift
Change in (Mean ÷ Median) between START and END of the trend window (${winLabel}), using trend-predicted levels.
Benchmark: p50 ${Number.isFinite(bench.ratioShift.p50)?bench.ratioShift.p50.toFixed(2):"—"}, p75 ${Number.isFinite(bench.ratioShift.p75)?bench.ratioShift.p75.toFixed(2):"—"}, p90 ${Number.isFinite(bench.ratioShift.p90)?bench.ratioShift.p90.toFixed(2):"—"}.
Percentile: ${Number.isFinite(prRatio) ? prRatio.toFixed(0) : "—"}th.`;

    const tipAbsDelta =
`Abs Δ Mean Price (trend-based)
Predicted end minus predicted start from the MEAN trendline over ${winLabel}.`;

    const tipMcapDelta =
`Abs Δ Mcap Proxy (trend-based)
Change in (smoothed mean price × smoothed rolling lots) using trend-predicted start/end over ${winLabel}.`;

    const tipConcLatest =
`Top-Decile Share (Latest Yr)
Share of TOTAL annual value captured by the TOP 10% of lots (by price) in the latest year within the window.`;

    const tipConcDelta =
`Δ Top-Decile Share (Window)
Change in top-decile value share from first→last available year inside the trend window (${winLabel}).
Benchmark: p50 ${fmtShare(bench.concDelta.p50)}, p75 ${fmtShare(bench.concDelta.p75)}, p90 ${fmtShare(bench.concDelta.p90)}.
Percentile: ${Number.isFinite(prConcDelta) ? prConcDelta.toFixed(0) : "—"}th.`;

    const tipR2 =
`R² (Mean trend)
How well the smoothed log-mean series fits a straight-line trend over ${winLabel}.`;

    const tipLots24 =
`Lots (last 24 months)
Liquidity threshold for inclusion. Low liquidity can distort trends and concentration.`;

    const tipLots12 =
`Lots (last 12 months)
Short-term liquidity check; sharp declines can create “thin market” concentration spikes.`;

    const tipElig =
`Eligibility
Included in rankings if Lots (last 24M) ≥ ${Number(els.minLots24.value)}.`;

    els.kpis.innerHTML = [
      kpiCard("Mean CAGR (trend-based)", fmtPct(m.meanCagr), tipMeanCagr),
      kpiCard("Median CAGR (trend-based)", fmtPct(m.medianCagr), tipMedianCagr),
      kpiCard("Mean–Median CAGR Δ", fmtPct(m.cagrDivergence), tipCagrDiv),
      kpiCard("Mean/Median Ratio Shift", Number.isFinite(m.ratioShift) ? m.ratioShift.toFixed(2) : "—", tipRatioShift),
      kpiCard("Abs Δ Mean Price", fmtNum(m.absDelta), tipAbsDelta),
      kpiCard("Abs Δ Mcap", fmtNum(m.mcapDelta), tipMcapDelta),
      kpiCard("Top-Decile Share (Latest Yr)", fmtShare(m.concLatest), tipConcLatest),
      kpiCard("Δ Top-Decile Share (Window)", fmtShare(m.concDeltaWin), tipConcDelta),
      kpiCard("Trend strength (R², mean)", Number.isFinite(m.r2) ? m.r2.toFixed(2) : "—", tipR2),
      kpiCard("Lots (last 24M)", fmtNum(m.lots24), tipLots24),
      kpiCard("Lots (last 12M)", fmtNum(m.lots12), tipLots12),
      kpiCard("Eligibility", m.eligible ? "Yes" : "No", tipElig),
    ].join("");

    // --- Price chart
    const x = m.smoothMean.map(p => p.x);
    Plotly.newPlot("chartPrice", [
      {x, y: m.smoothMean.map(p=>p.y), type:"scatter", mode:"lines", name:"Mean (smoothed rolling)"},
      {x, y: m.meanTrendLine.map(p=>p.y), type:"scatter", mode:"lines", name:"Mean trend"},
      {x, y: m.smoothMedian.map(p=>p.y), type:"scatter", mode:"lines", name:"Median (smoothed rolling)"},
      {x, y: m.medianTrendLine.map(p=>p.y), type:"scatter", mode:"lines", name:"Median trend"},
    ], {
      margin:{l:50,r:20,t:10,b:40},
      yaxis:{title:"Price (GBP)"},
      legend:{orientation:"h", y:-0.22},
      hovermode:"x unified",
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)"
    }, {displayModeBar:false, responsive:true});

    // --- Clearing bands
    Plotly.newPlot("chartClearing", [
      {x: m.clearP30.map(p=>p.x), y: m.clearP30.map(p=>p.y), type:"scatter", mode:"lines", name:"30th percentile"},
      {x: m.clearP50.map(p=>p.x), y: m.clearP50.map(p=>p.y), type:"scatter", mode:"lines", name:"50th percentile"},
      {x: m.clearP70.map(p=>p.x), y: m.clearP70.map(p=>p.y), type:"scatter", mode:"lines", name:"70th percentile"},
    ], {
      margin:{l:50,r:20,t:10,b:40},
      yaxis:{title:"Price (GBP)"},
      hovermode:"x unified",
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)"
    }, {displayModeBar:false, responsive:true});

    // --- Mcap
    Plotly.newPlot("chartMcap", [
      {x: m.mcap.map(p=>p.x), y: m.mcap.map(p=>p.y), type:"scatter", mode:"lines", name:"Mcap proxy (mean×lots)"},
      {x: m.mcapTrend.map(p=>p.x), y: m.mcapTrend.map(p=>p.y), type:"scatter", mode:"lines", name:"Mcap trend"},
    ], {
      margin:{l:50,r:20,t:10,b:40},
      yaxis:{title:"Mcap Proxy"},
      legend:{orientation:"h", y:-0.25},
      hovermode:"x unified",
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)"
    }, {displayModeBar:false, responsive:true});

    // --- Concentration
    Plotly.newPlot("chartConc", [
      {x: m.concSeries.map(d=>d.year), y: m.concSeries.map(d=>d.share), type:"scatter", mode:"lines+markers", name:"Top decile value share"},
    ], {
      margin:{l:50,r:20,t:10,b:40},
      yaxis:{title:"Share", tickformat:".0%"},
      xaxis:{title:"Year", dtick:1},
      hovermode:"x unified",
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)"
    }, {displayModeBar:false, responsive:true});

    // --- Lots
    const mx = m.seriesMonthly.map(d=>d.date);
    const my = m.seriesMonthly.map(d=>d.lots);
    Plotly.newPlot("chartLots", [
      {x: mx, y: my, type:"bar", name:"Monthly lots"}
    ], {
      margin:{l:50,r:20,t:10,b:40},
      yaxis:{title:"Lots"},
      hovermode:"x unified",
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)"
    }, {displayModeBar:false, responsive:true});
  }

  function renderRankings(which){
    if(!els) bindDOM();
    const rows = Array.from(metricsByArtist.values()).filter(m => m.eligible);

    const keyFn = {
      cagr: (m) => m.meanCagr,
      abs:  (m) => m.absDelta,
      mcap: (m) => m.mcapDelta,
      r2:   (m) => m.r2,
      conc: (m) => m.concDeltaWin
    }[which];

    rows.sort((a,b)=>{
      const av = keyFn(a), bv = keyFn(b);
      if(!Number.isFinite(av) && !Number.isFinite(bv)) return 0;
      if(!Number.isFinite(av)) return 1;
      if(!Number.isFinite(bv)) return -1;
      return bv - av;
    });

    const top = rows.slice(0, 50);
    els.rankBody.innerHTML = top.map((m,i) => `
      <tr>
        <td>${i+1}</td>
        <td><a href="#" data-id="${escapeHtml(m.id)}">${escapeHtml(m.artistName)}</a></td>
        <td>${fmtPct(m.meanCagr)}</td>
        <td>${fmtPct(m.medianCagr)}</td>
        <td>${fmtPct(m.cagrDivergence)}</td>
        <td>${Number.isFinite(m.ratioShift) ? m.ratioShift.toFixed(2) : "—"}</td>
        <td>${fmtNum(m.absDelta)}</td>
        <td>${fmtNum(m.mcapDelta)}</td>
        <td>${fmtShare(m.concLatest)}</td>
        <td>${fmtShare(m.concDeltaWin)}</td>
        <td>${Number.isFinite(m.r2) ? m.r2.toFixed(2) : "—"}</td>
        <td>${fmtNum(m.lots24)}</td>
        <td>${fmtNum(m.lots12)}</td>
      </tr>
    `).join("");

    els.rankBody.querySelectorAll("a[data-id]").forEach(a=>{
      a.addEventListener("click", (e)=>{
        e.preventDefault();
        const id = e.currentTarget.getAttribute("data-id");
        els.artistSelect.value = id;
        currentArtistId = id;
        renderArtist(id);
      });
    });
  }

  /* ============================
     Public API
  ============================ */
  function loadFromCSVText(text){
    if(!els) bindDOM();
    lotRows = parseLotCSV(text);
    if(!lotRows.length) throw new Error("No valid lot rows found. Check headers + ValueGBP numeric + MonthYYY YYYYMM.");

    buildAggregates();

  // If workbench UI exists (dashboard page), wire it.
// If not (pricecheck page), skip safely.
if (els && els.artistSelect) {

  els.artistSelect.innerHTML =
    `<option value="">Select artist…</option>` +
    artists.map(a =>
      `<option value="${escapeHtml(a.id)}">${escapeHtml(a.name)}</option>`
    ).join("");

  els.artistSelect.disabled = false;
  if (els.btnRecalc) els.btnRecalc.disabled = false;
  if (els.btnTop) els.btnTop.disabled = false;

  currentArtistId = artists[0]?.id || null;
  if (currentArtistId) els.artistSelect.value = currentArtistId;

  els.artistSelect.onchange = () => {
    const id = els.artistSelect.value;
    if (!id) return;
    currentArtistId = id;
    renderArtist(id);
  };

  if (els.btnRecalc) {
    els.btnRecalc.onclick = () => { if (artists.length) recalcAll(); };
  }

  if (els.btnTop) {
    els.btnTop.onclick = () => {
      const t = document.getElementById("rankTable");
      if (t) t.scrollIntoView({behavior:"smooth", block:"start"});
    };
  }

  if (els.tab2) {
    els.tab2.forEach(t=>{
      t.onclick = () => {
        els.tab2.forEach(x=>x.classList.remove("active"));
        t.classList.add("active");
        renderRankings(t.getAttribute("data-tab"));
      };
    });
  }

  recalcAll();
  if (currentArtistId) renderArtist(currentArtistId);
}

    // Wire workbench events once
    els.artistSelect.onchange = () => {
      const id = els.artistSelect.value;
      if(!id) return;
      currentArtistId = id;
      renderArtist(id);
    };
    els.btnRecalc.onclick = () => { if(artists.length) recalcAll(); };
    els.btnTop.onclick = () => { document.getElementById("rankTable").scrollIntoView({behavior:"smooth", block:"start"}); };

    els.tab2.forEach(t=>{
      t.onclick = () => {
        els.tab2.forEach(x=>x.classList.remove("active"));
        t.classList.add("active");
        renderRankings(t.getAttribute("data-tab"));
      };
    });

    // Initial compute + render
    recalcAll();
    if(currentArtistId) renderArtist(currentArtistId);

    return {
      rowCount: lotRows.length,
      artistCount: artists.length
    };
  }

  function getArtists(){ return artists.slice(); } // [{id,name}]
  function getArtistName(id){ return nameById.get(id) || id; }
  function getMetrics(id){ return metricsByArtist.get(id) || null; }
  function getLotRows(){ return lotRows.slice(); }

  function getArtistLotPrices(id, windowMonths = null){
    const rows = lotRows.filter(r => r.id === id).sort((a,b)=>a.date - b.date);
    if(!windowMonths) return rows.map(r=>r.price);

    const last = rows[rows.length-1]?.date;
    if(!last) return [];
    const cutoff = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth()-(windowMonths-1), 1));
    return rows.filter(r=>r.date >= cutoff).map(r=>r.price);
  }

  return {
    loadFromCSVText,
    getArtists,
    getArtistName,
    getMetrics,
    getLotRows,
    getArtistLotPrices,
    // expose these so app.js can sync:
    recalcAll,
    renderArtist,
    renderRankings,
  };
})();

// js/pricecheck.js

// ------------------------------------------------------------
// LocationCode -> "Auction house · CITY" mapping (197 entries)
// ------------------------------------------------------------
const LOCATION_LOOKUP = {
  "33AUBALI": "33 Auction · BALI",
  "33AUJAKA": "33 Auction · JAKARTA",
  "33AUONLI": "33 Auction · ONLINE",
  "33AUOSGD": "33 Auction · ONLINE SGD",
  "33AUSING": "33 Auction · SINGAPORE",
  "ARTCDROU": "Artcurial · DROUOT",
  "ARTCMARR": "Artcurial · MARRAKESH",
  "ARTCMCAR": "Artcurial · MONTE CARLO",
  "ARTCOEUR": "Artcurial · ONLINE EUR",
  "ARTCPARI": "Artcurial · PARIS",
  "ARTHLAGO": "ArtHouseNG · LAGOS",
  "AUCTONLI": "Auctionsverket · ONLINE",
  "AUCTOSEK": "Auctionsverket · ONLINE SEK",
  "AUCTSTOC": "Auctionsverket · STOCKHOLM",
  "AUCTOLDD": "Auctionsverket · ONLINE DKK",
  "AUCTOEUR": "Auctionsverket · ONLINE EUR",
  "AUCTOUSD": "Auctionsverket · ONLINE USD",
  "CHPOBEIJ": "Beijing Poly Intl · BEIJING",
  "CHPOHONG": "Beijing Poly Intl · HONG KONG",
  "BONHBRED": "Bonhams · BREDGATE",
  "BONHEDIN": "Bonhams · EDINBURGH",
  "BONHHONG": "Bonhams · HONG KONG",
  "BONHLOND": "Bonhams · LONDON",
  "BONHLOSA": "Bonhams · LOS ANGELES",
  "BONHMARL": "Bonhams · MARLBOROUGH",
  "BONHMELB": "Bonhams · MELBOURNE",
  "BONHNEWY": "Bonhams · NEW YORK",
  "BONHONLI": "Bonhams · ONLINE",
  "BONHOAUD": "Bonhams · ONLINE AUD",
  "BONHOHCF": "Bonhams · ONLINE CHF",
  "BONHODKK": "Bonhams · ONLINE DKK",
  "BONHOEUR": "Bonhams · ONLINE EUR",
  "BONHOGBP": "Bonhams · ONLINE GBP",
  "BONHOHKD": "Bonhams · ONLINE HKD",
  "BONHOUSD": "Bonhams · ONLINE USD",
  "BONHOXFO": "Bonhams · OXFORD",
  "BONHPARI": "Bonhams · PARIS",
  "BONHSANF": "Bonhams · SAN FRANCISCO",
  "BONHSYDN": "Bonhams · SYDNEY",
  "BONHBRUS": "Bonhams · BRUSSELS",
  "BUKOHELS": "Bukowskis · HELSINKY",
  "BUKOONLI": "Bukowskis · ONLINE",
  "BUKOOEUR": "Bukowskis · ONLINE EUR",
  "BUKOOSEK": "Bukowskis · ONLINE SEK",
  "BUKOSTOC": "Bukowskis · STOCKHOLM",
  "CHGUBEIJ": "China Guardian · BEIJING",
  "CHGUHONG": "China Guardian · HONG KONG",
  "CHRIAMST": "Christie's · AMSTERDAM",
  "CHRIDOHA": "Christie's · DOHA",
  "CHRIDUBA": "Christie's · DUBAI",
  "CHRIGENE": "Christie's · GENEVA",
  "CHRIHONG": "Christie's · HONG KONG",
  "CHRILOND": "Christie's · LONDON",
  "CHRIMILA": "Christie's · MILAN",
  "CHRINEWY": "Christie's · NEW YORK",
  "CHRIONLI": "Christie's · ONLINE",
  "CHRIOHCF": "Christie's · ONLINE CHF",
  "CHRIOEUR": "Christie's · ONLINE EUR",
  "CHRIOGBP": "Christie's · ONLINE GBP",
  "CHRIOHKD": "Christie's · ONLINE HKD",
  "CHRIOUSD": "Christie's · ONLINE USD",
  "CHRIPARI": "Christie's · PARIS",
  "CHRISHAN": "Christie's · SHANGHAI",
  "CHRIZURI": "Christie's · ZURICH",
  "AGUTDROU": "Claude Aguttes · DROUOT",
  "AGUTLYON": "Claude Aguttes · LYON",
  "AGUTNEUI": "Claude Aguttes · NEUILLY",
  "AGUTONLI": "Claude Aguttes · ONLINE",
  "AGUTOEUR": "Claude Aguttes · ONLINE EUR",
  "AGUTPARI": "Claude Aguttes · PARIS",
  "COUEONLI": "Couer D'Alene · ONLINE",
  "COUERENO": "Couer D'Alene · RENO",
  "DOROGRAZ": "Dorotheum · GRAZ",
  "DOROKLAG": "Dorotheum · KLAGENFURT",
  "DOROLINZ": "Dorotheum · LINZ",
  "DOROONLI": "Dorotheum · ONLINE",
  "DOROOEUR": "Dorotheum · ONLINE EUR",
  "DOROPRAG": "Dorotheum · PRAGUE",
  "DOROSALZ": "Dorotheum · SALZBURG",
  "DOROWIEN": "Dorotheum · WIEN",
  "DOYLNEWY": "Doyle · NEW YORK",
  "FARSCORT": "Farsetti · CORTINA",
  "FARSMILA": "Farsetti · MILAN",
  "FARSONLI": "Farsetti · ONLINE",
  "FARSOEUR": "Farsetti · ONLINE EUR",
  "FARSPRAT": "Farsetti · PRATO",
  "HEFFONLI": "Heffel · ONLINE",
  "HEFFOCAD": "Heffel · ONLINE CAD",
  "HEFFTORO": "Heffel · TORONTO",
  "HEFFVANC": "Heffel · VANCOUVER",
  "HERINEWY": "Heritage · NEW YORK",
  "KORNBASE": "Kornfeld · BASEL",
  "KORNBERN": "Kornfeld · BERN",
  "KORNONLI": "Kornfeld · ONLINE",
  "KORNOHCF": "Kornfeld · ONLINE CHF",
  "LARABALI": "Larasati · BALI",
  "LARAJAKA": "Larasati · JAKARTA",
  "LARALOND": "Larasati · LONDON",
  "LARAOGBP": "Larasati · ONLINE GBP",
  "LARAOSGD": "Larasati · ONLINE SGD",
  "LARASING": "Larasati · SINGAPORE",
  "LEMPBERL": "Lempertz · BERLIN",
  "LEMPBRUS": "Lempertz · BRUSSELS",
  "LEMPCOLO": "Lempertz · COLOGNE",
  "LEMPOEUR": "Lempertz · ONLINE EUR",
  "LJOEMELB": "Leonard Joel · MELBOURNE",
  "LJOEONLI": "Leonard Joel · ONLINE",
  "LJOEOAUD": "Leonard Joel · ONLINE AUD",
  "LJOESYAR": "Leonard Joel · SOUTH YARA",
  "LJOESYDN": "Leonard Joel · SYDNEY",
  "LJOEWOOL": "Leonard Joel · WOOLHARA",
  "MEETONLI": "Meeting Art · ONLINE",
  "MEETVERC": "Meeting Art · VERCELLI",
  "MORTMEXC": "Morton Subastas · MEXICO CITY",
  "MORTOMXN": "Morton Subastas · ONLINE MXN",
  "PANDFLOR": "Pandolfini · FLORENCE",
  "PANDMILA": "Pandolfini · MILAN",
  "PANDONLI": "Pandolfini · ONLINE",
  "PANDOEUR": "Pandolfini · ONLINE EUR",
  "PHILGENE": "Phillips · GENEVA",
  "PHILHONG": "Phillips · HONG KONG",
  "PHILLOND": "Phillips · LONDON",
  "PHILMOSC": "Phillips · MOSCOW",
  "PHILNEWY": "Phillips · NEW YORK",
  "PHILONLI": "Phillips · ONLINE",
  "PHILOHCF": "Phillips · ONLINE CHF",
  "PHILOEUR": "Phillips · ONLINE EUR",
  "PHILOGBP": "Phillips · ONLINE GBP",
  "PHILOHKD": "Phillips · ONLINE HKD",
  "PHILOIDR": "Phillips · ONLINE IDR",
  "PHILOUSD": "Phillips · ONLINE USD",
  "PHILPARI": "Phillips · PARIS",
  "PHILTAIP": "Phillips · TAIPEI",
  "PHILTOKY": "Phillips · TOKYO",
  "RASMBRED": "Rasmussen · BREDGATE",
  "RASMONLI": "Rasmussen · ONLINE",
  "RASMODKK": "Rasmussen · ONLINE DKK",
  "RAVEONLI": "Ravenel · ONLINE",
  "RAVEONTD": "Ravenel · ONLINE NTD",
  "RAVETAIP": "Ravenel · TAIPEI",
  "SAFFKOCH": "Saffron Art · KOCHI",
  "SAFFMUMB": "Saffron Art · MUMBAI",
  "SAFFNDEL": "Saffron Art · NEW DELHI",
  "SAFFONLI": "Saffron Art · ONLINE",
  "SAFFOINR": "Saffron Art · ONLINE INR",
  "SALCMANI": "Salcedo · MANILA",
  "SALCONLI": "Salcedo · ONLINE",
  "SALCOPHP": "Salcedo · ONLINE PHP",
  "SEOUBUSA": "Seoul · BUSAN",
  "SEQUDAEG": "Seoul · DAEGU",
  "SEOUHONG": "Seoul · HONG KONG",
  "SEOUONLI": "Seoul · ONLINE",
  "SEOUOKRW": "Seoul · ONLINE KRW",
  "SEOUSEUL": "Seoul · SEOUL",
  "SMSIMELB": "Smith & Singer · MELBOURNE",
  "SMSIONLI": "Smith & Singer · ONLINE",
  "SMSISYDN": "Smith & Singer · SYDNEY",
  "SOTHCOLO": "Sotheby's · COLOGNE",
  "SOTHDOHA": "Sotheby's · DOHA",
  "SOTHDUBA": "Sotheby's · DUBAI",
  "SOTHGENE": "Sotheby's · GENEVA",
  "SOTHHONG": "Sotheby's · HONG KONG",
  "SOTHLASV": "Sotheby's · LAS VEGAS",
  "SOTHLOND": "Sotheby's · LONDON",
  "SOTHMIAM": "Sotheby's · MIAMI",
  "SOTHMILA": "Sotheby's · MILAN",
  "SOTHMCAR": "Sotheby's · MONTE CARLO",
  "SOTHMUMB": "Sotheby's · MUMBAI",
  "SOTHNEWY": "Sotheby's · NEW YORK",
  "SOTHONLI": "Sotheby's · ONLINE",
  "SOTHOCHF": "Sotheby's · ONLINE CHF",
  "SOTHOEUR": "Sotheby's · ONLINE EUR",
  "SOTHOGBP": "Sotheby's · ONLINE GBP",
  "SOTHOHKD": "Sotheby's · ONLINE HKD",
  "SOTHOIDR": "Sotheby's · ONLINE IDR",
  "SOTHOUSD": "Sotheby's · ONLINE USD",
  "SOTHPARI": "Sotheby's · PARIS",
  "SOTHSING": "Sotheby's · SINGAPORE",
  "SOTHZURI": "Sotheby's · ZURICH",
  "SWELCAPE": "Stephan Welz · CAPE TOWN",
  "SWELJOHA": "Stephan Welz · JOHANNESBURG",
  "SWELONLI": "Stephan Welz · ONLINE",
  "SWELOZAR": "Stephan Welz · ONLINE ZAR",
  "STRACAPE": "Strauss · CAPE TOWN",
  "STRAJOHA": "Strauss · JOHANNESBURG",
  "STRAONLI": "Strauss · ONLINE",
  "STRAOZAR": "Strauss · ONLINE ZAR",
  "SWANNEWY": "Swann · NEW YORK",
  "TAJAONLI": "Tajan · ONLINE",
  "TAJAOEUR": "Tajan · ONLINE EUR",
  "TAJAPARI": "Tajan · PARIS",
  "TEHATEHR": "Tehran Auction · TEHRAN",
  "VGRIBERL": "Villa Grisebach · BERLIN",
  "VGRIONLI": "Villa Grisebach · ONLINE",
  "VGRIOEUR": "Villa Grisebach · ONLINE EUR",
  "ARTCBASE": "Artcurial · BASEL",
  "ARTCOCHF": "Artcurial · ONLINE EUR",
  "AUCTHELS": "Auktionsverket · HELSINKY",
  "SOTHSAAR": "Sothebys · SAUDI ARABIA"
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

// Weighted quantile (used for month-weighted rolling p50)
function weightedQuantile(values, weights, q){
  const arr = [];
  for(let i=0;i<values.length;i++){
    const v = values[i];
    const w = weights[i];
    if(!Number.isFinite(v) || !Number.isFinite(w) || w <= 0) continue;
    arr.push({ v, w });
  }
  if(!arr.length) return NaN;

  arr.sort((a,b)=>a.v-b.v);

  let total = 0;
  for(const a of arr) total += a.w;
  if(!(total > 0)) return NaN;

  const target = q * total;
  let cum = 0;
  for(const a of arr){
    cum += a.w;
    if(cum >= target) return a.v;
  }
  return arr[arr.length-1].v;
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
  if(!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
  return new Date(Date.UTC(y, m-1, 1));
}

function addMonthsUTC(d, deltaMonths){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + deltaMonths, 1));
}

function windowN(allRows, endDate, months){
  const start = addMonthsUTC(endDate, -(months - 1));
  return allRows.filter(r => r.date >= start && r.date <= endDate);
}

function monthKeyUTC(d){
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

// ------------------------------------------------------------
// Helpers for 24M rolling benchmarks + regression transport
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

// Movement slider (FMV) — DATE axis, bubbles show £ values
function renderMovement(el, {
  purchaseMonth,
  targetMonth,
  price,
  equivNow,
  captionText = "",
  targetLabel = "Revaluation" // NEW: label for the right-hand bubble
}){
  if(!el) return;

  if(!(purchaseMonth instanceof Date) || !(targetMonth instanceof Date)){
    el.innerHTML = "";
    return;
  }
  if(!Number.isFinite(price) || !Number.isFinite(equivNow)){
    el.innerHTML = "";
    return;
  }

  // Ensure month-start UTC
  const x0 = monthStartUTC(purchaseMonth);
  const x1 = monthStartUTC(targetMonth);

  // Rail range: a little padding left/right (in months)
  const minX = (x0 < x1) ? addMonthsUTC(x0, -6) : addMonthsUTC(x1, -6);
  const maxX = (x0 > x1) ? addMonthsUTC(x0,  6) : addMonthsUTC(x1,  6);

  const ann = [
    {
      x: x0, y: 0,
      xref:"x", yref:"y",
      text: `My Artwork<br><b>${fmtGBP(price)}</b>`,
      showarrow:false,
      xanchor:"center",
      yanchor:"bottom",
      yshift: 18,
      align:"center",
      font:{size:12, color:"#111"},
      bgcolor:"#fee7b1",
      bordercolor:"#2c3a5c",
      borderwidth:2,
      borderpad:6
    },
    {
      x: x1, y: 0,
      xref:"x", yref:"y",
      text: `${targetLabel}<br><b>${fmtGBP(equivNow)}</b>`,
      showarrow:false,
      xanchor:"center",
      yanchor:"bottom",
      yshift: 18,
      align:"center",
      font:{size:12, color:"#fff"},
      bgcolor:"#2c3a5c",
      bordercolor:"#2c3a5c",
      borderwidth:2,
      borderpad:6
    }
  ];

  Plotly.newPlot(el, [
    // baseline rail
    {
      x:[minX, maxX], y:[0,0],
      mode:"lines",
      line:{width:12,color:"rgba(44,58,92,0.10)"},
      hoverinfo:"skip",
      showlegend:false
    },

    // My Artwork dot (date positioned)
    {
      x:[x0], y:[0],
      mode:"markers",
      marker:{size:12,color:"#fee7b1",line:{width:3,color:"#2c3a5c"}},
      hoverinfo:"skip",
      showlegend:false
    },

    // Right-hand dot (date positioned)
    {
      x:[x1], y:[0],
      mode:"markers",
      marker:{size:11,color:"#2c3a5c"},
      hoverinfo:"skip",
      showlegend:false
    }
  ],{
    margin:{l:22,r:22,t:62,b:38},
    xaxis:{
      type:"date",
      range:[minX, maxX],
      showgrid:false,
      zeroline:false,
      showline:false,
      ticks:"outside",
      ticklen:4,
      tickformat:"%Y",
      dtick:"M24"
    },
    yaxis:{visible:false, range:[-1.2, 0.9]},
    annotations: ann,
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  },{displayModeBar:false, responsive:true});

  const capEl = document.getElementById("pc-move-caption");
  if(capEl) capEl.textContent = captionText;
}

// CSV fields (coming cleanly from data.js)
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

  // NEW: distinguish between "user supplied date" and "fallback date"
  const userMonthDate = parseYYYYMM(myMonthYYYYMM);
  const hasUserMonth = !!userMonthDate;

  const artworkDate = userMonthDate || all[all.length-1].date;
  const purchaseMonth = monthStartUTC(artworkDate);
  const latestDate  = all[all.length-1].date;

  const TRANSPORT_WINDOW_MONTHS = 24;
  const MIN_SALES_IN_WINDOW = 10;

  // ------------------------------------------------------------
  // Scatter universe
  // ------------------------------------------------------------
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
  // Rolling 24M benchmarks + regressions
  // - month-weighted p50 median
  // - month-weighted arithmetic mean
  // ------------------------------------------------------------
  const months = buildMonthRangeUTC(all[0].date, all[all.length-1].date);
  const allM = all.map(r => ({ ...r, _m: monthStartUTC(r.date) }));

  let startPtr = 0;
  let endPtr = 0;

  const p50Dates = [];
  const p50Vals  = [];
  const p50T     = [];

  const meanDates = [];
  const meanVals  = [];
  const meanT     = [];

  const monthToT = new Map();

  for(let i=0;i<months.length;i++){
    const endMonth = months[i];
    const startMonth = addMonthsUTC(endMonth, -(TRANSPORT_WINDOW_MONTHS - 1));

    while(endPtr < allM.length && allM[endPtr]._m <= endMonth) endPtr++;
    while(startPtr < allM.length && allM[startPtr]._m < startMonth) startPtr++;

    const win = allM.slice(startPtr, endPtr);
    if(win.length < MIN_SALES_IN_WINDOW) continue;

    // Month-weighting: each month broadly equal, with floor to stop 1-sale months dominating
    const MIN_SALES_PER_MONTH = 5;

    const monthCounts = new Map();
    for(const r of win){
      const k = monthKeyUTC(r._m);
      monthCounts.set(k, (monthCounts.get(k) || 0) + 1);
    }

    const vals = [];
    const wts  = [];
    for(const r of win){
      const v = r.price;
      if(!Number.isFinite(v)) continue;
      const k = monthKeyUTC(r._m);
      const c = monthCounts.get(k) || 1;
      vals.push(v);
      wts.push(1 / Math.max(c, MIN_SALES_PER_MONTH));
    }
    if(vals.length < MIN_SALES_IN_WINDOW) continue;

    // p50 (month-weighted)
    const med = weightedQuantile(vals, wts, 0.5);
    if(!Number.isFinite(med) || med <= 0) continue;

    // arithmetic mean (using same month weights to prevent dense months dominating)
    let wSum = 0, vwSum = 0;
    for(let j=0;j<vals.length;j++){
      const v = vals[j];
      const w = wts[j];
      wSum += w;
      vwSum += v * w;
    }
    const mean = (wSum > 0) ? (vwSum / wSum) : NaN;
    if(!Number.isFinite(mean) || mean <= 0) continue;

    p50Dates.push(endMonth);
    p50Vals.push(med);
    p50T.push(i);

    meanDates.push(endMonth);
    meanVals.push(mean);
    meanT.push(i);

    monthToT.set(monthKeyUTC(endMonth), i);
  }

  // regressions in log space (keeps multiplicative behaviour)
  let regP50 = null;
  if(p50T.length >= 2){
    regP50 = ols(p50T, p50Vals.map(v => Math.log(v)));
  }

  let regMean = null;
  if(meanT.length >= 2){
    regMean = ols(meanT, meanVals.map(v => Math.log(v)));
  }

  const regP50Dates = [];
  const regP50Vals  = [];
  if(regP50){
    for(let i=0;i<months.length;i++){
      const v = Math.exp(regP50.a + regP50.b * i);
      if(Number.isFinite(v) && v > 0){
        regP50Dates.push(months[i]);
        regP50Vals.push(v);
      }
    }
  }

  const regMeanDates = [];
  const regMeanVals  = [];
  if(regMean){
    for(let i=0;i<months.length;i++){
      const v = Math.exp(regMean.a + regMean.b * i);
      if(Number.isFinite(v) && v > 0){
        regMeanDates.push(months[i]);
        regMeanVals.push(v);
      }
    }
  }

  // ------------------------------------------------------------
  // Pick FMV engine: use whichever trend is closest to My Artwork at purchase month
  // (distance in log space => compares multiplicative gap)
  // ------------------------------------------------------------
  function trendAtPurchase(regObj){
    const tInput = monthToT.get(monthKeyUTC(purchaseMonth));
    if(!regObj || !Number.isFinite(tInput)) return NaN;
    const v = Math.exp(regObj.a + regObj.b * tInput);
    return (Number.isFinite(v) && v > 0) ? v : NaN;
  }

  const p50AtPurchase  = trendAtPurchase(regP50);
  const meanAtPurchase = trendAtPurchase(regMean);

  let engine = "p50";
  if(Number.isFinite(price) && price > 0){
    const hasP50  = Number.isFinite(p50AtPurchase);
    const hasMean = Number.isFinite(meanAtPurchase);

    if(!hasP50 && hasMean) engine = "mean";
    else if(hasP50 && !hasMean) engine = "p50";
    else if(hasP50 && hasMean){
      const dP50  = Math.abs(Math.log(price) - Math.log(p50AtPurchase));
      const dMean = Math.abs(Math.log(price) - Math.log(meanAtPurchase));
      engine = (dMean < dP50) ? "mean" : "p50";
    }
  }

  const activeReg = (engine === "mean") ? regMean : regP50;

  // ------------------------------------------------------------
  // Chart traces (both sets exist, but we only show ONE set at a time)
  // ------------------------------------------------------------

  // IMPORTANT: SVG traces for lines so they draw above WebGL dots
  const p50Trace = (p50Dates.length >= 2) ? {
    x:p50Dates,
    y:p50Vals,
    type:"scatter",
    mode:"lines",
    line:{width:3.5, color:"rgba(47,59,99,0.45)"},
    hovertemplate:"24M rolling median (p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_p50_24"
  } : null;

  const regP50Trace = (regP50Dates.length >= 2) ? {
    x:regP50Dates,
    y:regP50Vals,
    type:"scatter",
    mode:"lines",
    line:{width:4.5, color:"rgba(47,59,99,0.90)"},
    hovertemplate:"Trend line (regression through rolling p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_p50_reg"
  } : null;

  const meanTrace = (meanDates.length >= 2) ? {
    x:meanDates,
    y:meanVals,
    type:"scatter",
    mode:"lines",
    line:{width:3.5, color:"rgba(47,59,99,0.45)"},
    hovertemplate:"24M rolling mean (arith)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_mean_24"
  } : null;

  const regMeanTrace = (regMeanDates.length >= 2) ? {
    x:regMeanDates,
    y:regMeanVals,
    type:"scatter",
    mode:"lines",
    line:{width:4.5, color:"rgba(47,59,99,0.90)"},
    hovertemplate:"Trend line (regression through rolling mean)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_mean_reg"
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

  // Revaluation/Context dot on scatter (hidden until FMV opened; updated if target month used)
  const rightDotLabel = hasUserMonth ? "Revaluation" : "Context";
  const revalTrace = {
    x:[monthStartUTC(latestDate)],
    y:[NaN],
    type:"scattergl",
    mode:"markers",
    marker:{size:12, color:"#2c3a5c"},
    hovertemplate:`${rightDotLabel}<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>`,
    showlegend:false,
    visible:false,
    meta:"pc_reval"
  };

  const traces = [baseTrace];
  if(p50Trace) traces.push(p50Trace);
  if(regP50Trace) traces.push(regP50Trace);
  if(meanTrace) traces.push(meanTrace);
  if(regMeanTrace) traces.push(regMeanTrace);
  if(myArtworkTrace) traces.push(myArtworkTrace);
  traces.push(revalTrace);

  const plotPromise = Plotly.newPlot(elChart, traces, {
    margin:{l:56,r:22,t:26,b:48},
    yaxis:{type:(yScale==="log")?"log":"linear"},
    xaxis:{type:"date"},
    hovermode:"closest",
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, {responsive:true, displayModeBar:false});

  // Enable click-through to sale page
  elChart.on?.("plotly_click", (ev) => {
    const pt = ev?.points?.[0];
    const url = pt?.customdata?.[2];
    if(url) window.open(url, "_blank", "noopener,noreferrer");
  });

  // ------------------------------------------------------------
  // Purchase percentile (unchanged; used elsewhere in UI)
  // ------------------------------------------------------------
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  // ------------------------------------------------------------
  // FMV translation: implied value at any target month (ACTIVE engine)
  // ------------------------------------------------------------
  function impliedValueAtWith(regObj, targetMonthUTC){
    if(!regObj || !Number.isFinite(price) || price <= 0) return null;

    const tInput  = monthToT.get(monthKeyUTC(purchaseMonth));
    const tTarget = monthToT.get(monthKeyUTC(monthStartUTC(targetMonthUTC)));

    if(!Number.isFinite(tInput) || !Number.isFinite(tTarget)) return null;

    const winInput  = windowN(all, purchaseMonth, TRANSPORT_WINDOW_MONTHS);
    const winTarget = windowN(all, monthStartUTC(targetMonthUTC), TRANSPORT_WINDOW_MONTHS);

    if(winInput.length < MIN_SALES_IN_WINDOW || winTarget.length < MIN_SALES_IN_WINDOW) return null;

    const pInput  = Math.exp(regObj.a + regObj.b * tInput);
    const pTarget = Math.exp(regObj.a + regObj.b * tTarget);

    if(!Number.isFinite(pInput) || !Number.isFinite(pTarget) || pInput <= 0 || pTarget <= 0) return null;

    return price * (pTarget / pInput);
  }

  const equivLatest = impliedValueAtWith(activeReg, monthStartUTC(latestDate));

  // Copy for the FMV panel (reflect chosen engine, and whether date was provided)
  const engineNoun = (engine === "mean") ? "arithmetic mean" : "rolling median (p50)";

  const FMV_COPY =
    "Fair market value is best estimated from the market’s central tendency, not its extremes.\n" +
    "This module calculates a 24-month rolling benchmark of auction prices and fits a trend line.\n" +
    (hasUserMonth
      ? `Because your price point sits closer to the ${engineNoun} trend, we use it to revalue your purchase price.`
      : `Because your price point sits closer to the ${engineNoun} trend, we select it for context against the ‘My Artwork’ price.`);

  plotPromise.then(() => {
    const gd = elChart;

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0";

    const data = (gd && gd.data) ? gd.data : [];
    const idxBase   = data.findIndex(t => t && t.meta === "pc_base");
    const idxP50    = data.findIndex(t => t && t.meta === "pc_p50_24");
    const idxP50Reg = data.findIndex(t => t && t.meta === "pc_p50_reg");
    const idxMean   = data.findIndex(t => t && t.meta === "pc_mean_24");
    const idxMeanReg= data.findIndex(t => t && t.meta === "pc_mean_reg");
    const idxRev    = data.findIndex(t => t && t.meta === "pc_reval");

    let btn = document.getElementById("pc-move-toggle");
    const panel  = document.getElementById("pc-move");
    const moveEl = document.getElementById("pc-move-chart");

    const optin = document.getElementById("pc-add-target");
    const box   = document.getElementById("pc-target-ui");
    const input = document.getElementById("pc-target-month");
    const hint  = document.getElementById("pc-target-hint");

    const contextEl = document.getElementById("pc-context-text");
    if(contextEl){
      contextEl.textContent = FMV_COPY;
      contextEl.style.whiteSpace = "pre-line";
    }

    if(!btn || !panel || !moveEl) return;

    // Kill previous click listeners by cloning the toggle button
    const btnClone = btn.cloneNode(true);
    btn.parentNode.replaceChild(btnClone, btn);
    btn = btnClone;

    const monthLabel = (d) =>
      d.toLocaleString("en-GB", { month:"short", year:"numeric", timeZone:"UTC" });

    const clearTargetUI = () => {
      if(optin) optin.checked = false;
      if(box) box.classList.add("hidden");
      if(input) input.value = "";
      if(hint) hint.textContent = "";
    };

    const setRevalDot = (dUTC, val, visible) => {
      if(idxRev < 0) return;
      const x = dUTC ? [monthStartUTC(dUTC)] : [monthStartUTC(latestDate)];
      const y = (Number.isFinite(val)) ? [val] : [NaN];
      Plotly.restyle(gd, { x, y, visible: !!visible }, [idxRev]);
    };

    const hideAllLines = () => {
      if(idxP50    >= 0) Plotly.restyle(gd, { visible:false }, [idxP50]);
      if(idxP50Reg >= 0) Plotly.restyle(gd, { visible:false }, [idxP50Reg]);
      if(idxMean   >= 0) Plotly.restyle(gd, { visible:false }, [idxMean]);
      if(idxMeanReg>= 0) Plotly.restyle(gd, { visible:false }, [idxMeanReg]);
    };

    const showActiveLines = () => {
      const useMean = (engine === "mean");
      if(useMean){
        if(idxMean    >= 0) Plotly.restyle(gd, { visible:true }, [idxMean]);
        if(idxMeanReg >= 0) Plotly.restyle(gd, { visible:true }, [idxMeanReg]);
        if(idxP50     >= 0) Plotly.restyle(gd, { visible:false }, [idxP50]);
        if(idxP50Reg  >= 0) Plotly.restyle(gd, { visible:false }, [idxP50Reg]);
      } else {
        if(idxP50     >= 0) Plotly.restyle(gd, { visible:true }, [idxP50]);
        if(idxP50Reg  >= 0) Plotly.restyle(gd, { visible:true }, [idxP50Reg]);
        if(idxMean    >= 0) Plotly.restyle(gd, { visible:false }, [idxMean]);
        if(idxMeanReg >= 0) Plotly.restyle(gd, { visible:false }, [idxMeanReg]);
      }
    };

    const applyBaseline = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": DARK_DOT }, [idxBase]);
      hideAllLines();
      setRevalDot(latestDate, NaN, false);

      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▾";

      moveEl.innerHTML = "";
      clearTargetUI();
    };

    const renderLatest = () => {
      const targetLabel = hasUserMonth ? "Revaluation" : "Context";

      if(Number.isFinite(equivLatest)){
        renderMovement(moveEl, {
          purchaseMonth,
          targetMonth: monthStartUTC(latestDate),
          price,
          equivNow: equivLatest,
          captionText: "For retrospective valuations, add target month to calculate.",
          targetLabel
        });
      } else {
        moveEl.innerHTML = "";
      }
      setRevalDot(latestDate, equivLatest, true);
    };

    const applyMovementOn = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": LIGHT_DOT }, [idxBase]);
      showActiveLines();

      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▴";

      renderLatest();
      clearTargetUI();
    };

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if(isOpen) applyBaseline();
      else applyMovementOn();
    });

    if(optin && box){
      optin.onchange = () => {
        const on = !!optin.checked;
        box.classList.toggle("hidden", !on);

        if(!on){
          renderLatest();
          if(hint) hint.textContent = "";
          if(input) input.value = "";
          return;
        }

        if(hint) hint.textContent = "Enter a month in YYYYMM.";
      };
    }

    if(input){
      input.addEventListener("input", () => {
        if(!optin || !optin.checked) return;

        const d = parseYYYYMM(input.value);
        if(!d){
          if(hint) hint.textContent = "Use YYYYMM (e.g. 201906).";
          return;
        }

        // Clamp into available month range
        const minD = months[0];
        const maxD = months[months.length - 1];
        const d2 = (d < minD) ? minD : (d > maxD ? maxD : d);

        const equiv = impliedValueAtWith(activeReg, d2);
        if(!Number.isFinite(equiv)){
          if(hint) hint.textContent = "Not enough auction activity around one of the selected dates.";
          setRevalDot(d2, NaN, true);
          moveEl.innerHTML = "";
          return;
        }

        const targetLabel = hasUserMonth ? "Revaluation" : "Context";

        renderMovement(moveEl, {
          purchaseMonth,
          targetMonth: d2,
          price,
          equivNow: equiv,
          captionText: "For retrospective valuations, add target month to recalculate.",
          targetLabel
        });

        setRevalDot(d2, equiv, true);

        if(hint) hint.textContent = `Target set to ${monthLabel(d2)}.`;
      });
    }

    // Always baseline after each run
    applyBaseline();
  });

  return { pct, equivNow: equivLatest, plotPromise, engine };
}

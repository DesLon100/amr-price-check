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

// Try to find the "see your price movement" toggle robustly
function findMovementToggle(){
  // 1) common ids (in case you later standardise)
  const idCandidates = [
    "pc-show-movement",
    "pc-see-movement",
    "pc-movement",
    "pc-price-movement",
    "pc-see-price-movement",
    "see-price-movement",
    "toggle-price-movement"
  ];
  for(const id of idCandidates){
    const el = document.getElementById(id);
    if(el && (el.type === "checkbox" || el.getAttribute("role") === "switch")) return el;
  }

  // 2) search labels containing the exact copy (case-insensitive)
  const want = "see your price movement";
  const labels = Array.from(document.querySelectorAll("label"));
  for(const lab of labels){
    const txt = (lab.textContent || "").trim().toLowerCase();
    if(txt.includes(want)){
      const forId = lab.getAttribute("for");
      if(forId){
        const cb = document.getElementById(forId);
        if(cb && (cb.type === "checkbox" || cb.getAttribute("role") === "switch")) return cb;
      }
      const cb2 = lab.querySelector('input[type="checkbox"]');
      if(cb2) return cb2;
    }
  }

  // 3) as a last resort: any checkbox whose aria-label matches
  const cbs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  for(const cb of cbs){
    const a = (cb.getAttribute("aria-label") || "").trim().toLowerCase();
    if(a.includes(want)) return cb;
  }

  return null;
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
      text:[`Indicative value today: ${fmtGBP(equivNow)}`], hoverinfo:"text", showlegend:false }
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
  const MIN_SALES_IN_WINDOW = 10; // per your latest instruction

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
    marker:{size:6, color:"#2f3b63"}, // normal on load
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

  // Optional “my percentile” rolling line (still computed, but only usable once movement mode is ON)
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

  // p50 + regression traces start hidden; shown only after "see your price movement" is ON
  const p50Trace = (p50Dates.length >= 2) ? {
    x: p50Dates,
    y: p50Vals,
    type:"scatter",
    mode:"lines",
    line:{width:3.5, color:"rgba(47,59,99,0.45)"},
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
    line:{width:4.5, color:"rgba(47,59,99,0.90)"},
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
    visible:false, // stays off by default; also forced off if movement mode is off
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

  // Assemble traces: base dots always present; lines hidden until toggle
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
  // Revaluation (regression through rolling p50)
  // ------------------------------------------------------------
  let equivNow = null;

  try{
    if(reg && Number.isFinite(price) && price > 0){
      const t0 = monthToT.get(monthKeyUTC(purchaseMonth));
      const t1 = monthToT.get(monthKeyUTC(monthStartUTC(latestDate)));

      if(Number.isFinite(t0) && Number.isFinite(t1)){
        const win0 = windowN(all, purchaseMonth, TRANSPORT_WINDOW_MONTHS);
        const win1 = windowN(all, monthStartUTC(latestDate), TRANSPORT_WINDOW_MONTHS);

        if(win0.length >= MIN_SALES_IN_WINDOW && win1.length >= MIN_SALES_IN_WINDOW){
          const p0 = Math.exp(reg.a + reg.b * t0);
          const p1 = Math.exp(reg.a + reg.b * t1);

          if(Number.isFinite(p0) && Number.isFinite(p1) && p0 > 0 && p1 > 0){
            equivNow = price * (p1 / p0);
          }
        }
      }
    }
  } catch(e){
    equivNow = null;
  }

  // ------------------------------------------------------------
  // UI behaviour:
  // - scatter shown normally on load
  // - ONLY after "see your price movement" is ON:
  //     * show p50 + regression
  //     * switch dots to LIGHT BLUE (100% opacity)
  //     * allow my-percentile line toggle
  //     * show movement slider (pc-move-chart)
  // ------------------------------------------------------------
  plotPromise.then(() => {
    const cbMove = findMovementToggle();

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0"; // light blue, full opacity

    const gd = elChart;
    const data = (gd && gd.data) ? gd.data : [];

    const idxBase = data.findIndex(t => t && t.meta === "pc_base");
    const idxP50  = data.findIndex(t => t && t.meta === "pc_p50_24");
    const idxReg  = data.findIndex(t => t && t.meta === "pc_p50_reg");
    const idxMy   = data.findIndex(t => t && t.meta === "pc_mypercentile_24");

    const cbPct = document.getElementById("pc-show-mypercentile"); // optional existing checkbox

    const applyMode = (on) => {
      if(idxBase >= 0){
        Plotly.restyle(gd, { "marker.color": on ? LIGHT_DOT : DARK_DOT }, [idxBase]);
      }
      if(idxP50 >= 0){
        Plotly.restyle(gd, { visible: on ? true : false }, [idxP50]);
      }
      if(idxReg >= 0){
        Plotly.restyle(gd, { visible: on ? true : false }, [idxReg]);
      }

      // If movement is OFF: force-hide my percentile line (and untick its checkbox if present)
      if(!on && idxMy >= 0){
        Plotly.restyle(gd, { visible: false }, [idxMy]);
        if(cbPct) cbPct.checked = false;
      }
    };

    // Hook my-percentile checkbox (if present) but only allow when movement is ON
    if(cbPct && idxMy >= 0){
      const onPctChange = () => {
        const movementOn = cbMove ? !!cbMove.checked : true;
        Plotly.restyle(gd, { visible: (movementOn && cbPct.checked) ? true : false }, [idxMy]);
      };
      cbPct.addEventListener("change", onPctChange);
      onPctChange();
    }

    // Movement slider render/clear
    const moveEl = document.getElementById("pc-move-chart");
    const capEl  = document.getElementById("pc-move-caption");

    const renderOrClearMovement = () => {
      const on = cbMove ? !!cbMove.checked : false; // default OFF if toggle exists
      if(!moveEl) return;

      if(!on){
        moveEl.innerHTML = "";
        if(capEl) capEl.textContent = "";
        return;
      }

      if(Number.isFinite(equivNow)){
        renderMovement(moveEl, {
          price,
          equivNow,
          captionText:
            "Indicative value today is estimated by tracking the artist’s typical market level: " +
            "we calculate a 24-month rolling median (p50), fit a trend line through it, " +
            "then revalue your purchase price by the change in that trend between your purchase month and today."
        });
      } else {
        moveEl.innerHTML = "";
        if(capEl){
          capEl.textContent = "Not enough recent auction activity to estimate an indicative value today for this artist.";
        }
      }
    };

    // If there is no movement toggle on the page, keep current behaviour (don’t force-hide lines)
    if(!cbMove){
      // No toggle found: do nothing (scatter stays dark; lines remain hidden as set above)
      // If you *want* fallback auto-show, change this to applyMode(true).
      return;
    }

    // Initial state should reflect toggle
    applyMode(!!cbMove.checked);
    renderOrClearMovement();

    cbMove.addEventListener("change", () => {
      const on = !!cbMove.checked;
      applyMode(on);
      renderOrClearMovement();

      // If turning OFF, also ensure my percentile line is off (handled in applyMode)
      if(cbPct && idxMy >= 0 && !on){
        Plotly.restyle(gd, { visible: false }, [idxMy]);
      }
    });
  });

  return { pct, equivNow, plotPromise };
}

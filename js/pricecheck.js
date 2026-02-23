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

// ------------------------------------------------------------
// Slider (value line) — with colour-coded speech bubbles
// ------------------------------------------------------------
function renderMovement(el, {
  price,
  equivNow,
  captionText = "",
  axisMinDate = null,
  axisMaxDate = null
}){
  if(!el) return;

  if(!Number.isFinite(price) || !Number.isFinite(equivNow)){
    el.innerHTML = "";
    return;
  }

  // Colors consistent with dots
  const C_MY_FILL   = "#fee7b1";
  const C_MY_STROKE = "#2c3a5c";
  const C_REV_FILL  = "#2c3a5c";
  const C_REV_TEXT  = "#ffffff";

  const xmin = Math.min(price, equivNow);
  const xmax = Math.max(price, equivNow);
  const span = (xmax - xmin) || Math.max(1, xmax * 0.08);
  const pad = span * 0.18;

  // Wider padding helps prevent edge clipping
  const range = [Math.max(0, xmin - pad), xmax + pad];

  const xMy  = price;
  const xRev = equivNow;

  // Smart anchors so the bubble doesn't fall off the edges
  const r0 = range[0], r1 = range[1];
  const frac = (x) => (r1 === r0) ? 0.5 : (x - r0) / (r1 - r0);

  const myAnchor  = frac(xMy)  > 0.78 ? "right" : (frac(xMy) < 0.22 ? "left" : "center");
  const revAnchor = frac(xRev) > 0.78 ? "right" : (frac(xRev) < 0.22 ? "left" : "center");

  const annotations = [
    {
      x: xMy, y: 0,
      xref: "x", yref: "y",
      text: `My Artwork<br><b>${fmtGBP(price)}</b>`,
      showarrow: false,
      xanchor: myAnchor,
      yanchor: "bottom",
      yshift: 14,
      align: "center",
      bgcolor: C_MY_FILL,
      bordercolor: C_MY_STROKE,
      borderwidth: 2,
      borderpad: 8,
      font: { color: "#111", size: 12 }
    },
    {
      x: xRev, y: 0,
      xref: "x", yref: "y",
      text: `Revaluation<br><b>${fmtGBP(equivNow)}</b>`,
      showarrow: false,
      xanchor: revAnchor,
      yanchor: "bottom",
      yshift: 14,
      align: "center",
      bgcolor: C_REV_FILL,
      bordercolor: C_REV_FILL,
      borderwidth: 2,
      borderpad: 8,
      font: { color: C_REV_TEXT, size: 12 }
    }
  ];

  // Date axis under the FMV slider: we fake a date axis by writing tick labels
  // as years from min/max in dataset, but the x-axis here is value.
  // Your screenshot shows years under the value line — that is coming from your existing renderMovement.
  // We keep it simple: no change needed here unless you want a full dual-axis chart.

  Plotly.newPlot(el, [
  // track
  {
    x:[range[0], range[1]], y:[0,0],
    mode:"lines",
    line:{width:12,color:"rgba(44,58,92,0.10)"},
    hoverinfo:"skip",
    showlegend:false
  },

  // My artwork (dot + bubble)
  {
    x:[price], y:[0],
    mode:"markers+text",
    marker:{size:12,color:"#fee7b1",line:{width:3,color:"#2c3a5c"}},
    text:[`My Artwork<br><b>${fmtGBP(price)}</b>`],
    textposition:"top center",
    textfont:{size:12},
    cliponaxis:false,
    hoverinfo:"skip",
    showlegend:false
  },

  // Revaluation (dot + bubble)
  {
    x:[equivNow], y:[0],
    mode:"markers+text",
    marker:{size:11,color:"#2c3a5c"},
    text:[`Revaluation<br><b>${fmtGBP(equivNow)}</b>`],
    textposition:"top center",
    textfont:{size:12},
    cliponaxis:false,
    hoverinfo:"skip",
    showlegend:false
  }
],{
  margin:{l:16,r:16,t:44,b:34},          // ↑ more top space for bubbles
  xaxis:{
    range,
    showgrid:false, zeroline:false, showline:false,
    ticks:"outside", ticklen:4, separatethousands:true
  },
  yaxis:{visible:false, range:[-1.2, 0.9]}, // ↑ room above y=0 for bubbles
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

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------
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

  const purchaseMonth = monthStartUTC(artworkDate);

  // Scatter base
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
  // Precompute 24M rolling p50 + regression
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

  // Lines should render ABOVE WebGL dots -> use SVG scatter for lines
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

  // Revaluation dot (hidden until FMV is opened)
  const revalTrace = {
    x:[monthStartUTC(latestDate)],
    y:[null],
    type:"scattergl",
    mode:"markers",
    marker:{size:12, color:"#2c3a5c"},
    hovertemplate:`Revaluation<br>%{x|%b %Y}<br><b>%{y:,.0f}</b><extra></extra>`,
    showlegend:false,
    visible:false,
    meta:"pc_reval"
  };

  const traces = [];
  traces.push(baseTrace);
  if(p50Trace) traces.push(p50Trace);
  if(regTrace) traces.push(regTrace);
  if(myArtworkTrace) traces.push(myArtworkTrace);
  traces.push(revalTrace);

  const plotPromise = Plotly.newPlot(elChart, traces, {
    margin:{l:56,r:26,t:26,b:48},
    yaxis:{type:(yScale==="log")?"log":"linear"},
    xaxis:{type:"date"},
    hovermode:"closest",
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, {responsive:true, displayModeBar:false});

  // Percentile at purchase month (kept for return)
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  // ------------------------------------------------------------
  // Core “implied FMV at month” (regression ratio)
  // ------------------------------------------------------------
  function impliedValueAt(targetMonthUTC){
    try{
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
    } catch(e){
      return null;
    }
  }

  // Baseline equivNow = “today” (latest month)
  const equivNow = impliedValueAt(monthStartUTC(latestDate));

  // ------------------------------------------------------------
  // Deterministic UI binding (button + panel)
  // ------------------------------------------------------------
  plotPromise.then(() => {
    const gd = elChart;

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0";

    const dataNow = (gd && gd.data) ? gd.data : [];
    const idxBase = dataNow.findIndex(t => t && t.meta === "pc_base");
    const idxP50  = dataNow.findIndex(t => t && t.meta === "pc_p50_24");
    const idxReg  = dataNow.findIndex(t => t && t.meta === "pc_p50_reg");
    const idxReval = dataNow.findIndex(t => t && t.meta === "pc_reval");

    let btn = document.getElementById("pc-move-toggle");
    const panel = document.getElementById("pc-move");
    const moveEl = document.getElementById("pc-move-chart");
    const capEl  = document.getElementById("pc-move-caption");

    // Context paragraph under FMV header
    const contextEl = document.getElementById("pc-context-text");

   
   // Target-month UI (MATCHES YOUR HTML)
const optin  = document.getElementById("pc-add-target");   // checkbox
const box    = document.getElementById("pc-target-ui");    // hidden container
const input  = document.getElementById("pc-target-month"); // YYYYMM input
const status = document.getElementById("pc-target-hint");  // hint span

const clearTargetUI = () => {
  if(optin) optin.checked = false;
  if(box) box.classList.add("hidden");
  if(input) input.value = "";
  if(status) status.textContent = "";
};

// show/hide + recalc
if(optin && box){
  optin.onchange = () => {
    const on = !!optin.checked;
    box.classList.toggle("hidden", !on);

    if(!on){
      if(status) status.textContent = "";
      // revert to “today”
      renderForTarget(monthStartUTC(latestDate));
      return;
    }

    // if turning on, try parse immediately
    const d = parseYYYYMM(input ? input.value : "");
    if(d){
      if(status) status.textContent = `Target set to ${d.toLocaleString("en-GB",{month:"short",year:"numeric",timeZone:"UTC"})}.`;
      renderForTarget(d);
    } else {
      if(status) status.textContent = "Enter a target month as YYYYMM.";
    }
  };
}

// live input updates (only when opt-in is ON)
if(input){
  input.addEventListener("input", () => {
    if(!optin || !optin.checked) return;
    const d = parseYYYYMM(input.value);
    if(d){
      if(status) status.textContent = `Target set to ${d.toLocaleString("en-GB",{month:"short",year:"numeric",timeZone:"UTC"})}.`;
      renderForTarget(d);
    } else {
      if(status) status.textContent = "Enter a target month as YYYYMM.";
    }
  });
}

    // Kill old listeners on the toggle button
    const btnClone = btn.cloneNode(true);
    btn.parentNode.replaceChild(btnClone, btn);
    btn = btnClone;

    const setChevron = (open) => {
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = open ? "▴" : "▾";
    };

    const setContextCopy = () => {
      if(!contextEl) return;
      // You asked for this exact paragraph
      contextEl.innerHTML =
        "- Fair market value is best estimated from the market’s central tendency, not its extremes." +
        "= This module calculates a 24-month rolling median (p50) of auction prices and fits a trend line." +
        "= We then revalue your purchase price by the movement of that trend from your purchase to current or target date.";
    };

    const clearTargetUI = () => {
      if(optin) optin.checked = false;
      if(box) box.classList.add("hidden");
      if(input) input.value = "";
      if(status) status.textContent = "";
    };

    const updateRevalDot = (targetMonthUTC) => {
      if(idxReval < 0) return;

      const v = impliedValueAt(targetMonthUTC);
      if(!Number.isFinite(v)){
        Plotly.restyle(gd, { visible:false }, [idxReval]);
        return;
      }

      Plotly.restyle(
        gd,
        { x:[[monthStartUTC(targetMonthUTC)]], y:[[v]], visible:true },
        [idxReval]
      );
    };

    const applyBaseline = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": DARK_DOT }, [idxBase]);
      if(idxP50  >= 0) Plotly.restyle(gd, { visible:false }, [idxP50]);
      if(idxReg  >= 0) Plotly.restyle(gd, { visible:false }, [idxReg]);
      if(idxReval >= 0) Plotly.restyle(gd, { visible:false }, [idxReval]);

      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      setChevron(false);

      if(moveEl) moveEl.innerHTML = "";
      if(capEl) capEl.textContent = "";

      clearTargetUI();
    };

    const applyMovementOn = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": LIGHT_DOT }, [idxBase]);
      if(idxP50  >= 0) Plotly.restyle(gd, { visible:true }, [idxP50]);
      if(idxReg  >= 0) Plotly.restyle(gd, { visible:true }, [idxReg]);

      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      setChevron(true);
    };

    const renderForMonth = (targetMonthUTC) => {
      if(!moveEl) return;

      const v = impliedValueAt(targetMonthUTC);

      if(Number.isFinite(v)){
        renderMovement(moveEl, {
          price,
          equivNow: v,
          captionText: "For retrospective valuations, add target month to recalculate."
        });
      } else {
        moveEl.innerHTML = "";
        if(capEl){
          capEl.textContent =
            "Not enough auction activity around one of the selected dates to compute a fair-market translation.";
        }
      }

      // Also update the scatter revaluation dot
      updateRevalDot(targetMonthUTC);
    };

    const parseTargetInputMonth = () => {
  if(!input) return null;
  return parseYYYYMM(input.value); // already returns month-start DateUTC or null
};

    const setTargetStatus = (d) => {
  if(!status) return;
  if(!d){
    status.textContent = "";
    return;
  }
  const label = d.toLocaleString("en-GB", { month:"short", year:"numeric", timeZone:"UTC" });
  status.textContent = `Target set to ${label}.`;
};

    // Set the paragraph copy once results exist
    setContextCopy();

    // Start baseline always
    applyBaseline();

    // Bind “Add target month”
    if(optin){
  optin.onchange = () => {
    const on = !!optin.checked;

    if(box) box.classList.toggle("hidden", !on);

    if(on){
      const d = parseTargetInputMonth();
      setTargetStatus(d);
      if(d) renderForMonth(d);
    } else {
      setTargetStatus(null);
      renderForMonth(monthStartUTC(latestDate));
    }
  };
}

    // Bind input typing (YYYYMM)
    if(input){
  input.addEventListener("input", () => {
    if(!optin || !optin.checked) return;
    const d = parseTargetInputMonth();
    setTargetStatus(d);
    if(d) renderForMonth(d);
  });
}

    // Bind FMV toggle
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if(isOpen){
        applyBaseline();
      } else {
        applyMovementOn();

        // First show “today” (latest)
        renderForMonth(monthStartUTC(latestDate));

        // Target month UI stays closed unless user opts in
        clearTargetUI();
      }
    });
  });

  return { pct, equivNow, plotPromise };
}
